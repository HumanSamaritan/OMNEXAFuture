import { NextResponse } from "next/server";
import {
  availableSlotsForDate,
  bookingPublicConfig,
  getClientKey,
  rateLimited,
  readBookingSession
} from "@/lib/booking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function bearer(request: Request): string {
  const value = request.headers.get("authorization") || "";
  return value.startsWith("Bearer ") ? value.slice(7).trim() : "";
}

export async function GET(request: Request) {
  try {
    const clientKey = getClientKey(request);
    if (rateLimited("booking-availability", clientKey, 40, 10 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many availability checks. Please try again shortly." },
        { status: 429, headers: { "Retry-After": "300" } }
      );
    }

    const session = readBookingSession(bearer(request));
    if (!session) {
      return NextResponse.json(
        { error: "Your scheduling session has expired. Please verify again." },
        { status: 401 }
      );
    }

    const config = bookingPublicConfig();
    if (!config.configured) {
      return NextResponse.json(
        { error: "Online scheduling is temporarily unavailable." },
        { status: 503 }
      );
    }

    const date = new URL(request.url).searchParams.get("date") || "";
    const slots = await availableSlotsForDate(date);

    return NextResponse.json({
      ok: true,
      date,
      slots,
      booking: config
    });
  } catch (error) {
    console.error(
      "Booking availability error",
      error instanceof Error ? error.message : "Unknown availability error"
    );
    return NextResponse.json(
      { error: "Unable to load available times right now." },
      { status: 500 }
    );
  }
}
