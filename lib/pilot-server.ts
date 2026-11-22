import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, randomInt, randomUUID, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { Resend, type CreateEmailOptions } from "resend";
import { getClientKey, verifyRecaptcha } from "./booking";
import { pilotProducts } from "./pilot-catalog";
import { PILOT_AGREEMENT_VERSION, PILOT_SUPPORT_EMAIL, B2C_BENEFIT, B2B_BENEFIT, pilotAgreementText } from "./pilot-agreement";
import { PilotInputError, validatePilotApplication } from "./pilot-validation";
import { createPilotIntake } from "./pilot-firestore";
import type { PilotApplication } from "./pilot-types";

type TokenData = {
  purpose: "challenge" | "verified";
  application: PilotApplication;
  reference: string;
  version: string;
  preview: boolean;
  issuedAt: number;
  expiresAt: number;
  code?: string;
  verifiedAt?: string;
};

export class PilotHttpError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}

export const pilotIsPreview = () => process.env.VERCEL_ENV !== "production";
const rawSecret = () => process.env.PILOT_SIGNING_SECRET || process.env.BOOKING_SESSION_SECRET || "";
const fromAddress = () => process.env.PILOT_FROM_EMAIL || process.env.CONTACT_FROM_EMAIL || "";

export function pilotReady() {
  return Boolean(process.env.RESEND_API_KEY && fromAddress() && !fromAddress().includes("resend.dev") && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && process.env.RECAPTCHA_PROJECT_ID && process.env.RECAPTCHA_ENTERPRISE_API_KEY);
}

function encryptionKey() {
  if (rawSecret().length < 32) throw new PilotHttpError("Pilot registration is temporarily unavailable. Please contact support@omnexagoc.com.", 503);
  // Derive a separate key; booking tokens cannot be used as pilot tokens.
  return createHmac("sha256", rawSecret()).update("omnexa-pilot-v1").digest();
}

export function sealPilotToken(data: TokenData) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(data), "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString("base64url");
}

export function readPilotToken(token: unknown, purpose: TokenData["purpose"]): TokenData {
  try {
    if (typeof token !== "string" || token.length > 22000) throw new Error();
    const packed = Buffer.from(token, "base64url");
    if (packed.length < 29) throw new Error();
    const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), packed.subarray(0, 12));
    decipher.setAuthTag(packed.subarray(12, 28));
    const data = JSON.parse(Buffer.concat([decipher.update(packed.subarray(28)), decipher.final()]).toString("utf8")) as TokenData;
    if (data.purpose !== purpose || data.version !== PILOT_AGREEMENT_VERSION || data.preview !== pilotIsPreview() || !Number.isFinite(data.expiresAt) || data.expiresAt <= Date.now() || data.issuedAt > Date.now() + 30000 || !/^OMX-[a-f0-9-]{36}$/.test(data.reference)) throw new Error();
    data.application = validatePilotApplication(data.application);
    return data;
  } catch {
    throw new PilotHttpError("This verification session has expired or is invalid. Please verify your email again.", 401);
  }
}

type RateEntry = { count: number; resetAt: number };
const globalPilot = globalThis as typeof globalThis & { __omnexaPilotLimits?: Map<string, RateEntry> };
const rateStore = globalPilot.__omnexaPilotLimits ?? new Map<string, RateEntry>();
globalPilot.__omnexaPilotLimits = rateStore;

export function limitPilot(scope: string, key: string, max: number, windowMs = 10 * 60_000) {
  const now = Date.now();
  // Bounded best-effort instance limiter; reCAPTCHA also protects email issuance.
  if (rateStore.size > 2000) {
    Array.from(rateStore.entries()).forEach(([name, entry]) => { if (entry.resetAt <= now) rateStore.delete(name); });
    if (rateStore.size > 4000) throw new PilotHttpError("Registration is busy. Please try again shortly.", 429);
  }
  const mapKey = `${scope}:${createHash("sha256").update(key).digest("hex")}`;
  const entry = rateStore.get(mapKey);
  if (!entry || entry.resetAt <= now) { rateStore.set(mapKey, { count: 1, resetAt: now + windowMs }); return; }
  if (entry.count >= max) throw new PilotHttpError("Too many attempts. Please wait ten minutes before trying again.", 429);
  entry.count += 1;
}

