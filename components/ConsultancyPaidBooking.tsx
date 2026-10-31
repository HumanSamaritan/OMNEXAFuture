"use client";
import { useCallback, useEffect, useState } from "react";
type Slot = { start: string; end: string };
type Booking = Slot & { status: "pending" | "confirmed"; meetLink?: string };
type Order = { service: string; minutes: number; email: string; booking?: Booking };
const format = (date: string) => new Intl.DateTimeFormat("en-SG", { timeZone: "Asia/Singapore", dateStyle: "medium", timeStyle: "short" }).format(new Date(date));
export default function ConsultancyPaidBooking({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [date, setDate] = useState(""); const [slots, setSlots] = useState<Slot[]>([]);
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const base = `order=${encodeURIComponent(orderId)}`;
  const loadOrder = useCallback(async () => {
    setBusy(true); setError("");
    try {
      const response = await fetch(`/api/consultancy/order?order=${encodeURIComponent(orderId)}`, { cache: "no-store" });
      const data = await response.json(); if (!response.ok) throw new Error(data.error); setOrder(data);
    } catch (error) { setError(error instanceof Error ? error.message : "Unable to verify payment."); }
    finally { setBusy(false); }
  }, [orderId]);
  useEffect(() => { void loadOrder(); }, [loadOrder]);
  useEffect(() => {
    if (!date || !order || order.booking) return;
    const controller = new AbortController();
    setSlots([]); setError(""); setBusy(true);
    fetch(`/api/consultancy/availability?${base}&date=${encodeURIComponent(date)}`, { cache: "no-store", signal: controller.signal })
      .then(async response => { const data = await response.json(); if (!response.ok) throw new Error(data.error); setSlots(data.slots); })
      .catch(error => { if (error.name !== "AbortError") setError(error.message); })
      .finally(() => { if (!controller.signal.aborted) setBusy(false); });
    return () => controller.abort();
  }, [date, base, order]);
  async function book(start: string) {
    setBusy(true); setError("");
    try {
      const response = await fetch(`/api/consultancy/book?${base}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ start }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error);
      setOrder(current => current ? { ...current, booking: data.booking } : current);
    } catch (error) { setError(error instanceof Error ? error.message : "Unable to confirm your appointment."); }
    finally { setBusy(false); }
  }
  return <div className="consultancy-form" aria-live="polite">
    {error ? <p className="consultancy-error" role="alert">{error}</p> : null}
    {!order ? <><p>{busy ? "Verifying your payment with Stripe…" : "No appointment has been confirmed."}</p><button className="button secondary" disabled={busy} onClick={() => void loadOrder()}>Check payment again</button></> : <>
      <h2>{order.service}</h2><p>Payment verified · {order.minutes} minutes · Google Meet · All times shown in Singapore time (UTC+8).</p>
      {order.booking?.status === "confirmed" ? <><h3>Your session is confirmed</h3><p>{format(order.booking.start)}. Your calendar invitation is sent to {order.email}.</p>{order.booking.meetLink ? <a href={order.booking.meetLink} target="_blank" rel="noopener noreferrer">Join Google Meet</a> : <p>The Google Meet link will appear in the calendar invitation.</p>}</> : order.booking ? <><p>We are confirming {format(order.booking.start)}. Please retry this appointment; do not pay again.</p><button disabled={busy} className="button primary" onClick={() => void book(order.booking!.start)}>Retry confirmation</button></> : <>
        <label>Choose a date<input type="date" value={date} onChange={event => setDate(event.target.value)} /></label>
        {busy ? <p>Checking availability…</p> : date && !slots.length ? <p>No times available on this date. Try another weekday, or contact OMNeXa to arrange a suitable time.</p> : null}
        <div className="consultancy-slots">{slots.map(slot => <button key={slot.start} className="button secondary" disabled={busy} onClick={() => void book(slot.start)}>Confirm {format(slot.start)}</button>)}</div>
      </>}
    </>}
    <p>Need help, a different time, or lost access? Email <a href="mailto:dhiraj.kumar@omnexagoc.com">dhiraj.kumar@omnexagoc.com</a> with your Stripe receipt. Never send card details.</p>
  </div>;
}
