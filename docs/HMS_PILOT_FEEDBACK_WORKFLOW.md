# HMS production pilot — six-month feedback workflow

Status: policy/scheduling helper committed; operational integration not yet configured or deployed.

## Non-negotiable architecture
- Existing HMS production and existing OMNeXa production website, no HMS pilot clone.
- OMNeXa-owned protected pilot intake store (previously proposed Firestore), never a public spreadsheet or wellbeing database mirror.
- HMS retains its existing private wellbeing, consent and activity data. Only scoped pseudonymous pilot ID, first meaningful authenticated activity time, last active time, and access status cross to OMNeXa.
- Do not use email addresses as permanent integration keys. Bind one opaque pilot ID to the authenticated HMS user ID only after verifying the email invitation and existing approval.
- Staff dashboard: /feedback, access restricted server-side to verified @omnexagoc.com work identities on an explicit role allowlist (domain-only login is insufficient).
- External participants must not need an @omnexagoc.com account. They should respond via short-lived, single-use, participant-specific signed email links to a separate form endpoint; rate-limit and protect against replay.
- Pilot application intake requires signed NDA, notice/consent version, source, timestamp, verified email, product and approval status. Staff approval is auditable.
- Never copy daily mood, food, gratitude, reflections, health personalisation or vaulted data into OMNeXa pilot store.

## Application lifecycle
applied → verified → pending_review → approved → invited → active → completed
Alternative terminal states: declined, withdrawn.
Invite only after approval. Start six-month clock only on first meaningful authenticated HMS activity, not invitation or login redirect.
HMS must enforce approval via server-side binding for new pilot participants, while preserving authorised existing users and administrators.

## Feedback cadence
- Generate six monthly due dates from first meaningful activity; use calendar months in UTC, clamping invalid dates such as February 31.
- Once per day, a server cron checks pending cycles, verifies active status, and sends one branded survey link for the due cycle. Idempotency key: pilot-id + month + feedback-version.
- Question prompts: overall satisfaction (1–5); ease of use (1–5); most useful feature; confusing/frustrating point; privacy/control confidence (1–5); one improvement suggestion; optional follow-up permission.
- Participants should be warned not to submit sensitive health details in free text. No mandatory marketing consent.
- Follow-up reminders at +7 days and +14 days if no answer and communications remain permitted; stop at withdrawal.
- If no usage has occurred, do not start feedback schedule; optionally send a single onboarding assistance note after seven days.
- At month six: reconcile HMS activity metadata with OMNeXa cycles, mark review_due, and let staff close participation. Do not equate lack of activity with failure or revoke consent automatically.
- Any subscription reward entitlement must follow the accepted agreement version. Current text advertises 6 free months, which must be reconciled against earlier 1-year proposal before further signups.

## Security and reliability
- Firebase/Firestore service credentials server-side only; scoped IAM; Firestore rules deny browser writes to administration, review decisions and reconciliation metadata.
- Centralized rate limiting, CSRF/origin checks, private cache, secure OTP/invite expiry, structured status history and immutable audit events.
- Cron endpoint requires trusted platform identity/secret, locks or atomic transactions prevent duplicates, retries are idempotent and failures surfaced to administrators.
- Designate retention periods and data deletion rules. Encryption in transit and at rest; restrict admin access; export/delete requests across both systems.
- Assess GDPR special-category data obligations for HMS and applicable Singapore PDPA transfer/notification rules. A pilot NDA is not a substitute for lawful grounds and transparent processing.

## Pending engineering dependencies
1. Identify/connect OMNeXa Pilot Intake Preview Firestore production service account and deployment configuration; verify exact data store ownership.
2. Wire /api/pilot/apply durable atomic write before treating application as accepted; preserve safe email retries and provider status.
3. Add HMS authenticated first-use event, bound to opaque pilot ID and signed server-to-server exchange.
4. Implement protected /feedback staff dashboard, participant survey endpoint and scheduled monthly email worker.
5. Run production-safe functional/privacy tests using dedicated test accounts and no real sensitive wellbeing data.
