import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BookingGate from "@/components/BookingGate";
import ConsultancyCheckout from "@/components/ConsultancyCheckout";
import { consultancyContact, consultancySessions, findConsultancyService } from "@/lib/consultancy";
import { paidBookingConfigured, paymentsPublicTerms } from "@/lib/consultancy-payments";
import "../consultancy.css";

export const metadata: Metadata = {
  title: "Book OMNeXa Consultancy | Free 15-minute Discovery Call",
  description: "Book a free 15-minute introduction with Dhiraj Kumar for any OMNeXa consultancy segment, or request a focused paid session.",
  alternates: { canonical: "https://www.omnexagoc.com/consultancy/book" },
  robots: { index: false, follow: true }
};
export const dynamic = "force-dynamic";

export default async function ConsultancyBookingPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service: id = "discovery" } = await searchParams;
  const session = findConsultancyService(id);
  if (id !== "discovery" && !session) notFound();
  const subject = session ? `Consultancy request: ${session.title}` : "OMNeXa consultancy discovery call";
  const body = `Hello Dhiraj,\n\nI would like to discuss ${session?.title || "OMNeXa consultancy"}.\nMy main challenge:\nMy intended outcome:\nMy time zone and preferred dates:\n\nPlease confirm the scope, fee, cancellation terms and official payment instructions before any payment.`;
  return <main className="consultancy-page">
    <section className="section-shell aligned-section consultancy-booking">
      <a href="/consultancy">← All consultancy services</a>
      <p className="eyebrow">Work directly with OMNeXa</p>
      <h1>{session?.title || "Your first step: a free 15-minute discovery call."}</h1>
      {session ? <>
        <p>{session.summary}</p>
        <p><strong>{session.minutes} minutes · USD {session.priceCents / 100}</strong> · Online, with Dhiraj Kumar</p>
        <h2>What you will leave with</h2><ul>{session.outcomes.map(outcome => <li key={outcome}>{outcome}</li>)}</ul>
        <p>{session.scope}</p>
        {paidBookingConfigured() ? <ConsultancyCheckout serviceId={session.id} recaptchaSiteKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""} termsUrl={paymentsPublicTerms()} /> : <>
          <h2>Request this session</h2>
          <p>Online paid checkout is being prepared. Contact OMNeXa to agree the scope, fee, timing and cancellation terms. A paid calendar invitation will be issued only after receipt of payment has been verified.</p>
          <div className="hero-actions"><a className="button primary" href={`mailto:${consultancyContact}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}>Request session by email</a><a className="button secondary" href="/consultancy/book?service=discovery">Book a free 15-minute introduction</a></div>
        </>}
      </> : <>
        <p>Choose any segment: {consultancySessions.map(s => s.title.split(":")[0]).join("; ")}. We will clarify one goal, discuss fit and agree a suitable next step. No payment or obligation.</p>
        <BookingGate recaptchaSiteKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""} consultancyDiscovery />
      </>}
    </section>
  </main>;
}
