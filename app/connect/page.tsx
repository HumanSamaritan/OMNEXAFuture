import type { Metadata } from "next";
import BookingGate from "@/components/BookingGate";

export const metadata: Metadata = {
  title: "Book a Call | OMNeXa",
  description: "Choose an available time for a 30-minute introductory conversation with Dhiraj Kumar.",
  alternates: { canonical: "/connect" }
};

const bookingUrl = process.env.NEXT_PUBLIC_OMNEXA_BOOKING_URL || "";

const quickFacts = [
  { icon: "🕒", label: "30 min" },
  { icon: "🌏", label: "Singapore time" },
  { icon: "🎥", label: "Google Meet" },
  { icon: "🔒", label: "Free slots only" }
];

export default function ConnectPage() {
  return (
    <main>
      <section className="page-hero section-shell aligned-section">
        <p className="eyebrow">Meet OMNeXa</p>
        <h1>Choose a time. Let&apos;s talk.</h1>
        <p>Introductory call with Dhiraj Kumar on OMNeXa, products or partnerships.</p>
      </section>

      <section className="section-shell aligned-section">
        <div className="home-focus-grid" aria-label="Meeting details">
          {quickFacts.map((item) => (
            <article key={item.label}>
              <span className="focus-index" aria-hidden="true">{item.icon}</span>
              <h3>{item.label}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell aligned-section">
        <BookingGate bookingUrl={bookingUrl} />
      </section>
    </main>
  );
}
