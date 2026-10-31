import { test } from "node:test";
import assert from "node:assert/strict";
import Stripe from "stripe";
import { makeOrder, paidBookingConfigured, paymentsPublicTerms, proofMatches, validatePaidCheckout, reservationScript } from "../lib/consultancy-payments";
import { createBookingSession, readBookingSession } from "../lib/booking";
import { POST as startFreeSession } from "../app/api/booking/session/route";
import { POST as checkout } from "../app/api/consultancy/checkout/route";
import { POST as webhook } from "../app/api/consultancy/webhook/route";
const identity = { name: "Test Person", email: "test@example.com", company: "Example", jobTitle: "Analyst", phone: "", focus: "Explore a fictional AML case" };
function fixture() {
  const { order } = makeOrder(identity, "aml-kyc-training"); order.checkoutId = "cs_test_verified";
  const session = { id: order.checkoutId, metadata: { orderId: order.id, serviceId: order.serviceId }, client_reference_id: order.id, amount_total: order.amount, currency: order.currency, livemode: false, mode: "payment", status: "complete", payment_status: "paid", payment_intent: { status: "succeeded", amount_received: order.amount, latest_charge: { paid: true, refunded: false, amount_refunded: 0, disputed: false } } } as unknown as Stripe.Checkout.Session;
  return { order, session };
}
test("service prices come from the server catalogue; order proof is bound to one order", () => {
  const { order, proof } = makeOrder(identity, "wellbeing-hms");
  assert.equal(order.amount, 2000); assert.equal(order.currency, "usd"); assert.equal(order.minutes, 30);
  assert.ok(proofMatches(order, `${order.id}.${proof}`));
  assert.equal(proofMatches(order, `${order.id}.wrong`), false);
  assert.equal(proofMatches(order, `other.${proof}`), false);
  assert.throws(() => makeOrder(identity, "fake-service"));
});
test("only a fully paid matching checkout permits scheduling", () => {
  process.env.CONSULTANCY_STRIPE_MODE = "test";
  const { order, session } = fixture(); validatePaidCheckout(order, session);
  for (const patch of [{ payment_status: "unpaid" }, { payment_status: "no_payment_required" }, { status: "open" }, { amount_total: 1 }, { currency: "sgd" }, { livemode: true }, { id: "another_session" }, { metadata: { orderId: "other", serviceId: order.serviceId } }, { client_reference_id: "another_order" }]) {
    assert.throws(() => validatePaidCheckout(order, { ...session, ...patch } as Stripe.Checkout.Session));
  }
});
test("refunds, partial refunds and disputes revoke booking access", () => {
  const { order, session } = fixture();
  for (const patch of [{ refunded: true }, { amount_refunded: 1 }, { disputed: true }, { paid: false }]) {
    const intent = session.payment_intent as Stripe.PaymentIntent;
    assert.throws(() => validatePaidCheckout(order, { ...session, payment_intent: { ...intent, latest_charge: { ...(intent.latest_charge as Stripe.Charge), ...patch } } } as Stripe.Checkout.Session));
  }
});
test("paid checkout and webhook fail closed without configuration", async () => {
  delete process.env.CONSULTANCY_PAID_BOOKING_ENABLED;
  assert.equal(paidBookingConfigured(), false);
  assert.equal((await checkout(new Request("https://www.omnexagoc.com/api/consultancy/checkout", { method: "POST", body: "{}" }))).status, 503);
  assert.equal((await webhook(new Request("https://www.omnexagoc.com/api/consultancy/webhook", { method: "POST", body: "{}" }))).status, 503);
  process.env.CONSULTANCY_PAYMENT_TERMS_URL = "javascript:alert(1)";
  assert.equal(paymentsPublicTerms(), "");
});
test("the free-session endpoint cannot mint paid-session authority", async () => {
  const response = await startFreeSession(new Request("https://www.omnexagoc.com/api/booking/session", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...identity, consultancyService: "aml-kyc-training" }) }));
  assert.equal(response.status, 403);
});
test("discovery duration flag is signed; changing it invalidates the session", () => {
  process.env.BOOKING_SESSION_SECRET = "test-only-secret-for-local-unit-tests-32-characters";
  const token = createBookingSession(identity, "discovery");
  assert.equal(readBookingSession(token)?.consultancyService, "discovery");
  const [encoded, signature] = token.split("."); const payload = JSON.parse(Buffer.from(encoded, "base64url").toString()); payload.consultancyService = "aml-kyc-training";
  assert.equal(readBookingSession(`${Buffer.from(JSON.stringify(payload)).toString("base64url")}.${signature}`), null);
});

import { preparationFocus, preparationQuestions } from "../lib/consultancy-preparation";
import { manageToken, readManageToken } from "../lib/discovery";
import { createGoogleCalendarBooking } from "../lib/booking";
test("all service intake questions survive checkout preparation and reject missing or oversized answers", () => {
  for (const [id, questions] of Object.entries(preparationQuestions)) {
    const answers = Object.fromEntries(questions.map(q => [q.id, "x".repeat(180)]));
    const focus = preparationFocus(id, "x".repeat(400), answers);
    assert.ok(focus.length < 2200);
    for (const q of questions) assert.ok(focus.includes(q.label));
    assert.throws(() => preparationFocus(id, "Specific session goal", {}));
    assert.throws(() => preparationFocus(id, "Specific session goal", { ...answers, [questions[0].id]: "x".repeat(181) }));
  }
});
test("paid management links are distinct from discovery and cannot have their scope changed", () => {
  const signed = manageToken("abcdef12345", Date.now() + 60000, "paid-manage");
  assert.equal(readManageToken(signed)?.scope, "paid-manage");
  const [encoded, signature] = signed.split(".");
  const payload = JSON.parse(Buffer.from(encoded, "base64url").toString()); payload.scope = "discovery-manage";
  assert.equal(readManageToken(`${Buffer.from(JSON.stringify(payload)).toString("base64url")}.${signature}`), null);
});
test("paid calendar invitations carry order metadata and the same private rescheduling flow", async () => {
  const original = globalThis.fetch; let sent: any;
  process.env.GOOGLE_CALENDAR_CLIENT_ID = "test"; process.env.GOOGLE_CALENDAR_CLIENT_SECRET = "test";
  process.env.GOOGLE_CALENDAR_REFRESH_TOKEN = "test"; process.env.OMNEXA_BOOKING_CALENDAR_ID = "primary";
  globalThis.fetch = async (url, init) => {
    if (String(url).includes("oauth2")) return Response.json({ access_token: "test-local-token", expires_in: 3600 });
    sent = JSON.parse(String(init?.body));
    return Response.json({ id: sent.id, hangoutLink: "https://meet.google.com/test" });
  };
  try {
    const session = readBookingSession(createBookingSession(identity, "aml-kyc-training", "test-order"))!;
    await createGoogleCalendarBooking(session, { start: "2027-01-04T01:00:00.000Z", end: "2027-01-04T01:30:00.000Z" }, "AML training");
    assert.equal(sent.extendedProperties.private.paymentOrderId, "test-order");
    const token = sent.description.split("/consultancy/manage#")[1];
    assert.equal(readManageToken(token)?.scope, "paid-manage");
    assert.equal(readManageToken(token)?.eventId, sent.id);
  } finally { globalThis.fetch = original; }
});
