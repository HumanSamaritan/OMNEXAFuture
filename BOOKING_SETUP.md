# OMNeXa in-page booking setup

The `/connect` page now supports a first-party booking flow:

1. Visitor enters meeting details.
2. Google Cloud reCAPTCHA Enterprise checkbox verifies that the visitor is human.
3. OMNeXa issues a short-lived signed booking session.
4. Live availability is read from Google Calendar.
5. The visitor selects a 30-minute Singapore-time slot.
6. Availability is re-checked on the server.
7. Google Calendar creates the event, requests a Google Meet link and sends the invitation.
8. The visitor sees an OMNeXa confirmation screen without leaving the site.

No application database is required. Google Calendar remains the source of truth.

## 1. reCAPTCHA

Create a Google Cloud reCAPTCHA Enterprise checkbox checkbox key for:

- `omnexagoc.com`
- `www.omnexagoc.com`

For Vercel Preview testing, add the preview hostname to the key temporarily or use a separate test key.

Add these Vercel environment variables:

```
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=...
RECAPTCHA_PROJECT_ID=omnexa-website
RECAPTCHA_ENTERPRISE_API_KEY=...
RECAPTCHA_EXPECTED_HOSTNAME=www.omnexagoc.com
```

Leave `RECAPTCHA_EXPECTED_HOSTNAME` unset for preview if the preview hostname is also allowed by the key.

## 2. Booking session signing

Generate a long random secret and add:

```
BOOKING_SESSION_SECRET=...
```

Use at least 32 random characters. Do not expose this value to the browser.

## 3. Google Calendar authentication

### Recommended: Workspace user OAuth

Use a Google Cloud OAuth client with Calendar API enabled. Authorize the OMNeXa Workspace account that should own the bookings and obtain an offline refresh token with Google Calendar scope.

Add:

```
OMNEXA_BOOKING_CALENDAR_ID=primary
GOOGLE_CALENDAR_CLIENT_ID=...
GOOGLE_CALENDAR_CLIENT_SECRET=...
GOOGLE_CALENDAR_REFRESH_TOKEN=...
```

This method is preferred because the Workspace user remains the meeting organizer and can create Google Meet invitations normally.

### Alternative: service account

Share the booking calendar with a service account and configure:

```
OMNEXA_BOOKING_CALENDAR_ID=<calendar-id>
GOOGLE_SERVICE_ACCOUNT_EMAIL=...
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

If the service account must invite attendees as a Workspace user, domain-wide delegation may also be required:

```
GOOGLE_WORKSPACE_SUBJECT=dhiraj.kumar@omnexagoc.com
```

## 4. Booking policy

Defaults:

```
BOOKING_DURATION_MINUTES=30
BOOKING_SLOT_STEP_MINUTES=30
BOOKING_DAY_START=09:00
BOOKING_DAY_END=18:00
BOOKING_MIN_NOTICE_HOURS=4
BOOKING_HORIZON_DAYS=30
BOOKING_BUFFER_MINUTES=0
BOOKING_REQUIRE_WORK_EMAIL=false
```

All booking rules are evaluated in `Asia/Singapore`.

Keep the slot step at 30 minutes unless a stronger distributed locking mechanism is introduced. This avoids overlapping selectable slots and lets Google Calendar event IDs provide an additional collision guard.

Set `BOOKING_REQUIRE_WORK_EMAIL=true` only if OMNeXa wants the partnership booking flow to reject common personal-mail domains.

## 5. Guardrails implemented

- Google Cloud reCAPTCHA Enterprise checkbox checkbox
- same-origin POST checks
- honeypot field
- per-IP rate limiting
- short-lived signed session after reCAPTCHA
- input length and email validation
- optional business-email restriction
- server-only Google credentials
- live Calendar free/busy lookup
- minimum notice, working-hours and booking-horizon enforcement
- server-side availability re-check immediately before creation
- deterministic event ID to prevent simultaneous bookings of the same 30-minute start
- no private calendar-event titles or contents returned to the browser
- no database copy of the booking form
- CSP restricted to the Google origins needed for reCAPTCHA

## 6. Deployment sequence

1. Add the required environment variables to Vercel Preview.
2. Redeploy the `agent/connect-booking-flow` branch.
3. Test reCAPTCHA, slot availability, booking creation, Meet link and invitation delivery.
4. Add the same variables to Production.
5. Merge the branch only after the end-to-end booking test succeeds.
