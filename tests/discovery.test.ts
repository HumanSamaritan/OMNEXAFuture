import { test } from "node:test";
import assert from "node:assert/strict";
import { matchesDiscovery, normaliseEmail, normalisePhone, manageToken, readManageToken, assertDiscoveryEligible, withCalendarLock } from "../lib/discovery";
import { POST as reschedule } from "../app/api/booking/manage/route";
process.env.BOOKING_SESSION_SECRET = "local-test-only-not-a-real-booking-secret-123456";
process.env.GOOGLE_CALENDAR_CLIENT_ID = "local-test";
process.env.GOOGLE_CALENDAR_CLIENT_SECRET = "local-test";
process.env.GOOGLE_CALENDAR_REFRESH_TOKEN = "local-test";
process.env.OMNEXA_BOOKING_CALENDAR_ID = "primary";
process.env.BOOKING_MIN_NOTICE_HOURS = "0";
const identity = { name: "Test", email: "test.person+one@gmail.com", phone: "+65 8123 4567", company: "Same Company", jobTitle: "Test", focus: "Test only" };
const event = { id: "abcdef12345", etag: '"version1"', summary: "OMNeXa free 15-minute discovery call — Test", attendees: [{ email: "testperson@gmail.com" }], description: "Phone: +6581234567", extendedProperties: { private: { consultancyService: "discovery" } } };
test("email aliases and international phone formatting normalise consistently", () => {
  assert.equal(normaliseEmail(identity.email), "testperson@gmail.com");
  assert.equal(normaliseEmail("TEST.PERSON@googlemail.com"), "testperson@gmail.com");
  assert.equal(normalisePhone("0065 (8123) 4567"), "+6581234567");
});
test("either email or phone matches; company alone does not block colleagues", () => {
  assert.ok(matchesDiscovery(event, { ...identity, phone: "+6589999999" }));
  assert.ok(matchesDiscovery(event, { ...identity, email: "someone@example.com" }));
  assert.equal(matchesDiscovery(event, { ...identity, email: "other@example.com", phone: "+6589999999" }), false);
  assert.equal(matchesDiscovery({ ...event, status: "cancelled" }, identity), false);
});
test("manage capability is signed, scoped, expiring and does not contain contact details", () => {
  const token = manageToken(event.id, Date.now() + 60000);
  assert.equal(readManageToken(token)?.eventId, event.id);
  assert.equal(readManageToken(token + "x"), null);
  assert.equal(readManageToken(manageToken(event.id, Date.now() - 1)), null);
  assert.equal(token.includes(identity.email), false);
});
test("repeat history checks are server-side and fail closed on provider errors", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async (input) => String(input).includes("oauth2") ? Response.json({ access_token: "fake-local-token", expires_in: 3600 }) : Response.json({ items: [event] });
  try { await assert.rejects(assertDiscoveryEligible(identity), /DISCOVERY_USED/); globalThis.fetch = async () => new Response("", { status: 503 }); await assert.rejects(assertDiscoveryEligible(identity), /ELIGIBILITY_UNAVAILABLE/); }
  finally { globalThis.fetch = original; }
});
test("competing requests cannot enter a busy calendar write lease", async () => {
  const original = globalThis.fetch; let entered = false;
  globalThis.fetch = async () => Response.json({ ...event, extendedProperties: { private: { lease: String(Date.now() + 60000) } } });
  try { await assert.rejects(withCalendarLock(async () => { entered = true; }), /BOOKING_BUSY/); assert.equal(entered, false); }
  finally { globalThis.fetch = original; }
});
test("rescheduling updates the existing event, keeps its capability and sends invitation updates", async () => {
  const original = globalThis.fetch; const requests: { url: string; method: string; body: unknown }[] = [];
  let day = new Date(Date.now() + 3 * 86400000); while ([0,6].includes(day.getUTCDay())) day = new Date(day.getTime() + 86400000);
  const date = day.toISOString().slice(0, 10); const start = `${date}T01:00:00.000Z`; const end = `${date}T01:15:00.000Z`;
  const current = { ...event, start: { dateTime: `${date}T03:00:00.000Z` }, end: { dateTime: `${date}T03:15:00.000Z` } };
  globalThis.fetch = async (input, init) => {
    const url = String(input); const method = init?.method || "GET"; requests.push({ url, method, body: init?.body ? JSON.parse(String(init.body)) : null });
    if (url.includes("freeBusy")) return Response.json({ calendars: { primary: { busy: [] } } });
    if (url.includes("0a0b0c0d")) return Response.json({ id: "0a0b0c0d000000000000000000000001", etag: '"lock"', extendedProperties: { private: { lease: "0" } } });
    return Response.json(current);
  };
  const token = manageToken(event.id, Date.now() + 600000);
  try {
    const response = await reschedule(new Request("https://www.omnexagoc.com/api/booking/manage", { method: "POST", headers: { authorization: `Bearer ${token}`, "content-type": "application/json" }, body: JSON.stringify({ start }) }));
    assert.equal(response.status, 200); const data = await response.json(); assert.equal(data.start, start); assert.equal(data.end, end);
    const patch = requests.find(r => r.url.includes(event.id) && r.method === "PATCH"); assert.ok(patch?.url.includes("sendUpdates=all")); assert.equal(requests.some(r => r.method === "POST" && !r.url.includes("freeBusy")), false); assert.equal(readManageToken(token)?.eventId, event.id);
  } finally { globalThis.fetch = original; }
});
test("invalid rescheduling links cannot acquire the calendar lock", async () => {
  const response = await reschedule(new Request("https://www.omnexagoc.com/api/booking/manage", { method: "POST", headers: { authorization: "Bearer forged" }, body: "{}" }));
  assert.equal(response.status, 401);
});
