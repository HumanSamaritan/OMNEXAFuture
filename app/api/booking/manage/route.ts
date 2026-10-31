import { NextResponse } from "next/server";
import { availableSlotsForDate, getClientKey, rateLimited, sameOriginRequest, validateRequestedSlot } from "@/lib/booking";
import { calendarRequest, discoveryError, readManagedEvent, readManageToken, withCalendarLock } from "@/lib/discovery";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
function token(request: Request) { return (request.headers.get("authorization") || "").replace(/^Bearer /, ""); }
function errorResponse(error: unknown) {
  const known = discoveryError(error);
  return NextResponse.json({ error: known?.error || "We could not update your appointment. Your current booking remains in place. Please retry or contact dhiraj.kumar@omnexagoc.com." }, { status: known?.status || 503, headers: { "Cache-Control": "private, no-store" } });
}
export async function GET(request: Request) {
  try {
    if (rateLimited("manage-read", getClientKey(request), 40)) return NextResponse.json({ error: "Please try again shortly." }, { status: 429 });
    const event = await readManagedEvent(token(request));
    const date = new URL(request.url).searchParams.get("date");
    const completed = Date.parse(event.start?.dateTime || "") <= Date.now();
    const slots = date && !completed ? await availableSlotsForDate(date, 15) : undefined;
    return NextResponse.json({ start: event.start?.dateTime, end: event.end?.dateTime, meetLink: event.hangoutLink, completed, slots }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) { return errorResponse(error); }
}
export async function POST(request: Request) {
  try {
    if (!sameOriginRequest(request)) return NextResponse.json({ error: "Cross-origin request blocked." }, { status: 403 });
    if (rateLimited("manage-write", getClientKey(request), 8)) return NextResponse.json({ error: "Please try again shortly." }, { status: 429 });
    if (!readManageToken(token(request))) throw new Error("INVALID_LINK");
    const raw = await request.text(); if (Buffer.byteLength(raw) > 1024) return NextResponse.json({ error: "Request too large." }, { status: 413 });
    const { start } = JSON.parse(raw);
    const result = await withCalendarLock(async () => {
      const event = await readManagedEvent(token(request));
      if (Date.parse(event.start?.dateTime || "") <= Date.now()) return { finished: true };
      if (start === event.start?.dateTime) return { start, end: event.end?.dateTime, meetLink: event.hangoutLink };
      const slot = await validateRequestedSlot(String(start || ""), 15);
      if (!slot) return { conflict: true };
      const response = await calendarRequest(`/${event.id}?sendUpdates=all`, { method: "PATCH", headers: { "If-Match": event.etag }, body: JSON.stringify({ start: { dateTime: slot.start, timeZone: "Asia/Singapore" }, end: { dateTime: slot.end, timeZone: "Asia/Singapore" } }) });
      if (!response.ok) { if (response.status === 412) return { conflict: true }; throw new Error("CALENDAR_UPDATE_FAILED"); }
      return { start: slot.start, end: slot.end, meetLink: event.hangoutLink };
    });
    if ("finished" in result) return NextResponse.json({ error: "This appointment has started or has already taken place. Contact dhiraj.kumar@omnexagoc.com for further assistance." }, { status: 409 });
    if ("conflict" in result) return NextResponse.json({ error: "That time is no longer available. Your existing booking is unchanged; choose another time." }, { status: 409 });
    return NextResponse.json({ ...result, updated: true }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) { return errorResponse(error); }
}
