# OMNeXa pilot registration

This release is intended for the existing preview branch only. `/pilot` is excluded from indexing.

## Flow

1. Select one initiative and one product. Explicit eligibility prevents unclassified new products from accepting applications.
2. Provide contact and relevant experience details. Confirm adult status and application-data processing. Google reCAPTCHA protects submission.
3. Read/download the product-specific NDA, type the same full name, accept required declarations and submit the interest form.
4. Queue one application and agreement record to `support@omnexagoc.com`. No applicant email is sent, keeping pilot-interest capture to one Resend message. The applicant can download the agreement copy from the confirmation screen.

## Existing configuration reused

- `RESEND_API_KEY`
- `CONTACT_FROM_EMAIL`: must be a sender on a Resend-verified domain; no resend.dev sender fallback.
- `BOOKING_SESSION_SECRET`: at least 32 characters; a separate pilot encryption key is derived from it. Optional `PILOT_SIGNING_SECRET` overrides it without affecting booking.
- Existing `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `RECAPTCHA_PROJECT_ID`, `RECAPTCHA_ENTERPRISE_API_KEY`. The Google key must allow the preview hostname for end-to-end preview testing.
- Optional `PILOT_FROM_EMAIL` overrides the existing verified sender.
- `VERCEL_ENV` is supplied by Vercel. Any environment other than `production` records non-binding preview tests and prefixes email subjects accordingly. No client-controlled switch can make a submission binding.

No paid integration, database or public product-access URL has been added. Email-provider acceptance means queued, not proven inbox delivery; UI and emails state this accurately. Google Groups must accept inbound mail at support@omnexagoc.com, and the sender's SPF/DKIM should already be configured in Resend.

## Subscription classification

- B2C: Sahaay Setu, SwayamITR, NeXaCareer, PSLE Practice Space, Human Machine Sadhana, NeXaKriya, NeXaVirama.
- B2B: NeXaAML, NeXaForge, NeXaSetu, NeXaLead, Lotus Karmic Balance.

Every B2C participant who takes part and supplies the agreed feedback earns 12 months of the selected product's individual subscription once it becomes available after the pilot. Plan and activation date must be confirmed before testing begins. No card or automatic paid renewal. B2B commercial terms are separate. The portal records the entitlement terms; it does not provision subscriptions in the separate product applications.

## Agreement and records

The drafted NDA is versioned in `lib/pilot-agreement.ts`. It covers permitted use, confidentiality and exceptions, IP, feedback, participant responsibilities, termination, the B2C benefit and Singapore governing law. Have Singapore counsel review this draft and confirm business terms before using it to bind external participants or promoting the flow to production.

The support email contains the full structured application and agreement snapshot, agreement/record SHA-256 hashes, a server HMAC integrity seal and the applicant-device signature action timestamp (labelled as such). Provider email timestamps supply queue-time evidence. This is an ordinary typed electronic acceptance, not certified digital identity or a qualified signature service. The support mailbox is the administrative record store for this phase; restrict access and manage retention there. No applicant receipt email is sent. Legacy verification routes remain unused by the current low-cost form; no application payload, code or signature is logged.

The in-memory limiter is best-effort per server instance, alongside Google reCAPTCHA. Before opening a high-volume public programme, use shared rate limiting and a durable application/receipt database if needed. No admin panel or automatic subscription fulfilment is included in this registration release.

## Verification

Run `npx tsc --noEmit` and `npm run build`. Focused tests exercise B2C/B2B validation, consent/signature enforcement, reCAPTCHA, origin checks, single support-email contents and provider failure handling. Preview tests must remain non-binding; do not accept a real agreement on an applicant's behalf during QA.
