import type { Metadata } from "next";
import ConsultancyPaidBooking from "@/components/ConsultancyPaidBooking";
import "../consultancy.css";
export const metadata: Metadata = { title: "Your consultancy booking | OMNeXa", robots: { index: false, follow: false } };
export default async function PaidBookingPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order = "" } = await searchParams;
  return <main className="consultancy-page"><section className="section-shell aligned-section consultancy-booking"><a href="/consultancy">← Consultancy services</a><h1>Complete your session booking</h1><p>A payment confirmation is separate from an appointment. Your time is confirmed only when a calendar invitation has been created.</p><ConsultancyPaidBooking orderId={order} /></section></main>;
}
