import { NextResponse } from "next/server";
import {
  bookingPublicConfig,
  createBookingSession,
  getClientKey,
  isPersonalEmail,
  rateLimited,
  requireWorkEmail,
  sameOriginRequest,
  sanitizeBookingIdentity,
  validateBookingIdentity,
  verifyRecaptcha
} from "@/lib/booking";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 12_288;

export async function POST(request: Request) {
  try {
    if (!sameOriginRequest(request)) {
      return NextResponse.json({ error: "Cross-origin request blocked." }, { status: 403 });
    }

    const contentType = request.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return NextResponse.json({ error: "Unsupported request format." }, { status: 415 });
    }

    const length = Number(request.headers.get("content-length") || 0);
    if (Number.isFinite(length) && length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Request is too large." }, { status: 413 });
    }

    const raw = await request.text();
    if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Request is too large." }, { status: 413 });
    }

    let body: Record<string, unknown>;
    try {
      body = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    // Honeypot: bots often fill hidden fields.
    if (String(body.companyWebsite || "").trim()) {
      return NextResponse.json({ error: "Unable to continue." }, { status: 400 });
    }

    const clientKey = getClientKey(request);
    if (rateLimited("booking-session", clientKey, 6, 10 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many booking attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": "600" } }
      );
    }

    const identity = sanitizeBookingIdentity(body);
    const validationError = validateBookingIdentity(identity);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    if (requireWorkEmail() && isPersonalEmail(identity.email)) {
      return NextResponse.json(
        { error: "Please use your work email address for partnership and business bookings." },
        { status: 400 }
      );
    }

    const captchaToken = String(body.captchaToken || "").trim();
    if (!process.env.RECAPTCHA_SECRET_KEY) {
      return NextResponse.json(
        { error: "Booking verification is temporarily unavailable." },
        { status: 503 }
      );
    }

    const captchaOk = await verifyRecaptcha(captchaToken, clientKey);
    if (!captchaOk) {
      return NextResponse.json(
        { error: "Please complete the reCAPTCHA verification again." },
        { status: 400 }
      );
    }

    const token = createBookingSession(identity);
    return NextResponse.json({
      ok: true,
      token,
      booking: bookingPublicConfig()
    });
  } catch (error) {
    console.error(
      "Booking session error",
      error instanceof Error ? error.message : "Unknown booking session error"
    );
    return NextResponse.json(
      { error: "Unable to start scheduling right now. Please try again shortly." },
      { status: 500 }
    );
  }
}
