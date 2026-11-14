# NeXaVirama and NeXaKriya pilot access

## User journey

1. A participant opens [omnexagoc.com/pilot](https://www.omnexagoc.com/pilot) and applies separately for NeXaVirama or NeXaKriya.
2. The application is email-verified, signed, and stored in Firestore project `omnexa-pilot`, database `(default)`, collection `omnexa_pilot_applications` with status `pending_review`.
3. An authorised OMNeXa reviewer evaluates the application and changes its status to `invited` or `approved`. A pending application does not grant access.
4. For NeXaVirama, the participant can then use Google sign-in or the six-digit email PIN. The server checks the verified email against the NeXaVirama application record before opening the private journey.
5. The six-month B2C pilot period begins on the participant's first successful eligible login. Start and expiry timestamps are stored in the participant's NeXaVirama Firebase profile. Existing cloud profiles/journeys are preserved as legacy access.

## Firestore record and permissions

- Pilot applications are written by the OMNeXa website's keyless Vercel identity using the `omnexa-pilot-intake` service account.
- NeXaVirama production reads applications using `nexavirama-vercel-prod@nexavirama.iam.gserviceaccount.com`, which needs **Cloud Datastore Viewer** on the `omnexa-pilot` project.
- NeXaVirama does not write to the pilot application database. Its own Firebase project stores the first-use timestamp and expiry.
- Keep applicant records private. Never return application records or email addresses to the browser; the NeXaVirama endpoint returns only access outcome and expiry.

## Reviewer operation

There is not yet a NeXaVirama-specific review dashboard. Until one is built, an authorised reviewer must update the matching application's `status` in Firestore. Supported access statuses are `approved`, `invited`, and `active`; `pending_review` is blocked. Record the reviewer and decision in the existing review process before changing status.

## Deployment checklist

- Confirm production Vercel environment has the existing NeXaVirama OIDC settings and `FIREBASE_PILOT_PROJECT_ID=omnexa-pilot` (the code defaults to that project ID).
- Confirm the production WIF provider restricts identities to the NeXaVirama production environment.
- Confirm Cloud Datastore Viewer is bound to the production NeXaVirama service account on the OMNeXa Pilot project.
- Confirm the OMNeXa website production environment has `FIREBASE_PILOT_PROJECT_ID`, `FIREBASE_PILOT_DATABASE_ID`, and `FIREBASE_PILOT_CLIENT_EMAIL` configured.
- Submit only an explicitly consented test application; check that it appears as `pending_review`, then invite that test account and verify it can enter.
- Confirm pending and declined applications cannot enter and that existing cloud journey data still loads.

## Known limitation

Browser-only encrypted profiles are local to the original device and cannot be discovered or restored through Firestore. This access integration preserves cloud profile and journey documents but does not migrate local-only journey data to a new device.
