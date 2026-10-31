import { withCalendarLock } from "@/lib/discovery";
import { NextResponse } from "next/server";
import { createBookingSession, createGoogleCalendarBooking, existingPaidCalendarBooking, readBookingSession, validateRequestedSlot } from "@/lib/booking";
import { authorisedOrder, publicPaymentError } from "@/lib/consultancy-http";
import { bookingRecord, confirmBookingRecord, reserveBooking, releaseUnsubmittedReservation, withBookingLock, verifyOrderPayment } from "@/lib/consultancy-payments";
import { findConsultancyService } from "@/lib/consultancy";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const order = await authorisedOrder(request);
    await verifyOrderPayment(order);
    const raw = await request.text();
    if (Buffer.byteLength(raw) > 1024) return NextResponse.json({ error: "Request too large." }, { status: 413 });
    const { start } = JSON.parse(raw);
    const booking = await withBookingLock(order.id, () => withCalendarLock(async () => {
      const existing = await bookingRecord(order.id);
      if (existing?.status === "confirmed") return existing;
      let reserved = existing;
      if (!reserved) {
        const slot = await validateRequestedSlot(String(start || ""), order.minutes);
        if (!slot) throw new Error("SLOT_TAKEN");
        reserved = await reserveBooking(order.id, slot, order.identity.email);
      }
      const session = readBookingSession(createBookingSession(order.identity, order.serviceId, order.id));
      if (!session) throw new Error("UNAUTHORISED");
      let event: { eventId: string; meetLink?: string } | null = await existingPaidCalendarBooking(session, reserved);
      if (!event) {
        if (!(await validateRequestedSlot(reserved.start, order.minutes))) {
          await releaseUnsubmittedReservation(order.id, reserved);
          throw new Error("SLOT_TAKEN");
        }
        // A lost insertion response leaves a reservation for safe recovery on retry.
        event = await createGoogleCalendarBooking(session, reserved, findConsultancyService(order.serviceId)?.title);
      }
      const confirmed = { ...reserved, status: "confirmed" as const, eventId: event.eventId, meetLink: event.meetLink };
      await confirmBookingRecord(confirmed);
      return confirmed;
    }));
    return NextResponse.json({ booking });
  } catch (error) { const result = publicPaymentError(error); return NextResponse.json({ error: result.error }, { status: result.status }); }
}
