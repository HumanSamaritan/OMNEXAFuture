# OMNeXa consultancy delivery

## Released visitor experience

The canonical service catalogue is `/consultancy`. Seven service scopes and USD fees are carried over from the existing Topmate catalogue. Each paid-service page offers a written session request until paid checkout is explicitly enabled. `/consultancy/book?service=discovery` uses the existing native Google Calendar / Meet flow with a server-signed 15-minute duration. Discovery is free for all segments. It does not trigger or charge for a follow-up. The existing `/connect` business introduction keeps its existing configuration.

## Payment engine status: not activated

Do not turn on checkout until the provider, sandbox integration and booking reconciliation have been validated end to end. Unit tests are not a replacement for this validation.

The OMNeXa live Stripe account is pinned to `acct_1ULeSSPoPz27HNVw`. The separate Future Plus account must never receive OMNeXa consultancy payments. The application reads the authenticated Stripe account and rejects a mismatch. In live mode it also requires payments and payouts enabled. Website prices are server authoritative, in USD minor units; confirm these commercial prices, tax treatment and cancellation terms before enabling sales.

Sleek is **not connected**. The email evidence does not supply verified full receiving details, payout linkage, or a documented bank transaction API. A Stripe payout destination and a customer bank-transfer option are different integrations. Do not treat a bank screenshot or customer declaration as payment receipt. Until an official reconciliation interface is confirmed, offer Sleek only by an agreed invoice and manual verification of the actual bank credit; manually arrange the paid calendar invitation after verification. Never publish guessed account details.

## Required provider configuration

Use sensitive Vercel environment variables for all keys. Prefer a restricted Stripe key with only the required permissions: read the account, create/retrieve Checkout Sessions, read PaymentIntents and expanded latest charges. Validate permissions in a separate Stripe sandbox. No key belongs in Git, browser JavaScript, logs, or a chat message.

- `CONSULTANCY_PAID_BOOKING_ENABLED=true` only after every validation below
- `CONSULTANCY_STRIPE_MODE=live` in production; `test` in an isolated preview sandbox
- `STRIPE_SECRET_KEY`: restricted API key (the historical variable name supports `rk_` as well as `sk_`)
- `STRIPE_WEBHOOK_SECRET`: correct endpoint signing secret, separate per environment
- `CONSULTANCY_TEST_STRIPE_ACCOUNT`: sandbox account ID in preview only; production always pins OMNeXa
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`: a durable, authenticated store; use a separate preview database
- `CONSULTANCY_PAYMENT_TERMS_URL`: a published HTTPS page on `www.omnexagoc.com`, reviewed by the business, covering scope, currency, cancellation, rescheduling, refund handling and no suitable availability
- Existing Google Calendar / Meet credentials, booking session secret, reCAPTCHA Enterprise and Resend configuration

No new paid infrastructure has been provisioned and no production payment keys have been added by this change. The engine fails closed while requirements are absent. Do not use a temporary/expiring database for real payments. Orders and their identity details expire after 180 days in Redis; review retention and the published privacy notice before activation. Stripe remains the accounting record.

Register the HTTPS webhook `/api/consultancy/webhook` for `checkout.session.completed`, `checkout.session.async_payment_succeeded`, and `checkout.session.async_payment_failed`. It validates the raw-body signature, independently retrieves the payment, checks the order/amount/currency/mode, records receipt and emails a scheduling link. Repeated delivery is safe; notification uses a provider idempotency key. Enable Stripe customer receipts separately. Unknown non-consultancy checkout events are ignored. Refunded/disputed/part-refunded payments are rejected on every subsequent booking attempt. An already-confirmed calendar event is not silently deleted when a payment is reversed: the business must review the case.

## Booking and recovery behaviour

Checkout uses Stripe-hosted payment entry. A successful return URL is never proof of payment. The website checks the actual paid Checkout Session and succeeded/captured payment. Delayed payment methods remain unscheduled until paid. Once verified, the customer chooses a time. Payment itself does not reserve a slot; the customer sees this before payment. If no mutually suitable slot exists, use the published refund/rescheduling terms.

The same-browser HttpOnly cookie binds the order to its purchaser. The webhook emails a link that works in that browser. Lost access or a different device requires manual receipt verification and assistance; never grant access merely because someone knows the email address or an order ID. A subsequent checkout in the same browser replaces this access cookie; use support for an earlier order. A customer-account or email-OTP recovery flow is a future improvement.

An atomic Redis interval reservation prevents paid/free/legacy meetings from overlapping across instances after the shared store is connected. Order-level locks and deterministic Google event IDs prevent duplicate invitations. Unknown insertion responses retain the pending reservation and retry the same event; do not tell customers to pay again. Calendar events created outside OMNeXa are rechecked immediately before insertion; external calendar edits can still race, so monitor and reconcile exceptions. No automatic cancellation or refund API has been added.

## Required validation before activation

Run `pnpm test:consultancy` and `pnpm build`. In an isolated Stripe sandbox and test calendar verify: successful payment → correct-duration invitation and Meet link; abandoned/unpaid/declined/delayed-failed payment → no event; delayed-success payment → scheduling access; wrong account/amount/currency/mode → denied; webhook retry and duplicate booking → one event; overlapping 15/30/60-minute requests → one accepted reservation; lost Google response → same-event recovery; existing external event → no overlapping invitation; refund/dispute → no new booking; lost cookie → assistance without leaking customer data; receipt email retry; no suitable availability → agreed refund/rescheduling process. Verify live OMNeXa payouts separately in the provider dashboard before launch.

## Promotion and LinkedIn

Use `https://www.omnexagoc.com/consultancy` as the external profile / Featured / website destination. A LinkedIn-native “View my services” button may open LinkedIn's own Service Page rather than a configurable external URL; inspect the signed-in UI before claiming it can be redirected. Update the external link or add the OMNeXa destination to the Services description/Featured item as appropriate. Social copy must say paid sessions are by request until checkout is activated.
