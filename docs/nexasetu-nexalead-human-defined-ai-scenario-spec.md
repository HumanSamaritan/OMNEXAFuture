# NeXaSetu + NeXaLead | Human-defined AI control scenarios (review draft)
Status: **PREVIEW SPECIFICATION ONLY — NOT DEPLOYED; NOT VERIFIED AS PRODUCTION FUNCTIONALITY**.
Date: 2026-11-23. No real banking, industrial control, or wellness user data may be used.

## Product responsibilities
- **NeXaSetu (assurance):** register scoped AI use-case, risk tier, delegation policy, approval authorities, enforcement evidence, alert thresholds, response, recovery, test outcomes. Never claim a control "effective" without observed technical evidence. Capture statuses: proposed → designed → implemented → tested → effective/deficient.
- **NeXaLead (learning):** interactive learner-friendly scenario with decisions, explanation, consequences, evidence and debrief. Grades: recognition, proportional response, intervention timing, evidence, human impact, recovery. No real connected tools.

## Shared intervention state machine (not a production agent kill switch)
- foundation: mandate, human owner, tool allowlist, expiry, prohibited actions, threshold.
- L1 REVIEW: route uncertain decision to named human; no automated execution of held actions.
- L2 RESTRICTED: gateway enforces execution block; advisory outputs only when safe; queue held; alert.
- L3 SUSPENDED: deny at external gateway; revoke scoped credentials; cancel queued tasks; inspect in-flight and downstream execution; notify on-call; preserve tamper-evident evidence; manual fallback.
- RECOVERY: root cause → harm assessment → remediation → independent test → dual-authority approval where policy requires → reduced privileges → heightened monitoring.
- Critical triggers may go directly to L3. A UI toggle is NOT proof of effective containment.

## Banking: payment-operations agent (primary)
- Mandate: **prepare only** (no execute permission), reconciliation batch P-104, five first-seen beneficiaries. A separate execution gateway retains payment release control.
- Detection: a new-beneficiary cluster breaches *illustrative* institutional threshold; not proof of fraud.
- Learner actions: inspect mandate → decide L1/L2/L3 → block gateway and queue → revoke token → verify no in-flight release → notify Ops/SOC/Compliance as appropriate → secure logs → approve manual fallback.
- Recovery: validate beneficiary ownership; investigate compromise; reconcile bank statements; prove all intended transfers held or accounted for; independent restart approval.
- Evidence: run ID, transaction IDs, policy version, actor, decision, timestamp, queue/permission state, gateway acknowledgement, alerts, RCA, test and restart signatures.
- IMPORTANT: simulation only, zero payment integrations.

## Manufacturing: visual quality + robotic actuator
- Mandate: camera AI flags possible defects, never directly actuates robot without safety PLC/gateway authorisation.
- Trigger: anomaly flags unusual repeated "pass" recommendations for damaged parts, or commands outside permitted motion envelope.
- L1 human quality inspector reviews; L2 production affected lane to supervised/manual inspection; L3 safe-stop via certified industrial safety system and trained personnel.
- DO NOT claim software application stop alone protects worker safety; local machinery risk assessment, lockout/tagout, safety PLC and emergency stop standards are separate controls.
- Recovery: machine-safe state, inspections, maintenance, QA retest, authorisation, phased restart. Synthetic demo only.

## Student demos: three independent OMNeXa apps (conceptual scenarios)
- HMS: AI produces an overconfident wellness conclusion; L1 ask human to review, L2 disable personalised suggestions while keeping neutral tracking, L3 suspend affected AI feature; no medical diagnosis; safeguard sensitive data.
- NeXaKriya: AI attempts to reassign/delete a family member's tasks or send unapproved calendar invites; L1 review, L2 disable write permission while keeping calendar read-only, L3 suspend workflow; verify scope and consent.
- NeXaVirama: AI attempts to send an overly persuasive, potentially harmful message or expose minors' details; L1 moderator review, L2 disable generative coaching while preserving safe pause guidance, L3 suspend AI coaching; support age-appropriate consent and emergency support routes.
- These are fictional demonstrations, not claims of existing app controls, clinical efficacy, or cross-product integrations. Do not connect user records without explicit consent and design review.

## NeXaSetu intake fields (demo spec)
case_id,sector,scenario,owner,scope,model_id,tools,permission_expiry,risk_tier,trigger,threshold,gate,status,intervention_level,manual_fallback,authority,on_call,queue_state,in_flight_state,verification_evidence,evidence_hash,approval_log,incident_id,root_cause,remediation,independent_test,restart_approval,exercise_results,control_effectiveness.

## NeXaLead learner flow (demo spec)
choose audience (kids/students/professionals) → sector → story in plain language → choose permission boundaries → choose alert response → observe mock control timeline → decide manual fallback → identify evidence → choose restart decision → graded debrief and certificate eligibility (subject to verified programme rules).

## Acceptance criteria before any production deployment
1. Preview app route and content tested on desktop and mobile.
2. Auth/roles, tenant isolation, consent and child-appropriate access verified.
3. L1–L3 and direct-to-L3 work in mocked test service; no accidental live integrations.
4. Gateway deny, queued job cancellation and in-flight uncertainty are separately surfaced.
5. Logs have reliable timestamps, retention controls, integrity checks and no exposed secrets/PII.
6. Manual fallback, recovery approvals and negative tests demonstrated.
7. Accessibility, facilitator mode and under-12 readable narration reviewed.
8. Human approves a single consolidated production deployment; rollback plan documented.
