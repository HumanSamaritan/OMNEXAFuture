import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  createGoogleCalendarBooking,
  getClientKey,
  rateLimited,
  readBookingSession,
  sameOriginRequest,
  validateRequestedSlot
} from "@/lib/booking";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 4096;
const ownerEmail = process.env.CONTACT_TO_EMAIL || "dhiraj.kumar@omnexagoc.com";
const fromEmail =
  process.env.CONTACT_FROM_EMAIL || "OMNeXa Website <onboarding@resend.dev>";

function bearer(request: Request): string {
  const value = request.headers.get("authorization") || "";
  return value.startsWith("Bearer ") ? value.slice(7).trim() : "";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function notifyOwner(args: {
  name: string;
  email: string;
  company: string;
  jobTitle: string;
  focus: string;
  start: string;
}) {
  if (!process.env.RESEND_API_KEY) return;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: fromEmail,
      to: [ownerEmail],
      replyTo: args.email,
      subject: `New OMNeXa booking: ${args.name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:680px;line-height:1.6;color:#172033">
          <h2>New OMNeXa introductory booking</h2>
          <p><strong>Name:</strong> ${escapeHtml(args.name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(args.email)}</p>
          <p><strong>Company:</strong> ${escapeHtml(args.company)}</p>
          <p><strong>Role:</strong> ${escapeHtml(args.jobTitle)}</p>
          <p><strong>Start:</strong> ${escapeHtml(args.start)}</p>
          <p><strong>Focus:</strong> ${escapeHtml(args.focus || "Not provided")}</p>
        </div>
      `
    });
  } catch (error) {
    console.error(
      "Booking owner notification failed",
      error instanceof Error ? error.message : "Unknown email error"
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!sameOriginRequest(request)) {
      return NextResponse.json({ error: "Cross-origin request blocked." }, { status: 403 });
    }

    const clientKey = getClientKey(request);
    if (rateLimited("booking-create", clientKey, 4, 30 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many booking attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": "1800" } }
      );
    }

    const session = readBookingSession(bearer(request));
    if (!session) {
      return NextResponse.json(
        { error: "Your scheduling session has expired. Please start again." },
        { status: 401 }
      );
    }

    const length = Number(request.headers.get("content-length") || 0);
    if (Number.isFinite(length) && length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Request is too large." }, { status: 413 });
    }

    const body = (await request.json()) as { start?: unknown };
    const start = String(body.start || "").trim();
    const slot = await validateRequestedSlot(start);

    // Availability is re-checked server-side immediately before insertion.
    if (!slot) {
      return NextResponse.json(
        { error: "That time is no longer available. Please choose another slot." },
        { status: 409 }
      );
    }

    let booking;
    try {
      booking = await createGoogleCalendarBooking(session, slot);
    } catch (error) {
      if (error instanceof Error && error.message === "SLOT_TAKEN") {
        return NextResponse.json(
          { error: "That time was just booked. Please choose another slot." },
          { status: 409 }
        );
      }
      throw error;
    }

    void notifyOwner({
      name: session.name,
      email: session.email,
      company: session.company,
      jobTitle: session.jobTitle,
      focus: session.focus,
      start: slot.start
    });

    return NextResponse.json({
      ok: true,
      booking: {
        start: slot.start,
        end: slot.end,
        durationMinutes: 30,
        timeZone: "Asia/Singapore",
        email: session.email,
        eventId: booking.eventId,
        meetLink: booking.meetLink || null
      }
    });
  } catch (error) {
    console.error(
      "Booking creation error",
      error instanceof Error ? error.message : "Unknown booking error"
    );
    return NextResponse.json(
      { error: "Unable to confirm the meeting right now. Please try another time or contact OMNeXa." },
      { status: 500 }
    );
  }
}
