import crypto from "node:crypto";

export const ADMIN_SESSION_COOKIE = "omnexa_admin_session";
export const ADMIN_CHALLENGE_COOKIE = "omnexa_admin_challenge";

export type AdminSession = {
  email: string;
  exp: number;
};

export type AdminChallenge = {
  email: string;
  codeHash: string;
  exp: number;
};

function secret(): string {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET is not configured.");
  }
  return value;
}

function base64url(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function unbase64url(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signature(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function signToken<T extends object>(payload: T): string {
  const encoded = base64url(JSON.stringify(payload));
  return `${encoded}.${signature(encoded)}`;
}

export function verifyToken<T extends { exp: number }>(token?: string | null): T | null {
  if (!token) return null;
  const [encoded, suppliedSignature] = token.split(".");
  if (!encoded || !suppliedSignature) return null;

  const expected = signature(encoded);
  const supplied = Buffer.from(suppliedSignature);
  const expectedBuffer = Buffer.from(expected);
  if (supplied.length !== expectedBuffer.length) return null;
  if (!crypto.timingSafeEqual(supplied, expectedBuffer)) return null;

  try {
    const parsed = JSON.parse(unbase64url(encoded)) as T;
    if (!parsed.exp || parsed.exp < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function hashCode(email: string, code: string): string {
  return crypto
    .createHmac("sha256", secret())
    .update(`${email.toLowerCase()}:${code}`)
    .digest("hex");
}

export function safeCodeMatch(expected: string, actual: string): boolean {
  const a = Buffer.from(expected);
  const b = Buffer.from(actual);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function isAllowedAdmin(emailInput: string): boolean {
  const email = emailInput.trim().toLowerCase();
  const domain = (process.env.ADMIN_DOMAIN || "omnexagoc.com").toLowerCase();
  if (!email.endsWith(`@${domain}`)) return false;

  const allowList = (process.env.OMNEXA_ADMIN_EMAILS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return allowList.length === 0 ? true : allowList.includes(email);
}

export function makeEmployeeId(name: string): string {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("")
    .slice(0, 4);
  const stamp = new Date().getUTCFullYear().toString().slice(-2);
  const random = crypto.randomInt(1000, 9999);
  return `OMX-${stamp}-${initials || "EMP"}-${random}`;
}

export function suggestWorkEmail(name: string): string {
  const cleaned = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s.-]/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!cleaned.length) return "";
  const local = cleaned.length === 1 ? cleaned[0] : `${cleaned[0]}.${cleaned[cleaned.length - 1]}`;
  return `${local}@${process.env.ADMIN_DOMAIN || "omnexagoc.com"}`;
}
