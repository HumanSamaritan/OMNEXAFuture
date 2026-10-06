import QRCode from "qrcode";
import { NextResponse } from "next/server";
import { getAdminEmail } from "@/lib/admin-session";

export async function GET(request: Request) {
  const admin = await getAdminEmail();
  if (!admin) return new NextResponse("Unauthorised", { status: 401 });

  const url = new URL(request.url);
  const data = (url.searchParams.get("data") || "").trim();
  if (!data || data.length > 1200) return new NextResponse("Invalid QR data", { status: 400 });

  const svg = await QRCode.toString(data, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 1,
    width: 260,
    color: { dark: "#07152b", light: "#ffffff" }
  });

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "private, no-store"
    }
  });
}
