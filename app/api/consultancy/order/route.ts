import { NextResponse } from "next/server";
import { authorisedOrder, publicPaymentError } from "@/lib/consultancy-http";
import { bookingRecord, verifyOrderPayment } from "@/lib/consultancy-payments";
import { findConsultancyService } from "@/lib/consultancy";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    const order = await authorisedOrder(request);
    await verifyOrderPayment(order);
    return NextResponse.json({ service: findConsultancyService(order.serviceId)?.title, minutes: order.minutes, email: order.identity.email, booking: await bookingRecord(order.id) }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { const result = publicPaymentError(error); return NextResponse.json({ error: result.error }, { status: result.status }); }
}
