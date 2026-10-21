# Mandatory privacy and cross-border launch gate — all OMNeXa products

Apply before each pilot and production launch. Owner: OMNeXa product owner; privacy review and documented approval required.

1. Map data categories and purposes; distinguish pilot applicant records from product data, especially HMS health/wellbeing entries and children's data. Minimise fields.
2. Verify actual cloud project, database, storage region, backups, logs, subprocessors, email routing and AI processing locations; do not infer Singapore residency from the product URL.
3. List target participant countries and check applicability of GDPR/UK GDPR, Singapore PDPA and local rules; identify legal bases and conditions for sensitive health data, minors, marketing, transfers and data subject rights.
4. For relevant cross-border transfers, document safeguards, contracts (e.g., EU SCCs where required), transfer impact assessment and supplementary controls. An NDA checkbox by itself is not a lawful transfer mechanism.
5. Review notices and pilot NDA for accurate current processing, retention, controllers/processors and rights contacts; keep purpose-specific consents distinct.
6. Verify access control, least privilege, encrypted storage, user separation from HR, audit trail, duplicate prevention, deletion/retention policy, vendor DPA, incident process and tested recovery.
7. Confirm both applicant and support confirmation emails, persistent audit-grade enrolment records and approved-gated access; do not launch if any mandatory control fails.
8. Record country/product-specific decision (allow, allow with conditions, restrict, block), reviewer, date, evidence links and re-review trigger. Repeat before changing regions, subprocessors, functionality or audience.

## HMS-specific gate
Verify actual Supabase project region and backups, AI inference pathways, photo/audio deletion, health data classification, profiling/automated decision transparency, age restrictions, cross-device access, subject-rights workflow and pilot vs application consent separation. Do not treat Singapore database region as global legal clearance.

## Pilot retention
Pilot enrolment may run 1–3 months, but retain the minimum registration/NDA and eligibility evidence for the documented benefit period and any legally justified dispute/retention window, then delete or anonymise. Never store OTPs long-term.

Status: checklist framework only; not evidence of legal signoff or deployed storage.
