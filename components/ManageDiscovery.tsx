"use client";
import { useCallback, useEffect, useState } from "react";
import styles from "./BookingGate.module.css";
type Booking = { start: string; end: string; meetLink?: string; completed: boolean };
type Slot = { start: string; end: string };
const format = (value: string, zone: string) => new Intl.DateTimeFormat("en-GB", { timeZone: zone, weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));
export default function ManageDiscovery() {
  const [token, setToken] = useState(""); const [booking, setBooking] = useState<Booking | null>(null);
  const [date, setDate] = useState(""); const [slots, setSlots] = useState<Slot[]>([]); const [selected, setSelected] = useState("");
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false); const [updated, setUpdated] = useState(false);
  const [zone, setZone] = useState("Asia/Singapore");
  useEffect(() => { setToken(window.location.hash.slice(1)); setZone(Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Singapore"); }, []);
  const load = useCallback(async (access: string) => {
    setBusy(true); setError("");
    try { const response = await fetch("/api/booking/manage", { headers: { authorization: `Bearer ${access}` }, cache: "no-store" }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setBooking(data); }
    catch (error) { setError(error instanceof Error ? error.message : "Unable to load appointment."); }
    finally { setBusy(false); }
  }, []);
  useEffect(() => { if (token) void load(token); }, [token, load]);
  useEffect(() => {
    if (!date || !token) return; const controller = new AbortController(); setBusy(true); setError(""); setSlots([]); setSelected("");
    fetch(`/api/booking/manage?date=${date}`, { headers: { authorization: `Bearer ${token}` }, cache: "no-store", signal: controller.signal })
      .then(async response => { const data = await response.json(); if (!response.ok) throw new Error(data.error); setSlots(data.slots || []); })
      .catch(error => { if (error.name !== "AbortError") setError(error.message); }).finally(() => { if (!controller.signal.aborted) setBusy(false); });
    return () => controller.abort();
  }, [date, token]);
  async function reschedule() {
    setBusy(true); setError("");
    try { const response = await fetch("/api/booking/manage", { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${token}` }, body: JSON.stringify({ start: selected }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setBooking({ ...data, completed: false }); setUpdated(true); setSlots([]); setDate(""); }
    catch (error) { setError(error instanceof Error ? error.message : "Unable to update appointment."); }
    finally { setBusy(false); }
  }
  return <div className={styles.card}>
    <p className={styles.kicker}>Your discovery appointment</p>
    <h2>{updated ? "Your new time is confirmed." : "Plans change. Your booking can too."}</h2>
    <p>Keep this private link. You can return to it to change your upcoming appointment without booking another discovery call.</p>
    {!token ? <p>Open the complete management link from your original calendar invitation. For help, contact <a href="mailto:dhiraj.kumar@omnexagoc.com">dhiraj.kumar@omnexagoc.com</a>.</p> : null}
    {error ? <p className={styles.errorBox} role="alert">{error}</p> : null}
    {booking ? <>
      <div className={styles.confirmationPanel}><span>15 minutes · Google Meet</span><strong>{format(booking.start, zone)}</strong><small>Your time zone: {zone}</small></div>
      {booking.completed ? <p>This appointment has started or has already taken place. For further consultancy, contact dhiraj.kumar@omnexagoc.com.</p> : <>
        <label className={styles.copy}>Choose another date (Singapore calendar date)<input type="date" value={date} onChange={event => { setDate(event.target.value); setUpdated(false); }} /></label>
        <p>Available times below are displayed in {zone}. Your existing appointment stays in place until a replacement is confirmed.</p>
        <div className={styles.slotGrid}>{slots.map(slot => <button type="button" disabled={busy} key={slot.start} className={selected === slot.start ? styles.slotSelected : styles.slotButton} onClick={() => setSelected(slot.start)}>{format(slot.start, zone)}</button>)}</div>
        {!busy && date && !slots.length ? <p>No available times on this date. Please choose another weekday.</p> : null}
        {selected ? <div className={styles.reviewPanel}><p>New time: <strong>{format(selected, zone)}</strong></p><button type="button" className={styles.confirmButton} disabled={busy} onClick={() => void reschedule()}>{busy ? "Updating…" : "Confirm new time"}</button></div> : null}
        {booking.meetLink ? <a className={styles.secondaryAction} href={booking.meetLink} target="_blank" rel="noopener noreferrer">Your Google Meet link ↗</a> : null}
      </>}
    </> : busy ? <p role="status">Loading your appointment…</p> : token ? <button className={styles.secondaryAction} onClick={() => void load(token)}>Retry</button> : null}
    {updated ? <p role="status">The calendar invitation has been updated. Your original management link continues to work.</p> : null}
    <p className={styles.privacyNote}>Need a different arrangement? <a href="mailto:dhiraj.kumar@omnexagoc.com">Contact Dhiraj</a>. Please keep this link private.</p>
  </div>;
}
