import { NextResponse } from "next/server";
import { Resend } from "resend";

const toEmail = process.env.CONTACT_TO_EMAIL || "dhiraj.kumar@omnexagoc.com";
const fromEmail = process.env.CONTACT_FROM_EMAIL || "OMNeXa Website <onboarding@resend.dev>";
const replyEmail = process.env.CONTACT_REPLY_EMAIL || toEmail;
const sendConfirmationEmail = process.env.CONTACT_SEND_CONFIRMATION === "true";

const MAX_BODY_BYTES = 16_384;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

type RateEntry = { count: number; resetAt: number };

const globalForContactRateLimit = globalThis as typeof globalThis & {
  __omnexaContactRateLimit?: Map<string, RateEntry>;
};

const contactRateLimit =
  globalForContactRateLimit.__omnexaContactRateLimit ?? new Map<string, RateEntry>();

globalForContactRateLimit.__omnexaContactRateLimit = contactRateLimit;

function clean(value: unknown): string {
  return String(value || "").trim();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function plainText(value: string): string {
  return value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function getClientKey(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  return forwardedFor || realIp || "unknown";
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = contactRateLimit.get(key);

  if (!entry || entry.resetAt <= now) {
    contactRateLimit.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  entry.count += 1;
  contactRateLimit.set(key, entry);
  return false;
}

function exceeds(value: string, max: number): boolean {
  return value.length > max;
}

function getErrorMessage(error: unknown): string {
  if (!error) return "Unknown email provider error.";
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && "message" in error) {
    return String((error as { message?: unknown }).message || "Unknown email provider error.");
  }
  return "Unknown email provider error.";
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return NextResponse.json({ error: "Unsupported request format." }, { status: 415 });
    }

    const requestOrigin = new URL(request.url).origin;
    const origin = request.headers.get("origin");
    if (origin && origin !== requestOrigin) {
      return NextResponse.json({ error: "Cross-origin request blocked." }, { status: 403 });
    }

    const contentLength = Number(request.headers.get("content-length") || 0);
    if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Request is too large." }, { status: 413 });
    }

    const rawBody = await request.text();
    if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Request is too large." }, { status: 413 });
    }

    let body: Record<string, unknown>;
    try {
      body = JSON.parse(rawBody) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    // Basic honeypot spam check. Real users will never see or fill this field.
    if (clean(body.companyWebsite)) {
      return NextResponse.json({ ok: true });
    }

    const clientKey = getClientKey(request);
    if (isRateLimited(clientKey)) {
      return NextResponse.json(
        { error: "Too many enquiries from this connection. Please try again later." },
        { status: 429, headers: { "Retry-After": "600" } }
      );
    }

    const name = clean(body.name);
    const email = clean(body.email);
    const phone = clean(body.phone);
    const organisation = clean(body.organisation);
    const interest = clean(body.interest);
    const message = clean(body.message);

    if (exceeds(name, 100) || exceeds(email, 254) || exceeds(phone, 40)) {
      return NextResponse.json({ error: "One or more fields are too long." }, { status: 400 });
    }

    if (exceeds(organisation, 160) || exceeds(interest, 120) || exceeds(message, 4000)) {
      return NextResponse.json({ error: "One or more fields are too long." }, { status: 400 });
    }

    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (!interest) {
      return NextResponse.json({ error: "Please select an area of interest." }, { status: 400 });
    }

    if (!message || message.length < 10) {
      return NextResponse.json({ error: "Please enter a short message." }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("Contact form email service is not configured.");
      return NextResponse.json(
        { error: "Email service is temporarily unavailable. Please email us directly." },
        { status: 503 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const safeMessage = escapeHtml(plainText(message)).replace(/\n/g, "<br />");

    const ownerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 680px; line-height: 1.6; color: #172033;">
        <h2 style="color:#0f172a;">New OMNeXa Website Enquiry</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}</p>
        <p><strong>Organisation:</strong> ${escapeHtml(organisation || "Not provided")}</p>
        <p><strong>Area of interest:</strong> ${escapeHtml(interest)}</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
      </div>
    `;

    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 680px; line-height: 1.6; color: #172033;">
        <h2 style="color:#0f172a;">Thank you for contacting OMNeXa</h2>
        <p>Dear ${escapeHtml(name)},</p>
        <p>Thank you for reaching out to OMNeXa. We have received your enquiry and will review it shortly.</p>
        <p><strong>Area of interest:</strong> ${escapeHtml(interest)}</p>
        <p><strong>Your message:</strong></p>
        <p>${safeMessage}</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
        <p>If you need to add anything, you can reply to this email or write to ${escapeHtml(replyEmail)}.</p>
        <p>Regards,<br />OMNeXa</p>
      </div>
    `;

    const ownerResult = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: email,
      subject: `OMNeXa enquiry: ${interest}`,
      html: ownerHtml
    });

    if (ownerResult.error) {
      console.error("Resend owner email error", {
        error: getErrorMessage(ownerResult.error)
      });
      return NextResponse.json(
        { error: "Unable to send the enquiry right now. Please email us directly." },
        { status: 502 }
      );
    }

    if (sendConfirmationEmail) {
      const confirmationResult = await resend.emails.send({
        from: fromEmail,
        to: [email],
        replyTo: replyEmail,
        subject: "We received your OMNeXa enquiry",
        html: confirmationHtml
      });

      if (confirmationResult.error) {
        console.error("Resend confirmation email error", {
          error: getErrorMessage(confirmationResult.error)
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form error", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "Unable to send enquiry right now. Please email us directly." },
      { status: 500 }
    );
  }
}
