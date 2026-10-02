export const PILOT_AGREEMENT_VERSION = "2026-10-02.1";
export const PILOT_SUPPORT_EMAIL = "support@omnexagoc.com";

export const B2C_BENEFIT = "Every participant who takes part in an OMNeXa B2C product pilot and provides the agreed pilot feedback will receive one year (12 consecutive months) of a free individual subscription to that product. The subscription begins when the product's subscription service becomes available after the pilot; OMNeXa will confirm the activation date and included plan before the pilot starts. No payment card or automatic paid renewal is required. Registration alone does not qualify; the benefit applies to the product actually tested, is non-transferable and has no cash alternative.";
export const B2B_BENEFIT = "This is an organisational / B2B pilot. The one-year free individual subscription offer does not apply. Pilot scope, access, commercial terms and any organisational agreement will be confirmed separately before testing begins.";

export const PILOT_PRIVACY_NOTICE = "OMNeXa uses your contact details, country, product selection, relevant experience and testing interests to assess your application and coordinate the pilot. Your verified email, typed signature, agreement version and acceptance record are retained to evidence your consent and agreement. Details and agreement copies are sent to support@omnexagoc.com and your verified email using Resend, with Vercel hosting and Google reCAPTCHA for abuse prevention. These providers may process data outside your country. We do not request medical records, financial records, identity documents or confidential employer/client information in this form. Records are kept only while needed for pilot administration, the subscription benefit or legal obligations, then deleted or anonymised. Contact support@omnexagoc.com to request access, correction, deletion or withdrawal of consent, subject to applicable legal retention needs. This consent is for the pilot, not marketing.";

export const PILOT_TERMS = [
  {
    title: "1. Parties, product and purpose",
    text: "This Pilot Participation and Non-Disclosure Agreement is between OMNeXa Pte. Ltd., Singapore (UEN 202628055R), and the adult applicant identified in the application. For a B2B application, the applicant also identifies the organisation they are authorised to represent. It covers only the selected product and information disclosed for evaluating or testing that product. Submitting an application does not grant access or guarantee selection; OMNeXa must separately confirm the pilot invitation and scope."
  },
  {
    title: "2. Confidential information",
    text: "Confidential information includes non-public product access, prototypes, demonstrations, screens, documents, designs, methods, workflows, technical details, security information, commercial plans and test results disclosed by OMNeXa, whether marked confidential or reasonably understood to be confidential. It excludes information the participant can demonstrate was already lawfully known, became public without a breach, was independently developed without using confidential information, or was lawfully received from another source without a duty of confidence."
  },
  {
    title: "3. Use and protection",
    text: "Use confidential information only for the agreed pilot. Apply reasonable care, keep access credentials private and notify OMNeXa promptly of a suspected loss or unauthorised disclosure. Do not publish, forward, record or share non-public screens, demonstrations or test results without written permission. Do not upload confidential information to external AI tools or other third-party services without written permission. Do not use it to reproduce the product or develop a competing implementation, and do not reverse engineer it except where applicable law permits. This does not restrict the participant's general skills or independently developed work."
  },
  {
    title: "4. Permitted and required disclosures",
    text: "Disclosure is permitted with OMNeXa's written consent, or to professional advisers with an equivalent duty of confidence where genuinely necessary. If disclosure is legally required, disclose only what is required and, where lawful, give OMNeXa prompt notice. Nothing in this agreement prevents lawful reporting to a regulator, protected disclosures or obtaining independent legal advice. B2B team access requires OMNeXa's approval and equivalent confidentiality commitments."
  },
  {
    title: "5. Responsible participation",
    text: "Test within the agreed scope, provide honest feedback and promptly report defects or concerns. Use synthetic or authorised test data; do not submit third-party personal data or confidential employer/client material without permission and appropriate safeguards. Do not attempt unauthorised access or disruptive testing. Pilot software is experimental and may change or be withdrawn; it is not a substitute for professional medical, tax, legal or financial advice. An adult parent or guardian must apply for any child-related pilot, and child participation requires a separately agreed arrangement."
  },
  {
    title: "6. Ownership and feedback",
    text: "OMNeXa retains its existing intellectual property and confidential materials. The participant retains their pre-existing intellectual property. The participant grants OMNeXa a non-exclusive, worldwide, royalty-free right to use voluntary pilot feedback to improve its products. No ownership of the participant's unrelated ideas, confidential employer information or personal data is transferred. Participation creates no employment, partnership, agency or equity entitlement."
  },
  {
    title: "7. B2C subscription benefit and B2B terms",
    text: B2C_BENEFIT + " " + B2B_BENEFIT + " If a product is not released, there is no subscription service to activate; OMNeXa will inform affected participants. Participation is voluntary, and any testing expectations must be communicated before the pilot starts."
  },
  {
    title: "8. Duration and ending participation",
    text: "Either party may end pilot participation by written notice. On request, stop using access and return or delete confidential materials, except one restricted archival copy needed to evidence this agreement or meet legal duties. Confidentiality obligations continue for three years after the last disclosure, and for trade secrets for as long as they remain trade secrets under applicable law. Ending a pilot does not remove a B2C benefit already earned through participation and agreed feedback."
  },
  {
    title: "9. Personal data",
    text: PILOT_PRIVACY_NOTICE
  },
  {
    title: "10. Electronic agreement and records",
    text: "By verifying their email, reviewing these terms, typing their full legal name and selecting the final sign-and-submit action, the applicant intends to sign this agreement electronically. OMNeXa supplies these terms electronically and accepts an application under them when the system confirms successful receipt. The acceptance record identifies the selected product, applicant, verified email, agreement version and signature action time. A copy is provided to both parties. Email verification confirms control of an email address, not independently verified legal identity. Preview test submissions are non-binding and do not enrol anyone in a pilot or activate a subscription."
  },
  {
    title: "11. Governing law and contact",
    text: "Singapore law governs this agreement, subject to any mandatory rights that apply to the participant. The parties will first try in good faith to resolve a concern by contacting support@omnexagoc.com; unresolved disputes may be brought before the Singapore courts, without limiting mandatory consumer rights. Any change to the agreed terms must be accepted in writing by both parties. If one provision is unenforceable, the remaining provisions continue to apply."
  }
];

export function pilotAgreementText(productName: string, audience: "B2C" | "B2B") {
  return [
    "OMNeXa Pilot Participation and Non-Disclosure Agreement",
    `Version: ${PILOT_AGREEMENT_VERSION}`,
    `Selected product: ${productName}`,
    `Pilot route: ${audience === "B2C" ? "Individual / B2C" : "Organisation / B2B"}`,
    "Applicable benefit: " + (audience === "B2C" ? B2C_BENEFIT : B2B_BENEFIT),
    ...PILOT_TERMS.map((term) => `${term.title}\n${term.text}`)
  ].join("\n\n");
}
