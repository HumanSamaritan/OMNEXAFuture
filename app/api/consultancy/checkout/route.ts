import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { bookingPublicConfig, getClientKey, rateLimited, sameOriginRequest, sanitizeBookingIdentity, validateBookingIdentity, verifyRecaptcha } from "@/lib/booking";
import { assertOmnexaAccount, makeOrder, ORDER_TTL, paidBookingConfigured, PAYMENT_COOKIE, paymentsPublicTerms, redis, saveOrder, stripe } from "@/lib/consultancy-payments";
import { findConsultancyService } from "@/lib/consultancy";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    if (!sameOriginRequest(request)) return NextResponse.json({ error: "Cross-origin request blocked." }, { status: 403 });
    if (!paidBookingConfigured() || !paymentsPublicTerms()) return NextResponse.json({ error: "Online paid checkout is not yet available. Request a session from OMNeXa." }, { status: 503 });
    const key = getClientKey(request);
    // Durable limiter, not a per-function memory counter.
    const bucket = `consultancy:checkout-limit:${key}:${Math.floor(Date.now() / 600000)}`;
    const count = await redis().incr(bucket);
    if (count === 1) await redis().expire(bucket, 600);
    if (count > 5 || rateLimited("consultancy-checkout", key, 5)) return NextResponse.json({ error: "Please try again later." }, { status: 429 });
    const raw = await request.text();
    if (Buffer.byteLength(raw) > 12288) return NextResponse.json({ error: "Request too large." }, { status: 413 });
    const body = JSON.parse(raw);
    const service = findConsultancyService(String(body.serviceId || ""));
    if (!service || body.companyWebsite || body.acceptTerms !== true) return NextResponse.json({ error: "Choose a service and accept the payment terms." }, { status: 400 });
    const identity = sanitizeBookingIdentity(body);
    identity.company ||= "Individual"; identity.jobTitle ||= "Consultancy participant";
    const validation = validateBookingIdentity(identity);
    if (validation || identity.focus.length < 10) return NextResponse.json({ error: validation || "Describe your main question." }, { status: 400 });
    if (!(await verifyRecaptcha(String(body.captchaToken || ""), key, request.headers.get("user-agent") || undefined))) return NextResponse.json({ error: "Please complete human verification." }, { status: 400 });
    await assertOmnexaAccount();
    const { order, proof } = makeOrder(identity, service.id);
    await saveOrder(order);
    const origin = process.env.VERCEL_ENV === "production" ? "https://www.omnexagoc.com" : new URL(request.url).origin;
    const session = await stripe().checkout.sessions.create({
      mode: "payment", integration_identifier: `omnexa_consultancy_${randomBytes(8).toString("hex").replace(/[0-9]/g, "a").slice(0, 8)}`, customer_email: identity.email,
      client_reference_id: order.id, metadata: { orderId: order.id, serviceId: service.id },
      line_items: [{ quantity: 1, price_data: { currency: order.currency, unit_amount: order.amount, product_data: { name: `OMNeXa — ${service.title}`, description: `${service.minutes}-minute online session. Calendar selection follows verified payment.` } } }],
      success_url: `${origin}/consultancy/booking?order=${order.id}`,
      cancel_url: `${origin}/consultancy/book?service=${service.id}`,
      custom_text: { submit: { message: "Payment purchases one session; it does not reserve a time. Return to OMNeXa to select a calendar slot. Contact OMNeXa if no suitable slot is available." } },
      expires_at: Math.floor(Date.now() / 1000) + 1800
    }, { idempotencyKey: `consultancy:${order.id}` });
    order.checkoutId = session.id;
    await saveOrder(order);
    const response = NextResponse.json({ url: session.url });
    response.cookies.set(PAYMENT_COOKIE, `${order.id}.${proof}`, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: ORDER_TTL });
    return response;
  } catch {
    return NextResponse.json({ error: "Unable to start checkout. No session is booked. Contact OMNeXa before trying another payment." }, { status: 503 });
  }
}
