import { Resend } from "resend";
import { type ConsultancyOrder, redis, ORDER_TTL } from "./consultancy-payments";
import { findConsultancyService } from "./consultancy";
export async function notifyVerifiedPayment(order: ConsultancyOrder) {
  if (!process.env.RESEND_API_KEY) throw new Error("PAYMENT_EMAIL_UNAVAILABLE");
  const key = `consultancy:payment-notified:${order.id}`;
  if (await redis().get(key)) return;
  const service = findConsultancyService(order.serviceId);
  const result = await new Resend(process.env.RESEND_API_KEY).emails.send({
    from: process.env.CONTACT_FROM_EMAIL || "OMNeXa Website <onboarding@resend.dev>",
    to: [order.identity.email],
    replyTo: "dhiraj.kumar@omnexagoc.com",
    subject: "OMNeXa payment received — choose your consultancy time",
    text: `Your payment for ${service?.title || "one consultancy session"} (${order.currency.toUpperCase()} ${(order.amount / 100).toFixed(2)}) has been verified.\n\nAn appointment has not yet been booked. Open this link in the same browser used for payment to select a time:\nhttps://www.omnexagoc.com/consultancy/booking?order=${order.id}\n\nIf you cannot find a suitable time, lost browser access, or need a cancellation or refund, reply with your Stripe receipt. Do not make another payment.\n\nReference: ${order.id}`
  }, { idempotencyKey: `consultancy-payment-${order.id}` });
  if (result.error) throw new Error("PAYMENT_EMAIL_FAILED");
  await redis().set(key, true, { ex: ORDER_TTL });
}
