import { createHash, randomBytes, randomUUID, timingSafeEqual } from "crypto";
import Stripe from "stripe";
import { Redis } from "@upstash/redis";
import { consultancySessions, findConsultancyService } from "./consultancy";
import { bookingPublicConfig, type BookingIdentity, type BookingSlot } from "./booking";

// Intentionally pinned to OMNeXa, never the separate Future Plus account.
export const OMNEXA_STRIPE_ACCOUNT = "acct_1ULeSSPoPz27HNVw";
export const PAYMENT_COOKIE = "omnexa_consultancy_order";
export const ORDER_TTL = 180 * 24 * 60 * 60;
export type ConsultancyOrder = {
  id: string; proofHash: string; identity: BookingIdentity; serviceId: string;
  amount: number; currency: string; minutes: number; createdAt: string;
  checkoutId?: string;
};
export type ReservedBooking = BookingSlot & { orderId: string; eventId?: string; meetLink?: string; email: string; status: "pending" | "confirmed" };

export function paidBookingConfigured() {
  return process.env.CONSULTANCY_PAID_BOOKING_ENABLED === "true" &&
    !!process.env.STRIPE_SECRET_KEY && !!process.env.STRIPE_WEBHOOK_SECRET && !!process.env.RESEND_API_KEY &&
    !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN &&
    !!paymentsPublicTerms() && (process.env.BOOKING_SESSION_SECRET || "").length >= 32 &&
    !!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && !!process.env.RECAPTCHA_ENTERPRISE_API_KEY &&
    !!process.env.RECAPTCHA_PROJECT_ID && bookingPublicConfig().configured;
}
export function redis() { return Redis.fromEnv(); }
export function stripe() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("PAYMENTS_UNAVAILABLE");
  return new Stripe(process.env.STRIPE_SECRET_KEY, { maxNetworkRetries: 2, timeout: 15000 });
}
export async function assertOmnexaAccount() {
  const account = await stripe().accounts.retrieve(null);
  const live = process.env.CONSULTANCY_STRIPE_MODE === "live";
  const expectedAccount = live ? OMNEXA_STRIPE_ACCOUNT : process.env.CONSULTANCY_TEST_STRIPE_ACCOUNT;
  if (!expectedAccount || account.id !== expectedAccount) throw new Error("ACCOUNT_MISMATCH");
  if (process.env.VERCEL_ENV === "production" && !live) throw new Error("LIVE_MODE_REQUIRED");
  if (live && (!account.charges_enabled || !account.payouts_enabled)) throw new Error("ACCOUNT_NOT_READY");
  if (live !== /^[sr]k_live_/.test(process.env.STRIPE_SECRET_KEY || "")) throw new Error("MODE_MISMATCH");
}
export function makeOrder(identity: BookingIdentity, serviceId: string) {
  const service = findConsultancyService(serviceId);
  if (!service) throw new Error("UNKNOWN_SERVICE");
  const proof = randomBytes(32).toString("base64url");
  const order: ConsultancyOrder = {
    id: randomUUID(), proofHash: createHash("sha256").update(proof).digest("hex"), identity,
    serviceId, amount: service.priceCents, currency: service.currency, minutes: service.minutes,
    createdAt: new Date().toISOString()
  };
  return { order, proof };
}
export function proofMatches(order: ConsultancyOrder, cookie: string) {
  const [id, proof] = cookie.split(".");
  if (id !== order.id || !proof) return false;
  const expected = Buffer.from(order.proofHash, "hex");
  const actual = createHash("sha256").update(proof).digest();
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
export async function getOrder(id: string) {
  if (!/^[0-9a-f-]{36}$/.test(id)) return null;
  return redis().get<ConsultancyOrder>(`consultancy:order:${id}`);
}
export async function saveOrder(order: ConsultancyOrder) {
  await redis().set(`consultancy:order:${order.id}`, order, { ex: ORDER_TTL });
}
export function validatePaidCheckout(order: ConsultancyOrder, session: Stripe.Checkout.Session) {
  const live = process.env.CONSULTANCY_STRIPE_MODE === "live";
  if (session.id !== order.checkoutId || session.metadata?.orderId !== order.id ||
      session.metadata?.serviceId !== order.serviceId || session.client_reference_id !== order.id ||
      session.amount_total !== order.amount || session.currency !== order.currency || session.livemode !== live ||
      session.mode !== "payment" || session.status !== "complete" || session.payment_status !== "paid") {
    throw new Error("PAYMENT_NOT_VERIFIED");
  }
  const intent = session.payment_intent;
  if (!intent || typeof intent === "string" || intent.status !== "succeeded" || intent.amount_received !== order.amount) {
    throw new Error("PAYMENT_NOT_VERIFIED");
  }
  const charge = intent.latest_charge;
  if (!charge || typeof charge === "string" || charge.refunded || charge.amount_refunded > 0 || charge.disputed || !charge.paid) {
    throw new Error("PAYMENT_REVERSED");
  }
}
export async function verifyOrderPayment(order: ConsultancyOrder) {
  if (!order.checkoutId) throw new Error("PAYMENT_NOT_VERIFIED");
  await assertOmnexaAccount();
  const session = await stripe().checkout.sessions.retrieve(order.checkoutId, { expand: ["payment_intent.latest_charge"] });
  validatePaidCheckout(order, session);
  // This ledger is for reconciliation; every booking still rechecks Stripe.
  await redis().set(`consultancy:receipt:${order.id}`, { checkoutId: session.id, verifiedAt: new Date().toISOString(), amount: order.amount, currency: order.currency }, { ex: ORDER_TTL });
  return session;
}
export const reservationScript = `
local current = redis.call('GET', KEYS[2])
if current then
  local b = cjson.decode(current)
  if b.start ~= ARGV[5] then return 'ORDER_ALREADY_RESERVED' end
  return current
end
redis.call('ZREMRANGEBYSCORE', KEYS[1], '-inf', ARGV[1])
local active = redis.call('ZRANGEBYSCORE', KEYS[1], ARGV[2], '+inf')
for _, member in ipairs(active) do
  local b = cjson.decode(member)
  if b.startMs < tonumber(ARGV[3]) and b.endMs > tonumber(ARGV[2]) then return 'SLOT_TAKEN' end
end
redis.call('SET', KEYS[2], ARGV[4], 'EX', ARGV[7])
redis.call('ZADD', KEYS[1], ARGV[3], ARGV[6])
return ARGV[4]
`;
// One atomic interval reservation covers every start time and duration, across server instances.
export async function reserveBooking(orderId: string, slot: BookingSlot, email: string) {
  const buffer = Math.max(0, Math.min(60, Number(process.env.BOOKING_BUFFER_MINUTES) || 0)) * 60000;
  const startMs = Date.parse(slot.start) - buffer;
  const endMs = Date.parse(slot.end) + buffer;
  const pending: ReservedBooking = { ...slot, orderId, email, status: "pending" };
  const result = await redis().eval<unknown[], string>(reservationScript, ["consultancy:calendar:reservations", `consultancy:booking:${orderId}`],
    [Date.now(), startMs, endMs, JSON.stringify(pending), slot.start, JSON.stringify({ startMs, endMs, orderId }), ORDER_TTL]);
  if (result === "SLOT_TAKEN" || result === "ORDER_ALREADY_RESERVED") throw new Error(result);
  return typeof result === "string" ? JSON.parse(result) as ReservedBooking : result as unknown as ReservedBooking;
}
export async function bookingRecord(orderId: string) { return redis().get<ReservedBooking>(`consultancy:booking:${orderId}`); }
export async function confirmBookingRecord(record: ReservedBooking) {
  await redis().set(`consultancy:booking:${record.orderId}`, record, { ex: ORDER_TTL });
}
export function paymentsPublicTerms() {
  const value = process.env.CONSULTANCY_PAYMENT_TERMS_URL || "";
  // No arbitrary external redirects/configured javascript URLs in checkout UI.
  return value.startsWith("https://www.omnexagoc.com/") ? value : "";
}
export const serviceIds = consultancySessions.map(service => service.id);

export function reservationStoreConfigured() {
  return !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;
}
export async function withBookingLock<T>(id: string, operation: () => Promise<T>): Promise<T> {
  const key = `consultancy:processing:${id}`;
  const token = randomUUID();
  if (!(await redis().set(key, token, { nx: true, ex: 180 }))) throw new Error("BOOKING_IN_PROGRESS");
  try { return await operation(); }
  finally {
    await redis().eval("if redis.call('GET', KEYS[1]) == ARGV[1] then return redis.call('DEL', KEYS[1]) end return 0", [key], [token]);
  }
}
// Release only when we have proved no Google insertion was attempted.
export async function releaseUnsubmittedReservation(orderId: string, slot: BookingSlot) {
  const buffer = Math.max(0, Math.min(60, Number(process.env.BOOKING_BUFFER_MINUTES) || 0)) * 60000;
  const member = JSON.stringify({ startMs: Date.parse(slot.start) - buffer, endMs: Date.parse(slot.end) + buffer, orderId });
  await redis().eval("redis.call('DEL', KEYS[2]); return redis.call('ZREM', KEYS[1], ARGV[1])", ["consultancy:calendar:reservations", `consultancy:booking:${orderId}`], [member]);
}

// Reconcile after a calendar update, including a retry after a lost response.
// Rebuild this order's interval atomically so the old time becomes available.
export async function syncPaidCalendarRecord(orderId: string, event: { id: string; start?: { dateTime?: string }; end?: { dateTime?: string }; hangoutLink?: string }) {
  const start = event.start?.dateTime; const end = event.end?.dateTime;
  if (!start || !end || !Number.isFinite(Date.parse(start)) || !Number.isFinite(Date.parse(end))) throw new Error("CALENDAR_RECONCILIATION_REQUIRED");
  const record = await bookingRecord(orderId);
  if (!record) throw new Error("CALENDAR_RECONCILIATION_REQUIRED");
  if (record.status === "confirmed" && Date.parse(record.start) === Date.parse(start) && Date.parse(record.end) === Date.parse(end)) return;
  const buffer = Math.max(0, Math.min(60, Number(process.env.BOOKING_BUFFER_MINUTES) || 0)) * 60000;
  const member = JSON.stringify({ startMs: Date.parse(start) - buffer, endMs: Date.parse(end) + buffer, orderId });
  const updated = { ...record, start, end, eventId: event.id, meetLink: event.hangoutLink, status: "confirmed" };
  await redis().eval(`
    local entries = redis.call('ZRANGE', KEYS[1], 0, -1)
    for _, entry in ipairs(entries) do
      local b = cjson.decode(entry)
      if b.orderId == ARGV[1] then redis.call('ZREM', KEYS[1], entry) end
    end
    redis.call('ZADD', KEYS[1], ARGV[2], ARGV[3])
    redis.call('SET', KEYS[2], ARGV[4], 'EX', ARGV[5])
    return 1
  `, ["consultancy:calendar:reservations", `consultancy:booking:${orderId}`], [orderId, Date.parse(end) + buffer, member, JSON.stringify(updated), ORDER_TTL]);
}
