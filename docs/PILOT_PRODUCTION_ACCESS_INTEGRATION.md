# OMNeXa pilot identity, enrolment, and production application access — integration contract

**Status:** WEBSITE PREVIEW INTEGRATION ONLY. Product application production logins and cross-project IAM are NOT completed or E2E verified. Do not merge to main or announce automatic access until all gates pass.

## Source of truth
- Firebase project `omnexa-pilot`, database `(default)`, collection `omnexa_pilot_applications`.
- Unique applicant identity: verified normalized email. An email form field alone is never proof of identity.
- A verified applicant can have several historical application references.
- Product entitlement is evaluated *per product*: `productAccess[slug]` first, then **legacy primary product only** `productSlug/status`. Legacy `productSlugs` secondary selections are interests, not automatically authorised users.
- Statuses granting access: `approved`, `invited`, `active`. No access on `pending_review`, `declined`, `withdrawn`, `completed`.
- Preserve first-use and expiry time in each product's own database and existing profile; don't reset on re-login.

## Recommended login contract in each CURRENT PRODUCTION product
1. Authenticate user with its current production identity provider (verified 6-digit email PIN **or** verified Google/Supabase Auth identity).
2. Confirm provider has verified control of the email. Use server-issued verified claims, not localStorage, query strings, or email form values.
3. On the server, call Firestore with a **read-only product-specific service identity**, querying applicant records for the normalized verified email. No PII is returned to client.
4. Check exact product slug and per-product effective entitlement; reject pending/declined/withdrawn without erasing existing profiles.
5. For eligible users, find existing product profile by provider-owned user ID, then **safe idempotent** upsert/initialise only missing fields. Never overwrite journey, tasks, wellbeing, preferences, or earlier pilot timestamps.
6. Return only access state and necessary product-specific start/expiry; no personal registration record or sibling-product list.
7. Record a scoped audit event without names, email addresses, tokens, signatures or health content.
8. On login, if an existing profile predates pilot, preserve it. Unlinked legacy profiles require a securely verified identity-linking path, not a blind email merge.

## Product-specific boundaries
- NeXaVirama production: Firebase project `nexavirama`; documented production read SA `nexavirama-vercel-prod@nexavirama.iam.gserviceaccount.com`; existing 6-digit PIN and Google flows must both resolve to one verified account. **Do not connect the old NeXaVirama preview**. See docs/NEXAVIRAMA_OMNEXA_PILOT.md.
- NeXaKriya production: independently inspect current production PIN/Google login and calendar/workspace DB before editing. **Do not connect the old NeXaKriya preview**. A pilot grant must never expose another user's calendar, task group or family workspace.
- HMS production: uses Supabase Authentication/Postgres with RLS according to the current production repository. Verify signed-in Supabase user through trusted server-side Auth before consuming entitlement. Keep existing data protected by owner-only RLS; do not create profiles from unverified pilot email alone.

## Pilot website preview → production Firestore read-only
- The existing preview branch does not have production Firestore read credentials. Website preview must NEVER reuse the writer SA or silently change production pilot status.
- `POST /api/pilot/entitlements` requires a short-lived verified-email token, reads existing records and emits only selected product access statuses.
- Enable preview lookup **only after** a distinct IAM identity is created with read-only access, Vercel OIDC provider limited to the exact approved preview project/branch, and `PILOT_PREVIEW_READONLY_ENABLED=true`. Use branch-scoped project and database env settings (no plaintext credentials). Do not enable preview database writes.
- If lookup is unavailable, UI must say unavailable, not unregistered.

## Registration and onboarding
- In production, after verified email + accepted agreement: server detects any existing matching product records before creating a new application. If any selected product exists, provide clear no-duplicate guidance.
- New B2C single-product eligible applications can follow existing approval rules. Multi-product, under-development products and B2B must remain under review until safe product-specific access adapters are operational.
- `productAccess` is an explicit per-product map; avoid blindly setting the global status to approved for mixed B2B+B2C requests. All updates must be idempotent and auditable.
- Do **not** copy the entire pilot application, signature, NDA, experience or unrelated personal details into product databases. Store only verified identity link, entitlement and minimal onboarding fields required for that product, with user consent.
- A login can create the product's missing profile and initialise benefits; must not reset or change legacy data.

## Release and rollback gates
- Read-only lookup against a **consented test account** in production pilot DB from website preview.
- Existing account with approved pilot, pending pilot, declined pilot, and no pilot; each login via PIN and Google where offered.
- Existing historical profile remains intact after login; duplicate enrolment prevented.
- Three approved B2C products from one consolidated selection get separate entitlements, each accessible via production domain (not an old preview).
- Mixed B2C+B2B stays in review where necessary; B2B lacks automatic subscription benefits.
- Verify expiry, rate limiting, account enumeration defences, cross-account access, OIDC IAM conditions, error reporting and rollback.
- Independently test production app adapters in staged production builds before promoting; no production DB/profile mutation without approved test cases.

**Known access blocker:** Connected Vercel account exposes OMNeXa website and HMS but not the NeXaVirama and NeXaKriya production projects; their current production source/deployment must be obtained before authenticating the full flow. A website preview build is not evidence that three app login flows work.
