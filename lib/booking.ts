import {
  createHash,
  createHmac,
  createSign,
  randomUUID,
  timingSafeEqual
} from "crypto";

export const BOOKING_TIME_ZONE = "Asia/Singapore";
export const BOOKING_TIME_ZONE_LABEL = "UTC +08:00 · Singapore";

const DEFAULT_DURATION_MINUTES = 30;
const DEFAULT_STEP_MINUTES = 30;
const DEFAULT_OPEN = "09:00";
const DEFAULT_CLOSE = "18:00";
const DEFAULT_MIN_NOTICE_HOURS = 4;
const DEFAULT_HORIZON_DAYS = 30;
const SESSION_TTL_SECONDS = 20 * 60;

export type BookingIdentity = {
  name: string;
  email: string;
  company: string;
  jobTitle: string;
  phone: string;
  focus: string;
};

type SessionPayload = BookingIdentity & {
  v: 1;
  nonce: string;
  iat: number;
  exp: number;
};

export type BookingSlot = {
  start: string;
  end: string;
};

type BusyPeriod = {
  start: string;
  end: string;
};

type GoogleTokenCache = {
  token: string;
  expiresAt: number;
};

type RateEntry = {
  count: number;
  resetAt: number;
};

const globalState = globalThis as typeof globalThis & {
  __omnexaBookingGoogleToken?: GoogleTokenCache;
  __omnexaBookingRateLimit?: Map<string, RateEntry>;
};

const rateLimitStore =
  globalState.__omnexaBookingRateLimit ?? new Map<string, RateEntry>();
globalState.__omnexaBookingRateLimit = rateLimitStore;

function intFromEnv(name: string, fallback: number, min: number, max: number): number {
  const value = Number(process.env[name] || "");
  if (!Number.isInteger(value) || value < min || value > max) return fallback;
  return value;
}

function parseClock(value: string, fallback: string): number {
  const candidate = /^([01]\d|2[0-3]):([0-5]\d)$/.test(value) ? value : fallback;
  const [hour, minute] = candidate.split(":").map(Number);
  return hour * 60 + minute;
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function base64UrlJson(value: unknown): string {
  return Buffer.from(JSON.stringify(value), "utf8").toString("base64url");
}

function safeText(value: unknown, max: number): string {
  return String(value ?? "").trim().slice(0, max);
}

function sessionSecret(): string {
  const secret = process.env.BOOKING_SESSION_SECRET || "";
  if (secret.length < 32) {
    throw new Error("BOOKING_SESSION_SECRET is not configured securely.");
  }
  return secret;
}

function bookingCalendarId(): string {
  return process.env.OMNEXA_BOOKING_CALENDAR_ID || "primary";
}

function googlePrivateKey(): string {
  return (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || "").replace(/\\n/g, "\n");
}

function officeConfig() {
  const duration = intFromEnv(
    "BOOKING_DURATION_MINUTES",
    DEFAULT_DURATION_MINUTES,
    15,
    120
  );
  const step = intFromEnv("BOOKING_SLOT_STEP_MINUTES", DEFAULT_STEP_MINUTES, 5, 60);
  const open = parseClock(process.env.BOOKING_DAY_START || "", DEFAULT_OPEN);
  const close = parseClock(process.env.BOOKING_DAY_END || "", DEFAULT_CLOSE);
  const minNoticeHours = intFromEnv(
    "BOOKING_MIN_NOTICE_HOURS",
    DEFAULT_MIN_NOTICE_HOURS,
    0,
    168
  );
  const horizonDays = intFromEnv(
    "BOOKING_HORIZON_DAYS",
    DEFAULT_HORIZON_DAYS,
    1,
    120
  );
  const buffer = intFromEnv("BOOKING_BUFFER_MINUTES", 0, 0, 60);

  return { duration, step, open, close, minNoticeHours, horizonDays, buffer };
}

function singaporeDateFromInstant(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: BOOKING_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${map.year}-${map.month}-${map.day}`;
}

function singaporeMinutesFromInstant(date: Date): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: BOOKING_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).formatToParts(date);
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return Number(map.hour) * 60 + Number(map.minute);
}

function sgInstant(date: string, minutes: number): Date {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return new Date(`${date}T${pad(hour)}:${pad(minute)}:00+08:00`);
}

function calendarDay(date: string): number {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

function isDateShape(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(`${date}T00:00:00Z`));
}

function overlaps(
  start: number,
  end: number,
  busyStart: number,
  busyEnd: number,
  bufferMinutes: number
): boolean {
  const bufferMs = bufferMinutes * 60_000;
  return start < busyEnd + bufferMs && end > busyStart - bufferMs;
}

function googleConfigured(): boolean {
  const hasRefreshToken = Boolean(
    process.env.GOOGLE_CALENDAR_CLIENT_ID &&
      process.env.GOOGLE_CALENDAR_CLIENT_SECRET &&
      process.env.GOOGLE_CALENDAR_REFRESH_TOKEN
  );
  const hasServiceAccount = Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && googlePrivateKey()
  );
  return hasRefreshToken || hasServiceAccount;
}

async function googleTokenFromRefreshToken(): Promise<GoogleTokenCache> {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CALENDAR_CLIENT_ID || "",
    client_secret: process.env.GOOGLE_CALENDAR_CLIENT_SECRET || "",
    refresh_token: process.env.GOOGLE_CALENDAR_REFRESH_TOKEN || "",
    grant_type: "refresh_token"
  });

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: params,
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Google OAuth token refresh failed (${response.status}).`);
  }

  const data = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
  };

  if (!data.access_token) throw new Error("Google OAuth did not return an access token.");

  return {
    token: data.access_token,
    expiresAt: Date.now() + Math.max(60, Number(data.expires_in || 3600) - 90) * 1000
  };
}