export async function readPilotRequest(request: Request): Promise<Record<string, unknown>> {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) throw new PilotHttpError("Cross-origin request blocked.", 403);
  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) throw new PilotHttpError("Unsupported request format.", 415);
  if (Number(request.headers.get("content-length")) > 30000) throw new PilotHttpError("Request is too large.", 413);
  const text = await request.text();
  if (Buffer.byteLength(text) > 30000) throw new PilotHttpError("Request is too large.", 413);
  let body: unknown;
  try { body = JSON.parse(text); } catch { throw new PilotHttpError("Invalid request."); }
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new PilotHttpError("Invalid request.");
  const input = body as Record<string, unknown>;
  if (input.companyWebsite) throw new PilotHttpError("Unable to continue.");
  return input;
}

export function pilotResponse(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: { "Cache-Control": "no-store", ...(status === 429 ? { "Retry-After": "600" } : {}) } });
}

export function pilotError(error: unknown) {
  if (error instanceof PilotHttpError) return pilotResponse({ error: error.message }, error.status);
  if (error instanceof PilotInputError) return pilotResponse({ error: error.message }, 400);
  // Never log application content, codes, tokens or signatures.
  const kind = error instanceof Error ? error.name : "Unknown";
  console.error("Pilot request failed", { kind });
  void sendPilotEmail({
    to: PILOT_SUPPORT_EMAIL,
    subject: "OMNeXa pilot request needs admin review",
    text: `A pilot request could not be completed automatically. Please review the production logs and Firestore intake queue.\n\nError category: ${kind}\nOccurred: ${new Date().toISOString()}\n\nNo applicant codes, signatures, or request payload were included in this alert.`
  }, `pilot-error-${createHash("sha256").update(kind + new Date().toISOString().slice(0, 13)).digest("hex")}`).catch(() => {
    console.error("Pilot support escalation email failed");
  });
  return pilotResponse({ error: "Unable to complete this request right now. Please try again or contact support@omnexagoc.com." }, 500);
}

async function sendPilotEmail(payload: Omit<CreateEmailOptions, "from">, idempotencyKey: string) {
  if (!process.env.RESEND_API_KEY || !fromAddress() || fromAddress().includes("resend.dev")) throw new PilotHttpError("Pilot email service is temporarily unavailable. Please contact support@omnexagoc.com.", 503);
  const resend = new Resend(process.env.RESEND_API_KEY);
  const result = await resend.emails.send({ ...payload, from: fromAddress() } as CreateEmailOptions, { idempotencyKey });
  if (result.error || !result.data?.id) {
    console.error("Pilot email provider rejected message", { type: result.error?.name || "empty_response" });
    throw new PilotHttpError("Email delivery could not be queued. Please retry without changing this application, or contact support@omnexagoc.com with your reference.", 502);
  }
  return result.data.id;
}

