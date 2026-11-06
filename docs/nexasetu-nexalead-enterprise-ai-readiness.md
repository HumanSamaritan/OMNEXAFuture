# NeXaSetu × NeXaLead — Enterprise AI Access & Human Readiness (proposal)

**Status:** Design proposal / not an operational control engine, audit certification, or active deployment.  
**Owner:** OMNeXa (proposed).  
**Case study:** Public reporting about Goldman Sachs restricting some advanced AI coding tools to technical employees (November 2026). This is an illustrative case, **not** an assessment of Goldman Sachs' undisclosed internal controls.

## Product responsibilities

- **NeXaSetu (assurance):** defines and evaluates use-case scope, data classification, execution permissions, model/tool inventory, testing and validation, logging, security boundaries, escalation and rollback. Produces a *recommendation* and evidence gaps.
- **NeXaLead (readiness):** evaluates role-specific AI literacy, output verification, safe data handling, ability to challenge AI, scenario practice, incident escalation and supervisory judgement. Produces a *readiness finding*, not a certification entitling access.
- **OViA (evidence and publication integrity):** separates verified facts from hypotheses, records sources, checks counterarguments and reviews external claims.
- **Guardian (future policy enforcement):** would enforce centrally approved limits, not infer permission from a model response. Not implemented here.
- **Authorised humans:** designated business owner, security/privacy, technology/model risk and compliance as appropriate decide exceptions, approve actions and assume responsibility.

## Assessment intake (proposed)

1. Organisation, use-case ID, purpose, accountable owner, and business justification.
2. Tool/model/version, execution modality (chat, code generation, agent, write actions), environment (sandbox, testing, production).
3. Data classification, jurisdictions, personal/sensitive information, retention and vendor exposure.
4. Permission scope, identities/service accounts, segregation of duties, least privilege, and technical blast radius.
5. Safety and security safeguards, testing, independent validation, monitoring, incident escalation, audit evidence, rollback.
6. Employee role, training, supervised practice, challenge/verification results, supervisor sign-off.
7. Relevant internal policies, jurisdictional requirements and model/vendor restrictions.
8. Evidence links, reviewer identity, review timestamp, conditions, residual risks and expiry/reassessment date.

## Decision model (not a score-only approval)

**Hard stop:** prohibited use or legal/policy breach; unapproved sensitive-data exfiltration; production write without independent approval and safe rollback; absent accountable owner; unacceptable unresolved critical risk.

**ASK / conditional review:** missing evidence, incomplete training, unverified model outputs, ambiguous policy, medium or high residual risk, unknown data flow or exceptional access request.

**GO / eligible for approval:** within approved use-case and data boundaries, validated controls and supervised readiness documented, monitoring active, authorised owner approval recorded. GO is never an automatic grant of access.

Each recommendation records rationale, evidence IDs, policy basis, scope, reviewers, conditions, audit timestamp, expiry and appeal/escalation route. Any policy-denied use stays denied even if NeXaLead readiness is strong.

## Pilot use cases (synthetic data only)

| Scenario | NeXaSetu emphasis | NeXaLead emphasis | Indicative route |
|---|---|---|---|
| Business analyst creates explanatory code in isolated sandbox using synthetic data | No production credentials, vetted tools, output testing | Verify assumptions and generated code | GO possible after owner approval |
| Trader generates models using confidential business data | Data and vendor controls, model validation, recordkeeping | Demonstrate model challenge and escalation | ASK pending formal reviews |
| Agent changes production trading/payment logic | Privileged action controls, maker-checker, blast radius, rollback | Supervisor capability | STOP until explicitly authorised and technically controlled |

These are illustrative outcomes, **not** advice that any specific bank should grant particular access.

## Minimum viable pilot sequence

1. Publish assessment criteria and evidence taxonomy, signed off by a named human control owner.
2. Build an **internal-only, synthetic-data** intake questionnaire and case-record schema.
3. Implement deterministic policy gates for STOP and mandatory human review.
4. Add NeXaLead scenarios and evaluation rubric; record uncertainty and assessor notes.
5. Add immutable or tamper-evident decision events, access controls, retention and deletion rules.
6. Test with positive, negative and adversarial cases; independently review false GO rates.
7. Run a supervised pilot with explicit written scope and no live production permission changes.
8. Only after security, privacy, legal, product and operational sign-off consider integration to real entitlement systems.

## Acceptance criteria for a future application

- Every assessment has a case ID, versioned policy, owner and timestamp.
- Missing compulsory evidence prevents an unconditional GO.
- A NeXaLead result **cannot** override a policy STOP.
- No credentials, personal data or confidential bank records are required for demo.
- Decisions are explainable and exportable, including source evidence and overrides.
- Role-based access protects assessments; reviewers cannot self-approve high-risk actions.
- Real access changes require an external authorised approval and verified enforcement.
- UI labels accurately distinguish **proposal**, **pilot** and **production validated**.

## Publication and operating safeguards

Do not claim OMNeXa has audited Goldman Sachs or that NeXaSetu/NeXaLead are production-ready. Distinguish Goldman public-reporting facts from OMNeXa's recommendations. Do not claim regulatory compliance merely because this framework exists. No BAU applications, access policies, student workflows or bank integrations are modified by this specification.

## Proposed outcome measures

Percentage of assessments with complete evidence, reviewer override reasons, training scenario completion and demonstrated skills, time to approved decisions, access exceptions, escaped policy violations, user appeals, and reassessment frequency. These are proposed measures, not observed results.