async function googleTokenFromServiceAccount(): Promise<GoogleTokenCache> {
  const serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "";
  const privateKey = googlePrivateKey();
  if (!serviceEmail || !privateKey) {
    throw new Error("Google service-account credentials are incomplete.");
  }

  const now = Math.floor(Date.now() / 1000);
  const header = base64UrlJson({ alg: "RS256", typ: "JWT" });
  const claims: Record<string, unknown> = {
    iss: serviceEmail,
    scope: "https://www.googleapis.com/auth/calendar",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600
  };

  if (process.env.GOOGLE_WORKSPACE_SUBJECT) {
    claims.sub = process.env.GOOGLE_WORKSPACE_SUBJECT;
  }

  const payload = base64UrlJson(claims);
  const unsigned = `${header}.${payload}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const signature = signer.sign(privateKey).toString("base64url");
  const assertion = `${unsigned}.${signature}`;

  const params = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion
  });

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: params,
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Google service-account authentication failed (${response.status}).`);
  }

  const data = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
  };

  if (!data.access_token) {
    throw new Error("Google service-account authentication returned no access token.");
  }

  return {
    token: data.access_token,
    expiresAt: Date.now() + Math.max(60, Number(data.expires_in || 3600) - 90) * 1000
  };
}

async function getGoogleAccessToken(): Promise<string> {
  const cached = globalState.__omnexaBookingGoogleToken;
  if (cached && cached.expiresAt > Date.now()) return cached.token;

  if (!googleConfigured()) {
    throw new Error("Google Calendar booking is not configured.");
  }

  const token =
    process.env.GOOGLE_CALENDAR_REFRESH_TOKEN
      ? await googleTokenFromRefreshToken()
      : await googleTokenFromServiceAccount();

  globalState.__omnexaBookingGoogleToken = token;
  return token.token;
}

