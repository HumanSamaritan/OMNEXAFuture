import type { Metadata } from "next";
import BookingGate from "@/components/BookingGate";

export const metadata: Metadata = {
  title: "Book an Introductory Call | OMNeXa",
  description:
    "Book an introductory discussion with Dhiraj Kumar to explore OMNeXa's vision, products, partnerships and transformation initiatives.",
  alternates: { canonical: "/connect" }
};

const bookingUrl = process.env.NEXT_PUBLIC_OMNEXA_BOOKING_URL || "";

export default function ConnectPage() {
  return (
    <main>
      <section className="page-hero section-shell aligned-section">
        <p className="eyebrow">Connect with OMNeXa</p>
        <h1>Book an introductory conversation with Dhiraj Kumar.</h1>
        <p>
          Use this page for an initial discussion on OMNeXa's vision, products, collaboration opportunities,
          responsible AI, human-centred transformation, education, risk, governance or related initiatives.
        </p>
      </section>

      <section className="section-shell contact-grid aligned-section">
        <div className="contact-copy">
          <div className="contact-card">
            <strong>How scheduling works</strong>
            <p>
              The booking destination shows available appointment times only. Existing calendar event titles,
              attendees and private activity details are not displayed to visitors.
            </p>
          </div>
          <div className="contact-card">
            <strong>Default introductory format</strong>
            <p>30-minute introductory discussion. Availability is managed in Singapore Time (SGT).</p>
          </div>
          <div className="contact-card">
            <strong>Privacy by design</strong>
            <p>
              OMNeXa does not collect booking identity data on this landing page. Scheduling data is entered only
              after you continue to the Google-hosted booking experience.
            </p>
          </div>
        </div>

        <BookingGate bookingUrl={bookingUrl} />
      </section>
    </main>
  );
}
