import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, randomInt, randomUUID, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { Resend, type CreateEmailOptions } from "resend";
import { getClientKey, verifyRecaptcha } from "./booking";
import { pilotProducts } from "./pilot-catalog";
import { PILOT_AGREEMENT_VERSION, PILOT_SUPPORT_EMAIL, B2C_BENEFIT, B2B_BENEFIT, pilotAgreementText } from "./pilot-agreement";
import { PilotInputError, validatePilotApplication } from "./pilot-validation";
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
  return Boolean(process.env.RESEND_API_KEY && rawSecret().length >= 32 && fromAddress() && !fromAddress().includes("resend.dev") && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && process.env.RECAPTCHA_PROJECT_ID && process.env.RECAPTCHA_ENTERPRISE_API_KEY);
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
  console.error("Pilot request failed", { kind: error instanceof Error ? error.name : "Unknown" });
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
  if (captchaToken.length > 10000 || !await verifyRecaptcha(captchaToken, getClientKey(request), request.headers.get("user-agent") || undefined)) throw new PilotInputError("Please complete the human verification again.");
  const now = Date.now();
  const code = String(randomInt(100000, 1000000));
  const challenge: TokenData = { purpose: "challenge", application, reference: `OMX-${randomUUID()}`, version: PILOT_AGREEMENT_VERSION, preview: pilotIsPreview(), issuedAt: now, expiresAt: now + 10 * 60_000, code };
  const token = sealPilotToken(challenge);
  const product = pilotProducts.find((item) => item.slug === application.productSlug)!;
  await sendPilotEmail({
    to: application.email, replyTo: PILOT_SUPPORT_EMAIL,
    subject: `${challenge.preview ? "[PREVIEW TEST] " : ""}Your OMNeXa pilot verification code`,
    text: `Your verification code is ${code}.\n\nUse it within 10 minutes to continue your ${product.name} pilot application. This verifies your email; it does not sign the NDA or submit the application.\n\n${challenge.preview ? "This is a non-binding preview test. No pilot enrolment or subscription is activated.\n\n" : ""}If you did not request this code, ignore this email. Do not share the code.\n\nOMNeXa Pte. Ltd.\n${PILOT_SUPPORT_EMAIL}`
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
  limitPilot("submit-ip", getClientKey(request), 12);
  const session = readPilotToken(body.session, "verified");
  const application = session.application;
  const product = pilotProducts.find((item) => item.slug === application.productSlug)!;
  const signature = typeof body.signature === "string" ? body.signature.trim().replace(/\s+/g, " ") : "";
  if (signature.toLocaleLowerCase() !== application.fullName.replace(/\s+/g, " ").toLocaleLowerCase()) throw new PilotInputError("Type your full name exactly as shown in the application.");
  if (body.ndaConsent !== true || body.privacyConsent !== true || body.adultConsent !== true || body.benefitConsent !== true || (product.audience === "B2B" && body.authorityConsent !== true)) throw new PilotInputError("Please accept the required pilot terms and declarations.");
  if (body.agreementVersion !== PILOT_AGREEMENT_VERSION) throw new PilotHttpError("The agreement has changed. Please reload and review the latest terms.", 409);
  const signatureActionTime = typeof body.signatureActionTime === "string" ? body.signatureActionTime : "";
  const actionTime = Date.parse(signatureActionTime);
  if (!Number.isFinite(actionTime) || actionTime < session.issuedAt - 60_000 || actionTime > Date.now() + 60_000 || actionTime > session.expiresAt) throw new PilotInputError("Your signing session has expired. Please verify your email again.");
  const agreement = pilotAgreementText(product.name, product.audience);
  const agreementHash = createHash("sha256").update(agreement).digest("hex");
  const record = {
    reference: session.reference, environment: session.preview ? "PREVIEW TEST — NON-BINDING" : "PRODUCTION",
    application, product: product.name, audience: product.audience,
    emailVerifiedAtServer: session.verifiedAt, verificationMethod: "Email one-time code",
    signature, signatureActionTimeClient: signatureActionTime,
    agreementVersion: PILOT_AGREEMENT_VERSION, agreementSha256: agreementHash,
    declarations: { nda: true, privacy: true, adult: true, benefit: true, authority: product.audience === "B2B" },
    agreement
  };
  const recordJson = JSON.stringify(record, null, 2);
  const recordHash = createHash("sha256").update(recordJson).digest("hex");
  const integritySeal = createHmac("sha256", encryptionKey()).update(recordJson).digest("hex");
  const copy = [
    session.preview ? "PREVIEW TEST — NON-BINDING. No contract, pilot enrolment or subscription is activated." : "OMNeXa pilot application and electronic acceptance record",
    `Reference: ${session.reference}`, `Applicant: ${application.fullName}`, `Verified email: ${application.email}`,
    `Organisation: ${application.organisation || "Individual"}`, `Product: ${product.name}`, `Route: ${product.audience}`,
    `Email verified (server UTC): ${session.verifiedAt}`, `Signature action time (applicant device): ${signatureActionTime}`,
    `Typed signature: ${signature}`, `Agreement version: ${PILOT_AGREEMENT_VERSION}`,
    "Declarations accepted: NDA, privacy processing, adult applicant, subscription eligibility" + (product.audience === "B2B" ? ", authority to represent the organisation" : ""),
    `Agreement SHA-256: ${agreementHash}`, `Record SHA-256: ${recordHash}`, `Server integrity seal: ${integritySeal}`,
    "The email provider's message timestamp records when this copy was queued. The integrity seal is an internal record check, not an independently certified digital signature.",
    agreement
  ].join("\n\n");
  const prefix = session.preview ? "[PREVIEW TEST — NON-BINDING] " : "";
  const benefit = product.audience === "B2C" ? B2C_BENEFIT : B2B_BENEFIT;
  const attachments = [{ filename: `${session.reference}-agreement.txt`, content: Buffer.from(copy).toString("base64") }];
  const supportText = [
    `${prefix}Pilot application received`, `Reference: ${session.reference}`,
    `Product: ${product.name}`, `Initiative: ${product.initiativeName}`, `Route: ${product.audience}`,
    ...Object.entries(application).filter(([key]) => !["productSlug", "initiativeSlug"].includes(key)).map(([key, value]) => `${key}: ${value || "Not provided"}`),
    `Applicable benefit: ${benefit}`, "The complete agreement and acceptance copy are attached. A receipt is also queued to the applicant.", copy
  ].join("\n\n");
  // Queue the durable support copy first. Only then confirm receipt to the applicant.
  await sendPilotEmail({ to: PILOT_SUPPORT_EMAIL, replyTo: application.email, subject: `${prefix}Pilot request: ${product.name} | ${session.reference}`, text: supportText, attachments: [...attachments, { filename: `${session.reference}-record.json`, content: Buffer.from(recordJson).toString("base64") }] }, `pilot-support-${session.reference}`);
  let receiptQueued = true;
  try {
    await sendPilotEmail({
      to: application.email, replyTo: PILOT_SUPPORT_EMAIL,
      subject: `${prefix}We received your ${product.name} pilot request`, attachments,
      text: `Hello ${application.fullName},\n\nWe have received your pilot request for ${product.name}.\nReference: ${session.reference}\n\n${session.preview ? "This is a preview test only. No contract, pilot enrolment or subscription has been activated.\n\n" : "OMNeXa will review your request and contact you about suitability, timing and next steps. This receipt is not a pilot invitation or a product-access link.\n\n"}${benefit}\n\nYour agreement and acceptance copy are attached. You can reply to this email or contact ${PILOT_SUPPORT_EMAIL}, quoting your reference.\n\nThank you,\nOMNeXa Pte. Ltd.`
    }, `pilot-receipt-${session.reference}`);
  } catch {
    receiptQueued = false;
    console.error("Pilot receipt email pending", { reference: session.reference });
  }
  return { ok: true, reference: session.reference, preview: session.preview, receiptQueued, agreementCopy: copy, recordHash };
}
