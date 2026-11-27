import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { queryPilotApplicationsByEmail } from "@/lib/pilot-firestore";
import { limitPilot } from "@/lib/pilot-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const noStore = { "Cache-Control": "private, no-store, max-age=0" };
const eligibleStatuses = new Set(["approved", "invited", "active"]);
const allowedProducts = new Set(["nexavirama", "nexakriya", "human-machine-sadhana"]);

function validSignature(timestamp: string, raw: string, signature: string) {
  const secret = process.env.PILOT_APP_ACCESS_SECRET || "";
  const time = Number(timestamp);
  if (secret.length < 64 || !Number.isFinite(time) || Math.abs(Date.now() - time) > 60_000 || !/^[a-f0-9]{64}$/i.test(signature)) return false;
  const expected = createHmac("sha256", secret).update(timestamp + "\n" + raw).digest();
  const supplied = Buffer.from(signature, "hex");
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

function statusFor(data: Record<string, unknown>, slug: string) {
  const app = (data.application && typeof data.application === "object" ? data.application : {}) as Record<string, unknown>;
  const access = (data.productAccess && typeof data.productAccess === "object" ? data.productAccess : {}) as Record<string, unknown>;
  const product = String(data.productSlug || app.productSlug || "");
  const products = Array.isArray(data.productSlugs) ? data.productSlugs
    : Array.isArray(app.productSlugs) ? app.productSlugs
    : Array.isArray(data.products) ? data.products.map((item: any) => item?.slug)
    : [];
  const included = product === slug || products.includes(slug) || Object.prototype.hasOwnProperty.call(access, slug);
  if (!included) return "";
  const scoped = access[slug];
  return String(scoped || data.status || "").trim().toLowerCase();
}

export async function POST(request: NextRequest) {
  try {
    if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
      return NextResponse.json({ state: "unavailable" }, { status: 415, headers: noStore });
    }
    const raw = await request.text();
    if (Buffer.byteLength(raw) > 4000) return NextResponse.json({ state: "unavailable" }, { status: 413, headers: noStore });
    const timestamp = request.headers.get("x-pilot-timestamp") || "";
    const signature = request.headers.get("x-pilot-signature") || "";
    if (!validSignature(timestamp, raw, signature)) return NextResponse.json({ state: "unavailable" }, { status: 401, headers: noStore });
    const body = JSON.parse(raw) as { email?: unknown; productSlug?: unknown };
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const productSlug = typeof body.productSlug === "string" ? body.productSlug : "";
    if (!/^\S+@\S+\.\S+$/.test(email) || !allowedProducts.has(productSlug)) {
      return NextResponse.json({ state: "unavailable" }, { status: 400, headers: noStore });
    }
    limitPilot("product-access", productSlug + ":" + email, 60, 10 * 60_000);
    const applications = await queryPilotApplicationsByEmail(email, request);
    let registered = false;
    let approved = false;
    for (const item of applications) {
      const status = statusFor(item.data, productSlug);
      if (!status) continue;
      registered = true;
      if (eligibleStatuses.has(status)) approved = true;
    }
    return NextResponse.json({ state: approved ? "eligible" : registered ? "under_review" : "not_registered" }, { headers: noStore });
  } catch {
    return NextResponse.json({ state: "unavailable" }, { status: 503, headers: noStore });
  }
}