async function getBusyPeriods(timeMin: string, timeMax: string): Promise<BusyPeriod[]> {
  const token = await getGoogleAccessToken();
  const calendarId = bookingCalendarId();

  const response = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      timeMin,
      timeMax,
      timeZone: BOOKING_TIME_ZONE,
      items: [{ id: calendarId }]
    }),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Google Calendar availability check failed (${response.status}).`);
  }

  const data = (await response.json()) as {
    calendars?: Record<string, { busy?: BusyPeriod[]; errors?: unknown[] }>;
  };

  const calendar = data.calendars?.[calendarId];
  if (!calendar || calendar.errors?.length) {
    throw new Error("Google Calendar could not read booking availability.");
  }

  return calendar.busy || [];
}

export function sanitizeBookingIdentity(input: Record<string, unknown>): BookingIdentity {
  return {
    name: safeText(input.name, 100),
    email: safeText(input.email, 254).toLowerCase(),
    company: safeText(input.company, 160),
    jobTitle: safeText(input.jobTitle, 120),
    phone: safeText(input.phone, 40),
    focus: safeText(input.focus, 1200)
  };
}

export function validateBookingIdentity(identity: BookingIdentity): string | null {
  if (identity.name.length < 2) return "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identity.email)) {
    return "Please enter a valid email address.";
  }
  if (identity.company.length < 2) return "Please enter your organisation or company.";
  if (identity.jobTitle.length < 2) return "Please enter your role or job title.";
  return null;
}

const personalEmailDomains = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.co.uk",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "icloud.com",
  "me.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "gmx.com"
]);

export function isPersonalEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase() || "";
  return personalEmailDomains.has(domain);
}

export function requireWorkEmail(): boolean {
  return process.env.BOOKING_REQUIRE_WORK_EMAIL === "true";
}

export function rateLimited(
  scope: string,
  key: string,
  maxRequests = 8,
  windowMs = 10 * 60 * 1000
): boolean {
  const now = Date.now();
  const storageKey = `${scope}:${key}`;
  const entry = rateLimitStore.get(storageKey);

  if (!entry || entry.resetAt <= now) {
    rateLimitStore.set(storageKey, { count: 1, resetAt: now + windowMs });
    return false;
  }

  if (entry.count >= maxRequests) return true;

  entry.count += 1;
  rateLimitStore.set(storageKey, entry);
  return false;
}

export function getClientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const real = request.headers.get("x-real-ip")?.trim();
  return forwarded || real || "unknown";
}

export function sameOriginRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  return origin === new URL(request.url).origin;
}

export async function verifyRecaptcha(
  token: string,
  remoteIp?: string,
  userAgent?: string
): Promise<boolean> {
  const projectId = process.env.RECAPTCHA_PROJECT_ID || "";
  const apiKey = process.env.RECAPTCHA_ENTERPRISE_API_KEY || "";
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

  if (!projectId || !apiKey || !siteKey || !token) return false;

  const event: Record<string, string> = {
    token,
    siteKey
  };

  if (remoteIp && remoteIp !== "unknown") event.userIpAddress = remoteIp;
  if (userAgent) event.userAgent = userAgent.slice(0, 512);

  const response = await fetch(
    `https://recaptchaenterprise.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/assessments?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ event }),
      cache: "no-store"
    }
  );

  if (!response.ok) {
    console.error("reCAPTCHA Enterprise assessment failed", { status: response.status });
    return false;
  }

  const result = (await response.json()) as {
    tokenProperties?: {
      valid?: boolean;
      hostname?: string;
      invalidReason?: string;
    };
    riskAnalysis?: {
      challenge?: string;
    };
  };

  if (!result.tokenProperties?.valid) {
    console.warn("reCAPTCHA token rejected", {
      reason: result.tokenProperties?.invalidReason || "unknown"
    });
    return false;
  }

  const expectedHost = process.env.RECAPTCHA_EXPECTED_HOSTNAME?.trim();
  if (expectedHost && result.tokenProperties.hostname !== expectedHost) return false;

  const challenge = result.riskAnalysis?.challenge;
  if (challenge && challenge !== "PASS") return false;

  return true;
}

export function createBookingSession(identity: BookingIdentity): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    ...identity,
    v: 1,
    nonce: randomUUID(),
    iat: now,
    exp: now + SESSION_TTL_SECONDS
  };

  const encoded = base64UrlJson(payload);
  const signature = createHmac("sha256", sessionSecret())
    .update(encoded)
    .digest("base64url");

  return `${encoded}.${signature}`;
}

