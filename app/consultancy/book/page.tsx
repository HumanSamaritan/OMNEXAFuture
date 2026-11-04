import { ConsultancyCurrency, ConsultancyPrice } from "@/components/ConsultancyCurrency";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BookingGate from "@/components/BookingGate";
import { findConsultancyService, discoveryBookingUrl, consultancyContact } from "@/lib/consultancy";
import "../consultancy.css";

export const metadata: Metadata = {
  title: "Book OMNeXa Consultancy | Free 15-minute Discovery Call",
  description: "Book a free 15-minute consultancy introduction with Dhiraj Kumar. Choose a fixed-price service after the discussion; payment instructions are shared separately.",
  alternates: { canonical: "https://www.omnexagoc.com/consultancy/book" },
  robots: { index: false, follow: true }
};
export const dynamic = "force-dynamic";

export default async function ConsultancyBookingPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service: id = "discovery" } = await searchParams;
  const session = findConsultancyService(id);
  if (id !== "discovery" && !session) notFound();
  return <main className="consultancy-page">
    <section className="section-shell aligned-section consultancy-booking">
      <a href="/consultancy">← All consultancy services</a>
      <p className="eyebrow">Work directly with OMNeXa</p>
      <h1>{session?.title || "A clear next step starts with a conversation."}</h1>
      {session ? <ConsultancyCurrency>
        <p>{session.summary}</p>
        <p><strong>{session.minutes} minutes · Fixed fee: <ConsultancyPrice cents={session.priceCents} base={session.currency} /></strong> · Online, with Dhiraj Kumar</p>
        <h2>What you will leave with</h2><ul>{session.outcomes.map(outcome => <li key={outcome}>{outcome}</li>)}</ul>
        <p>{session.scope}</p>
        <h2>First, let's discuss your requirements</h2>
        <p>Book a complimentary 15-minute exploratory call. We confirm the right session, answer scope questions and explain next steps. Published service fees are fixed and non-negotiable. If you choose to proceed, we will share official payment instructions separately. No payment is required for this introductory call.</p>
        <div className="hero-actions"><a className="button primary" href={discoveryBookingUrl}>Book a free consultation</a><a className="button secondary" href={`mailto:${consultancyContact}?subject=${encodeURIComponent(`OMNeXa consultancy: ${session.title}`)}`}>Enquire by email</a></div>
        <p className="consultancy-note">Payment options may include Stripe, Revolut, Razorpay (where supported) or verified direct bank transfer. We will confirm the appropriate method and final payable currency in writing. Do not send funds before receiving official instructions.</p>
      </ConsultancyCurrency> : <>
        <p className="discovery-lead">A complimentary 15-minute exploratory consultation to understand your challenge, identify a suitable fixed-fee service and discuss next steps. There is no payment or obligation to proceed.</p>
        <div className="discovery-layout">
          <aside className="discovery-intro" aria-label="Your consultant and session details">
            <Image src="/dhiraj-founder.png" width={100} height={100} alt="Dhiraj Kumar, Founder and CEO of OMNeXa" className="discovery-portrait" />
            <p className="eyebrow">Your consultant</p><h2>Dhiraj Kumar</h2><p>Founder &amp; CEO · OMNeXa Pte. Ltd., Singapore</p>
            <p>Banking, financial crime, risk and transformation experience, combined with hands-on work building OMNeXa’s AI products.</p>
            <ul className="discovery-facts"><li><strong>15 minutes</strong><span>Private online introduction</span></li><li><strong>Complimentary</strong><span>No payment or automatic follow-up</span></li><li><strong>Google Meet</strong><span>Invitation delivered to your email</span></li><li><strong>Flexible timing</strong><span>Change an upcoming appointment using your private link</span></li></ul>
            <p className="consultancy-note">One free introduction per person across all segments. The advertised session fees are fixed. Detailed advice, training and product demonstrations are separately booked and paid for only if you choose to proceed.</p>
            <a href="mailto:dhiraj.kumar@omnexagoc.com">Prefer to write? Contact Dhiraj →</a>
          </aside>
          <BookingGate recaptchaSiteKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""} consultancyDiscovery />
        </div>
      </>}
    </section>
  </main>;
}
