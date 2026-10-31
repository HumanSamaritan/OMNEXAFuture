import { notifyVerifiedPayment } from "@/lib/consultancy-notifications";
import { NextResponse } from "next/server";
import { getOrder, paidBookingConfigured, redis, ORDER_TTL, stripe, verifyOrderPayment } from "@/lib/consultancy-payments";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!paidBookingConfigured()) return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  const raw = await request.text();
  if (Buffer.byteLength(raw) > 1048576) return NextResponse.json({ error: "Too large" }, { status: 413 });
  let event;
  try { event = stripe().webhooks.constructEvent(raw, request.headers.get("stripe-signature") || "", process.env.STRIPE_WEBHOOK_SECRET!); }
  catch { return NextResponse.json({ error: "Invalid signature" }, { status: 400 }); }
  try {
    if (["checkout.session.completed", "checkout.session.async_payment_succeeded"].includes(event.type)) {
      const session = event.data.object as { id: string; payment_status?: string; metadata?: { orderId?: string } };
      if (session.payment_status !== "paid") return NextResponse.json({ received: true });
      const order = session.metadata?.orderId ? await getOrder(session.metadata.orderId) : null;
      if (order && order.checkoutId === session.id) {
        await verifyOrderPayment(order);
        await notifyVerifiedPayment(order);
      }
    }
    if (event.type === "checkout.session.async_payment_failed") {
      const session = event.data.object as { id: string; metadata?: { orderId?: string } };
      const order = session.metadata?.orderId ? await getOrder(session.metadata.orderId) : null;
      if (order?.checkoutId === session.id) await redis().set(`consultancy:failed:${order.id}`, { failedAt: new Date().toISOString(), checkoutId: session.id }, { ex: ORDER_TTL });
    }
    return NextResponse.json({ received: true });
  } catch { return NextResponse.json({ error: "Reconciliation pending" }, { status: 500 }); }
}
