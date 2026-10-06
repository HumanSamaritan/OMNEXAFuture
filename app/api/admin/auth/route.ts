import crypto from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  ADMIN_CHALLENGE_COOKIE,
  ADMIN_SESSION_COOKIE,
  AdminChallenge,
  hashCode,
  isAllowedAdmin,
  safeCodeMatch,
  signToken,
  verifyToken
} from "@/lib/admin-auth";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
type RateEntry = { count: number; resetAt: number };
const globalForAdminAuth = globalThis as typeof globalThis & {
  __omnexaAdminAuthRateLimit?: Map<string, RateEntry>;
};
const authRateLimit = globalForAdminAuth.__omnexaAdminAuthRateLimit ?? new Map<string, RateEntry>();
globalForAdminAuth.__omnexaAdminAuthRateLimit = authRateLimit;

function limited(key: string): boolean {
  const now = Date.now();
  const entry = authRateLimit.get(key);
  if (!entry || entry.resetAt < now) {
    authRateLimit.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) return true;
  entry.count += 1;
  return false;
}

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { action?: string; email?: string; code?: string };
    const action = String(body.action || "");
    const jar = await cookies();

    if (action === "logout") {
      jar.set(ADMIN_SESSION_COOKIE, "", cookieOptions(0));
      jar.set(ADMIN_CHALLENGE_COOKIE, "", cookieOptions(0));
      return NextResponse.json({ ok: true });
    }

    if (action === "request") {
      const email = String(body.email || "").trim().toLowerCase();
      if (!isAllowedAdmin(email)) {
        return NextResponse.json({ error: "This account is not authorised for OMNeXa Admin." }, { status: 403 });
      }

      const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
      if (limited(`${email}:${ip}`)) {
        return NextResponse.json({ error: "Too many login attempts. Try again in 10 minutes." }, { status: 429 });
      }

      if (!process.env.RESEND_API_KEY) {
        return NextResponse.json({ error: "Admin email login is not configured." }, { status: 503 });
      }

      const code = crypto.randomInt(100000, 999999).toString();
      const challenge: AdminChallenge = {
        email,
        codeHash: hashCode(email, code),
        exp: Date.now() + 10 * 60 * 1000
      };
      jar.set(ADMIN_CHALLENGE_COOKIE, signToken(challenge), cookieOptions(10 * 60));

      const resend = new Resend(process.env.RESEND_API_KEY);
      const from = process.env.CONTACT_FROM_EMAIL || "OMNeXa Admin <onboarding@resend.dev>";
      const result = await resend.emails.send({
        from,
        to: [email],
        subject: "Your OMNeXa Admin login code",
        html: `<div style="font-family:Arial,sans-serif;color:#172033;line-height:1.6"><h2>OMNeXa Admin</h2><p>Your one-time login code is:</p><p style="font-size:32px;font-weight:700;letter-spacing:8px">${code}</p><p>This code expires in 10 minutes. If you did not request it, ignore this email.</p></div>`
      });
      if (result.error) {
        jar.set(ADMIN_CHALLENGE_COOKIE, "", cookieOptions(0));
        return NextResponse.json({ error: "Unable to send the login code." }, { status: 502 });
      }
      return NextResponse.json({ ok: true });
    }

    if (action === "verify") {
      const code = String(body.code || "").trim();
      if (!/^\d{6}$/.test(code)) {
        return NextResponse.json({ error: "Enter the 6-digit code." }, { status: 400 });
      }

      const challenge = verifyToken<AdminChallenge>(jar.get(ADMIN_CHALLENGE_COOKIE)?.value);
      if (!challenge || !isAllowedAdmin(challenge.email)) {
        return NextResponse.json({ error: "The login request has expired. Request a new code." }, { status: 401 });
      }

      const suppliedHash = hashCode(challenge.email, code);
      if (!safeCodeMatch(challenge.codeHash, suppliedHash)) {
        return NextResponse.json({ error: "Incorrect login code." }, { status: 401 });
      }

      jar.set(
        ADMIN_SESSION_COOKIE,
        signToken({ email: challenge.email, exp: Date.now() + 8 * 60 * 60 * 1000 }),
        cookieOptions(8 * 60 * 60)
      );
      jar.set(ADMIN_CHALLENGE_COOKIE, "", cookieOptions(0));
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Unsupported action." }, { status: 400 });
  } catch (error) {
    console.error("Admin auth error", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Unable to complete admin login." }, { status: 500 });
  }
}
