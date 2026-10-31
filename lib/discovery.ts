import { createHmac, randomUUID, timingSafeEqual } from "crypto";
import { bookingCalendarId, getGoogleAccessToken, type BookingIdentity } from "./booking";
export const DISCOVERY_USED = "A free discovery call is already booked or has been used with these contact details. Please use your original booking link to change an upcoming appointment, or contact dhiraj.kumar@omnexagoc.com for assistance.";
export function normalisePhone(value: string) { return value.trim().replace(/^00/, "+").replace(/[\s().-]/g, ""); }
export function normaliseEmail(value: string) {
  let [name, domain] = value.trim().toLowerCase().split("@");
  if (domain === "googlemail.com") domain = "gmail.com";
  if (domain === "gmail.com") name = name.split("+")[0].replace(/\./g, "");
  return `${name}@${domain}`;
}
function secret() { const key = process.env.BOOKING_SESSION_SECRET || ""; if (key.length < 32) throw new Error("BOOKING_SECRET_UNAVAILABLE"); return key; }
export function identityHash(value: string) { return createHmac("sha256", secret()).update(value).digest("hex"); }
export async function calendarRequest(path: string, init: RequestInit = {}) {
  return fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(bookingCalendarId())}/events${path}`, {
    ...init, headers: { authorization: `Bearer ${await getGoogleAccessToken()}`, "content-type": "application/json", ...init.headers }, cache: "no-store", signal: AbortSignal.timeout(12000)
  });
}
export type CalendarEvent = { id: string; etag: string; status?: string; summary?: string; description?: string; start?: { dateTime?: string }; end?: { dateTime?: string }; hangoutLink?: string; attendees?: { email?: string }[]; extendedProperties?: { private?: Record<string, string> } };
export function matchesDiscovery(event: CalendarEvent, identity: BookingIdentity) {
  const props = event.extendedProperties?.private || {};
  const isDiscovery = props.consultancyService === "discovery" || event.summary?.includes("free 15-minute discovery call");
  if (!isDiscovery || event.status === "cancelled") return false;
  const phone = normalisePhone(identity.phone);
  const eventPhone = normalisePhone(event.description?.match(/(?:^|\n)Phone: ([^\n]+)/)?.[1] || "");
  return props.discoveryEmail === identityHash(normaliseEmail(identity.email)) ||
    event.attendees?.some(a => a.email && normaliseEmail(a.email) === normaliseEmail(identity.email)) ||
    (!!phone && (props.discoveryPhone === identityHash(phone) || phone === eventPhone));
}
export async function assertDiscoveryEligible(identity: BookingIdentity) {
  // Query private identity metadata too: changing a visible event title must not
  // bypass the allowance. Queries are separate because Google ANDs filters.
  const filters = [`discoveryEmail=${identityHash(normaliseEmail(identity.email))}`];
  if (identity.phone) filters.push(`discoveryPhone=${identityHash(normalisePhone(identity.phone))}`);
  const matches = await Promise.all(filters.map(async filter => {
    const query = new URLSearchParams({ privateExtendedProperty: filter, maxResults: "1", showDeleted: "false" });
    const response = await calendarRequest(`?${query}`);
    if (!response.ok) throw new Error("ELIGIBILITY_UNAVAILABLE");
    const data = await response.json() as { items?: CalendarEvent[] };
    return !!data.items?.length;
  }));
  if (matches.some(Boolean)) throw new Error("DISCOVERY_USED");
  let pageToken = "";
  for (let page = 0; page < 10; page++) {
    const query = new URLSearchParams({ q: "free 15-minute discovery call", maxResults: "2500", showDeleted: "false", ...(pageToken ? { pageToken } : {}) });
    const response = await calendarRequest(`?${query}`);
    if (!response.ok) throw new Error("ELIGIBILITY_UNAVAILABLE");
    const data = await response.json() as { items?: CalendarEvent[]; nextPageToken?: string };
    if (data.items?.some(event => matchesDiscovery(event, identity))) throw new Error("DISCOVERY_USED");
    if (!data.nextPageToken) return;
    pageToken = data.nextPageToken;
  }
  throw new Error("ELIGIBILITY_UNAVAILABLE");
}
// A single private transparent coordination event persists the lock across Vercel
// instances. ETag compare-and-swap prevents concurrent discovery/reschedule writes.
// It has no attendees, reminders or busy time, and carries no customer details.
const lockId = "0a0b0c0d000000000000000000000001";
export async function withCalendarLock<T>(operation: () => Promise<T>): Promise<T> {
  let response = await calendarRequest(`/${lockId}`);
  if (response.status === 404) {
    const inserted = await calendarRequest("?sendUpdates=none", { method: "POST", body: JSON.stringify({ id: lockId, summary: "OMNeXa booking coordination (system record)", description: "Private application coordination record. Does not block availability. Do not delete while online booking is enabled.", visibility: "private", transparency: "transparent", start: { date: "2000-01-01" }, end: { date: "2000-01-02" }, reminders: { useDefault: false }, extendedProperties: { private: { source: "omnexa-booking-lock", lease: "0" } } }) });
    if (!inserted.ok && inserted.status !== 409) throw new Error("LOCK_UNAVAILABLE");
    response = await calendarRequest(`/${lockId}`);
  }
  if (!response.ok) throw new Error("LOCK_UNAVAILABLE");
  const event = await response.json() as CalendarEvent;
  if (Number(event.extendedProperties?.private?.lease || 0) > Date.now()) throw new Error("BOOKING_BUSY");
  const owner = randomUUID();
  const acquired = await calendarRequest(`/${lockId}?sendUpdates=none`, { method: "PATCH", headers: { "If-Match": event.etag }, body: JSON.stringify({ extendedProperties: { private: { source: "omnexa-booking-lock", lease: String(Date.now() + 180000), owner } } }) });
  if (!acquired.ok) throw new Error(acquired.status === 412 ? "BOOKING_BUSY" : "LOCK_UNAVAILABLE");
  const locked = await acquired.json() as CalendarEvent;
  try { return await operation(); }
  finally {
    // An expiry or another writer must never have its lease cleared by this request.
    await calendarRequest(`/${lockId}?sendUpdates=none`, { method: "PATCH", headers: { "If-Match": locked.etag }, body: JSON.stringify({ extendedProperties: { private: { source: "omnexa-booking-lock", lease: "0", owner: "" } } }) }).catch(() => undefined);
  }
}
export function manageToken(eventId: string, expires: number, scope: "discovery-manage" | "paid-manage" = "discovery-manage") {
  const payload = Buffer.from(JSON.stringify({ eventId, expires, scope })).toString("base64url");
  return `${payload}.${createHmac("sha256", secret()).update(payload).digest("base64url")}`;
}
export function readManageToken(token: string): { eventId: string; expires: number; scope: "discovery-manage" | "paid-manage" } | null {
  try {
    const parts = token.split("."); if (parts.length !== 2 || token.length > 1500) return null;
    const actual = Buffer.from(parts[1]); const expected = Buffer.from(createHmac("sha256", secret()).update(parts[0]).digest("base64url"));
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
    const payload = JSON.parse(Buffer.from(parts[0], "base64url").toString());
    if (!(["discovery-manage", "paid-manage"].includes(payload.scope)) || !/^[a-v0-9]{5,1024}$/.test(payload.eventId) || payload.expires <= Date.now()) return null;
    return payload;
  } catch { return null; }
}
export async function readManagedEvent(token: string) {
  const access = readManageToken(token); if (!access) throw new Error("INVALID_LINK");
  const response = await calendarRequest(`/${access.eventId}`);
  if (!response.ok) throw new Error("INVALID_LINK");
  const event = await response.json() as CalendarEvent;
  if (event.status === "cancelled") throw new Error("INVALID_LINK");
  const props = event.extendedProperties?.private;
  if (access.scope === "paid-manage") {
    if (!props?.paymentOrderId || props.bookingNonce !== props.paymentOrderId) throw new Error("INVALID_LINK");
    const { getOrder, verifyOrderPayment } = await import("./consultancy-payments");
    const order = await getOrder(props.paymentOrderId);
    if (!order) throw new Error("INVALID_LINK");
    await verifyOrderPayment(order);
    if ((Date.parse(event.end?.dateTime || "") - Date.parse(event.start?.dateTime || "")) / 60000 !== order.minutes) throw new Error("INVALID_LINK");
  } else if (props?.consultancyService !== "discovery" || props.paymentOrderId) throw new Error("INVALID_LINK");
  return event;
}
export function discoveryError(error: unknown) {
  const code = error instanceof Error ? error.message : "";
  if (code === "DISCOVERY_USED") return { status: 409, error: DISCOVERY_USED };
  if (code === "BOOKING_BUSY") return { status: 409, error: "Another appointment is being confirmed. Please try again in a moment." };
  if (code === "INVALID_LINK") return { status: 401, error: "This booking link is invalid or expired. Contact dhiraj.kumar@omnexagoc.com for help." };
  return null;
}