export function readBookingSession(token: string): SessionPayload | null {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expected = createHmac("sha256", sessionSecret())
    .update(encoded)
    .digest("base64url");

  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (
    actualBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(actualBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as SessionPayload;
    const now = Math.floor(Date.now() / 1000);
    if (payload.v !== 1 || payload.exp <= now || payload.iat > now + 60) return null;
    return payload;
  } catch {
    return null;
  }
}

export function bookingPublicConfig() {
  const config = officeConfig();
  return {
    configured: googleConfigured(),
    durationMinutes: config.duration,
    stepMinutes: config.step,
    timeZone: BOOKING_TIME_ZONE,
    timeZoneLabel: BOOKING_TIME_ZONE_LABEL,
    dayStart: process.env.BOOKING_DAY_START || DEFAULT_OPEN,
    dayEnd: process.env.BOOKING_DAY_END || DEFAULT_CLOSE,
    horizonDays: config.horizonDays
  };
}

export async function availableSlotsForDate(date: string): Promise<BookingSlot[]> {
  if (!isDateShape(date)) throw new Error("Invalid booking date.");

  const config = officeConfig();
  const day = calendarDay(date);
  if (day === 0 || day === 6) return [];

  const startOfDay = sgInstant(date, config.open);
  const endOfDay = sgInstant(date, config.close);
  const nowWithNotice = Date.now() + config.minNoticeHours * 60 * 60 * 1000;
  const todaySg = singaporeDateFromInstant(new Date());
  const horizonEnd = new Date(Date.now() + config.horizonDays * 24 * 60 * 60 * 1000);
  const horizonSg = singaporeDateFromInstant(horizonEnd);

  if (date < todaySg || date > horizonSg) return [];

  const busy = await getBusyPeriods(startOfDay.toISOString(), endOfDay.toISOString());
  const busyMillis = busy.map((period) => ({
    start: new Date(period.start).getTime(),
    end: new Date(period.end).getTime()
  }));

  const slots: BookingSlot[] = [];
  for (
    let minute = config.open;
    minute + config.duration <= config.close;
    minute += config.step
  ) {
    const start = sgInstant(date, minute);
    const end = new Date(start.getTime() + config.duration * 60_000);
    if (start.getTime() < nowWithNotice) continue;

    const blocked = busyMillis.some((period) =>
      overlaps(
        start.getTime(),
        end.getTime(),
        period.start,
        period.end,
        config.buffer
      )
    );
    if (!blocked) {
      slots.push({ start: start.toISOString(), end: end.toISOString() });
    }
  }

  return slots;
}

export async function validateRequestedSlot(startIso: string): Promise<BookingSlot | null> {
  const start = new Date(startIso);
  if (Number.isNaN(start.getTime())) return null;

  const config = officeConfig();
  const date = singaporeDateFromInstant(start);
  const minute = singaporeMinutesFromInstant(start);
  const day = calendarDay(date);

  if (day === 0 || day === 6) return null;
  if (minute < config.open || minute + config.duration > config.close) return null;
  if ((minute - config.open) % config.step !== 0) return null;

  const slots = await availableSlotsForDate(date);
  return slots.find((slot) => slot.start === start.toISOString()) || null;
}

export async function createGoogleCalendarBooking(
  session: SessionPayload,
  slot: BookingSlot
): Promise<{ eventId: string; htmlLink?: string; meetLink?: string }> {
  const token = await getGoogleAccessToken();
  const calendarId = bookingCalendarId();

  // Deterministic event ID makes simultaneous attempts for the same start time collide at Google.
  const eventId = createHash("sha256")
    .update(`${calendarId}|${slot.start}`)
    .digest("hex")
    .slice(0, 32);

  const description = [
    "Booked via omnexagoc.com/connect",
    "",
    `Organisation: ${session.company}`,
    `Role: ${session.jobTitle}`,
    session.phone ? `Phone: ${session.phone}` : "",
    session.focus ? `Focus: ${session.focus}` : ""
  ]
    .filter(Boolean)
    .join("\n");

  const body = {
    id: eventId,
    summary: `OMNeXa introductory conversation — ${session.name}`,
    description,
    start: { dateTime: slot.start, timeZone: BOOKING_TIME_ZONE },
    end: { dateTime: slot.end, timeZone: BOOKING_TIME_ZONE },
    attendees: [{ email: session.email, displayName: session.name }],
    conferenceData: {
      createRequest: {
        requestId: randomUUID().replace(/-/g, ""),
        conferenceSolutionKey: { type: "hangoutsMeet" }
      }
    },
    extendedProperties: {
      private: {
        source: "omnexa-connect",
        bookingNonce: session.nonce
      }
    }
  };

  const url =
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events` +
    "?conferenceDataVersion=1&sendUpdates=all";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json"
    },
    body: JSON.stringify(body),
    cache: "no-store"
  });

  if (response.status === 409) {
    throw new Error("SLOT_TAKEN");
  }

  if (!response.ok) {
    const detail = await response.text();
    console.error("Google Calendar event creation failed", {
      status: response.status,
      detail: detail.slice(0, 500)
    });
    throw new Error(`Google Calendar booking failed (${response.status}).`);
  }

  const event = (await response.json()) as {
    id?: string;
    htmlLink?: string;
    hangoutLink?: string;
    conferenceData?: {
      entryPoints?: Array<{ entryPointType?: string; uri?: string }>;
    };
  };

  const meetLink =
    event.hangoutLink ||
    event.conferenceData?.entryPoints?.find((entry) => entry.entryPointType === "video")?.uri;

  return {
    eventId: event.id || eventId,
    htmlLink: event.htmlLink,
    meetLink
  };
}
