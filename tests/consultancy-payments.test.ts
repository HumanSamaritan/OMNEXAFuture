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
