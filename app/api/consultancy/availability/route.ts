import { NextResponse } from "next/server";
import { availableSlotsForDate } from "@/lib/booking";
import { authorisedOrder, publicPaymentError } from "@/lib/consultancy-http";
import { verifyOrderPayment } from "@/lib/consultancy-payments";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    const order = await authorisedOrder(request);
    await verifyOrderPayment(order);
    const date = new URL(request.url).searchParams.get("date") || "";
    return NextResponse.json({ slots: await availableSlotsForDate(date, order.minutes) }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { const result = publicPaymentError(error); return NextResponse.json({ error: result.error }, { status: result.status }); }
}