export async function requestPilotCode(body: Record<string, unknown>, request: Request) {
  if (!pilotReady()) throw new PilotHttpError("Pilot registration is temporarily unavailable. Please contact support@omnexagoc.com.", 503);
  limitPilot("send-ip", getClientKey(request), 6);
  const application = validatePilotApplication(body.application);
  if (body.privacyConsent !== true || body.adultConsent !== true) throw new PilotInputError("Please confirm you are an adult and consent to processing your pilot application.");
  limitPilot("send-email", application.email, 3);
  const captchaToken = typeof body.captchaToken === "string" ? body.captchaToken : "";
  if (!pilotIsPreview() && (captchaToken.length > 10000 || !await verifyRecaptcha(captchaToken, getClientKey(request), request.headers.get("user-agent") || undefined))) throw new PilotInputError("Please complete the human verification again.");
  const now = Date.now();
  const code = String(randomInt(100000, 1000000));
  const challenge: TokenData = { purpose: "challenge", application, reference: `OMX-${randomUUID()}`, version: PILOT_AGREEMENT_VERSION, preview: pilotIsPreview(), issuedAt: now, expiresAt: now + 10 * 60_000, code };
  const token = sealPilotToken(challenge);
  const productNames = pilotProducts.filter((item) => (application.productSlugs || [application.productSlug]).includes(item.slug)).map((item) => item.name).join(", ");
  await sendPilotEmail({
    to: application.email, replyTo: PILOT_SUPPORT_EMAIL,
    subject: `${challenge.preview ? "[PREVIEW TEST] " : ""}Your OMNeXa pilot verification code`,
    text: `Your verification code is ${code}.\n\nUse it within 10 minutes to continue your ${productNames} pilot application. This verifies your email; it does not sign the NDA or submit the application.\n\n${challenge.preview ? "This is a non-binding preview test. No pilot enrolment or subscription is activated.\n\n" : ""}If you did not request this code, ignore this email. Do not share the code.\n\nOMNeXa Pte. Ltd.\n${PILOT_SUPPORT_EMAIL}`
  }, `pilot-code-${challenge.reference}`);
  return { ok: true, challenge: token, expiresAt: new Date(challenge.expiresAt).toISOString() };
}

export function verifyPilotCode(body: Record<string, unknown>, request: Request) {
  limitPilot("verify-ip", getClientKey(request), 12);
  const challenge = readPilotToken(body.challenge, "challenge");
  limitPilot("verify-code", challenge.reference, 5);
  const code = typeof body.code === "string" ? body.code.trim() : "";
  if (!/^\d{6}$/.test(code) || !challenge.code || !timingSafeEqual(Buffer.from(code), Buffer.from(challenge.code))) throw new PilotInputError("That code is incorrect. Please check the email and try again.");
  const now = Date.now();
  const verified: TokenData = { ...challenge, purpose: "verified", code: undefined, verifiedAt: new Date(now).toISOString(), issuedAt: now, expiresAt: now + 30 * 60_000 };
  return { ok: true, session: sealPilotToken(verified), reference: verified.reference, verifiedAt: verified.verifiedAt, expiresAt: new Date(verified.expiresAt).toISOString(), agreementVersion: PILOT_AGREEMENT_VERSION };
}

export async function submitPilotApplication(body: Record<string, unknown>, request: Request) {
  if (!pilotReady()) throw new PilotHttpError("Pilot registration email is temporarily unavailable. Please contact support@omnexagoc.com.", 503);
  limitPilot("submit-ip", getClientKey(request), 12);
  const captchaToken = typeof body.captchaToken === "string" ? body.captchaToken : "";
  // CAPTCHA was already verified during /api/pilot/send, before issuing the signed challenge.
  // Final submission requires the short-lived verified-email token below; avoid requiring
  // a second CAPTCHA token that is cleared during navigation to the NDA step.
  const verified = readPilotToken(body.session, "verified");
  const application = validatePilotApplication(body.application);
  if (JSON.stringify(verified.application) !== JSON.stringify(application)) {
    throw new PilotHttpError("Your application changed after email verification. Please verify again.", 401);
  }
  const selectedProducts = pilotProducts.filter((item) => (application.productSlugs || [application.productSlug]).includes(item.slug));
  const product = pilotProducts.find((p) => p.slug === application.productSlug)!;
  const hasB2B = selectedProducts.some((p) => p.audience === "B2B");
  const hasB2C = selectedProducts.some((p) => p.audience === "B2C");
  const agreementAudience = hasB2B && hasB2C ? "MIXED" : hasB2B ? "B2B" : "B2C";
  const productNames = selectedProducts.map((item) => item.name).join(", ");
  const signature = typeof body.signature === "string" ? body.signature.trim().replace(/\s+/g, " ") : "";
  if (signature.toLocaleLowerCase() !== application.fullName.replace(/\s+/g, " ").toLocaleLowerCase()) throw new PilotInputError("Type your full name exactly as shown in the application.");
  if (body.ndaConsent !== true || body.privacyConsent !== true || body.adultConsent !== true || body.benefitConsent !== true || (hasB2B && body.authorityConsent !== true)) throw new PilotInputError("Please accept the required pilot terms and declarations.");
  if (body.agreementVersion !== PILOT_AGREEMENT_VERSION) throw new PilotHttpError("The agreement has changed. Please reload and review the latest terms.", 409);
  const signatureActionTime = typeof body.signatureActionTime === "string" ? body.signatureActionTime : "";
  const actionTime = Date.parse(signatureActionTime);
  if (!Number.isFinite(actionTime) || actionTime > Date.now() + 60_000) throw new PilotInputError("Your signing session has expired. Please review and submit again.");
  const reference = verified.reference;
  const preview = pilotIsPreview();
  const agreement = pilotAgreementText(selectedProducts.map((p) => `${p.initiativeName}: ${p.name} (${p.audience})`).join("; "), agreementAudience);
  const agreementHash = createHash("sha256").update(agreement).digest("hex");
  const record = {
    reference, environment: preview ? "PREVIEW TEST — NON-BINDING" : "PRODUCTION",
    application, product: productNames, products: selectedProducts.map((p) => ({ slug:p.slug, name:p.name, category:p.initiativeName, audience:p.audience, description:p.description, browseUrl:p.browseUrl })), audience: agreementAudience,
    verificationMethod: "Email one-time code", verifiedAt: verified.verifiedAt,
    signature, signatureActionTimeClient: signatureActionTime,
    agreementVersion: PILOT_AGREEMENT_VERSION, agreementSha256: agreementHash,
    declarations: { nda: true, privacy: true, adult: true, benefit: true, authority: hasB2B },
    agreement
  };
  const recordJson = JSON.stringify(record, null, 2);
  const recordHash = createHash("sha256").update(recordJson).digest("hex");
  const integritySeal = createHmac("sha256", encryptionKey()).update(recordJson).digest("hex");
  const approvedAt = new Date().toISOString();
  const autoApproved = !preview && selectedProducts.length === 1 && !hasB2B;
  // Preview is a non-binding email-flow test: never write applicant PII to production Firestore.
  // The preview branch has no independent pilot Firestore credentials configured.
  if (!preview) await createPilotIntake({
    reference, productSlug: application.productSlug, productSlugs: application.productSlugs || [application.productSlug], email: application.email,
    status: autoApproved ? "approved" : "pending_review", ...(autoApproved ? { approvedAt, approvalMethod: "validated-pilot-submission" } : {}), createdAt: approvedAt,
    agreementVersion: PILOT_AGREEMENT_VERSION, agreementSha256: agreementHash,
    recordSha256: recordHash,
    consents: { nda: true, privacy: true, adult: true, benefit: true, authority: hasB2B },
    application: application as unknown as Record<string, unknown>,
    firstUsedAt: null, lastUsedAt: null
  }, request);
  const copy = [
    preview ? "PREVIEW TEST — NON-BINDING. No contract, pilot enrolment or subscription is activated." : "OMNeXa pilot application and electronic acceptance record",
    `Reference: ${reference}`, `Applicant: ${application.fullName}`, `Email: ${application.email}`,
    `Organisation: ${application.organisation || "Individual"}`, `Products: ${selectedProducts.map((p) => `${p.initiativeName}: ${p.name} (${p.audience})`).join("; ")}`, `Route: ${agreementAudience}`,
    `Interest submitted (server UTC): ${new Date().toISOString()}`, `Signature action time (applicant device): ${signatureActionTime}`,
    `Typed signature: ${signature}`, `Agreement version: ${PILOT_AGREEMENT_VERSION}`,
    "Declarations accepted: NDA, privacy processing, adult applicant, subscription eligibility" + (hasB2B ? ", authority to represent the organisation" : ""),
    `Agreement SHA-256: ${agreementHash}`, `Record SHA-256: ${recordHash}`, `Server integrity seal: ${integritySeal}`,
    "The email provider's message timestamp records when this copy was queued. The integrity seal is an internal record check, not an independently certified digital signature.",
    agreement
  ].join("\n\n");
  const prefix = preview ? "[PREVIEW TEST — NON-BINDING] " : "";
  const benefit = (hasB2C ? B2C_BENEFIT : "") + (hasB2B ? " " + B2B_BENEFIT : "");
  const attachments = [{ filename: `${reference}-agreement.txt`, content: Buffer.from(copy).toString("base64") }];
  // Clean, verified applications are auto-approved; only unexpected failures are escalated to support.
  const appUrls = selectedProducts.map((p) => ({ name:p.name, url:p.browseUrl, category:p.initiativeName, description:p.description, audience:p.audience, readiness:p.readiness }));
  const appUrl = appUrls[0]?.url || "";
  const htmlEscape = (v: string) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  const categories = Array.from(new Set(appUrls.map((p) => p.category)));
  const productLinksHtml = categories.map((category) => {
    const rows = appUrls.filter((p) => p.category === category).map((p) =>
      `<tr><td style="padding:10px;border:1px solid #dce5e5"><strong>${htmlEscape(p.name)}</strong><br><small>${p.audience}</small></td><td style="padding:10px;border:1px solid #dce5e5">${htmlEscape(p.description)}${p.readiness === "review" ? "<br><small>Pilot readiness subject to review</small>" : ""}</td><td style="padding:10px;border:1px solid #dce5e5"><a href="${htmlEscape(p.url)}">Browse</a></td></tr>`
    ).join("");
    return `<h2 style="background:#103149;color:white;padding:12px;font-size:16px">${htmlEscape(category)}</h2><table role="presentation" style="border-collapse:collapse;width:100%"><tr style="background:#e6f2f1"><th align="left">Product</th><th align="left">Details</th><th align="left">Link</th></tr>${rows}</table>`;
  }).join("");
  const productionApproved = selectedProducts.length === 1 && !hasB2B;
  const emailHtml = `<!doctype html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:24px 10px;background:#f2f5f8;font-family:Arial,Helvetica,sans-serif;color:#15283a"><table role="presentation" align="center" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;border-collapse:collapse"><tr><td style="background:#081b2a;padding:30px 32px;text-align:center;border-radius:16px 16px 0 0;border-top:4px solid #c49b4d"><img alt="OMNeXa" src="https://www.omnexagoc.com/omnexa-logo.png" width="120" style="display:block;margin:0 auto 14px;max-width:120px;height:auto;border:0"><div style="color:#e9c978;font-size:27px;font-weight:bold;letter-spacing:1px">OMNeXa</div><div style="color:#e1ebf2;font-size:13px;margin-top:5px">Where Consciousness Meets Intelligence</div></td></tr><tr><td style="background:#ffffff;padding:32px;border:1px solid #e1e8eb">${preview ? `<div style="background:#fff1d3;border:1px solid #d2a64b;padding:10px 12px;color:#735018;font-size:12px;font-weight:bold;line-height:1.5;margin-bottom:20px">TEST EMAIL — PRODUCTION TEMPLATE PREVIEW. No registration, access or benefit is activated by this test.</div>` : ""}<div style="color:#117a76;font-size:12px;font-weight:bold;letter-spacing:1.7px">${productionApproved ? "PILOT APPLICATION APPROVED" : "PILOT INTERESTS RECEIVED"}</div><h1 style="font-size:25px;line-height:1.3;margin:12px 0 16px;color:#102639">${productionApproved ? "Your OMNeXa pilot application has been approved" : "Your OMNeXa pilot selections have been received"}</h1><p style="font-size:16px;line-height:1.7">Dear ${htmlEscape(application.fullName)},</p><p style="font-size:15px;line-height:1.7">${productionApproved ? "Thank you for your interest in participating in the OMNeXa pilot programme. Your application has passed the initial registration checks for the selected product." : "Thank you for your interest in participating in OMNeXa product pilots. We have received your selected products for assessment against their individual pilot eligibility and availability criteria."}</p><p style="font-size:15px;line-height:1.6">The following consolidated summary lists your selected products by service category. Please use the individual links to learn more about each product. OMNeXa will communicate product-specific access arrangements separately. Selection alone does not activate any pilot or subscription.</p><table role="presentation" style="width:100%;background:#f2f8f7;border-collapse:collapse;margin:22px 0"><tr><td style="padding:15px 18px;font-size:13px;color:#536677">Application reference<br><strong style="color:#102639;font-size:15px;word-break:break-all">${htmlEscape(reference)}</strong></td></tr><tr><td style="padding:0 18px 17px;font-size:13px;color:#536677">Verified email<br><strong style="color:#102639;font-size:14px;word-break:break-all">${htmlEscape(application.email)}</strong></td></tr></table><h2 style="font-size:18px;color:#123345;margin:22px 0 10px">Your selected pilot products</h2>${productLinksHtml}<p style="font-size:13px;line-height:1.65;color:#586d7a;margin:20px 0">Each product is subject to its own participation requirements. Eligible B2C six-month benefits require actual pilot participation and agreed feedback. B2B pilots are subject to separately agreed organisational terms. A copy of your agreement is attached for your records.</p><p style="font-size:13px;line-height:1.6;color:#697a88">The product website is provided for information. Pilot access remains subject to eligibility and any applicable sign-in restrictions.</p><p style="font-size:14px;line-height:1.7;margin-top:20px">For questions, please contact <a href="mailto:support@omnexagoc.com" style="color:#086b70">support@omnexagoc.com</a>.</p><p style="font-size:14px;line-height:1.7">Kind regards,<br><strong>OMNeXa Pilot Coordination Team</strong><br>OMNeXa Pte. Ltd., Singapore</p></td></tr><tr><td style="background:#081b2a;border-radius:0 0 16px 16px;padding:20px 30px;text-align:center;color:#e0edf2;font-size:12px">OMNeXa Pte. Ltd. &nbsp;•&nbsp; <a href="mailto:support@omnexagoc.com" style="color:#e8cc7f">support@omnexagoc.com</a></td></tr></table></body></html>`;
  await sendPilotEmail({
    to: application.email,
    replyTo: PILOT_SUPPORT_EMAIL,
    subject: `${prefix}${productionApproved ? "Your OMNeXa pilot application has been approved" : "Your OMNeXa pilot selections have been received"} — ${selectedProducts.length} product(s)`,
    text: `Thank you for registering your interest in ${productNames}.\n\nYour reference: ${reference}\nVerified email: ${application.email}\n\n${preview ? "TEST EMAIL — PRODUCTION TEMPLATE PREVIEW. No pilot registration is stored or activated.\n\n" : ""}${productionApproved ? "Your application has passed the initial registration checks. Product access arrangements are communicated separately." : "Your selected interests have been received and are subject to product-specific eligibility and availability review."}\n\nProduct links:\n${appUrls.map((item) => `${item.category} / ${item.name} (${item.audience}): ${item.description} — ${item.url}`).join("\n")}\n\nYour agreement copy is attached.\n\nOMNeXa support: ${PILOT_SUPPORT_EMAIL}`,
    html: emailHtml,
    attachments
  }, `pilot-applicant-${reference}`);
  return { ok: true, reference, preview, agreementCopy: copy, recordHash, appUrl, appUrls };
}
