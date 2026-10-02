import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Website Privacy Notice",
  description:
    "How OMNeXa Pte. Ltd. handles information submitted through omnexagoc.com, including enquiries and meeting bookings.",
  alternates: { canonical: "/privacy" }
};

export default function PrivacyPage() {
  return (
    <main>
      <section className="section-shell page-hero aligned-section">
        <p className="eyebrow">Website privacy</p>
        <h1>Privacy notice.</h1>
        <p>
          This notice explains how OMNeXa Pte. Ltd. handles information submitted through
          omnexagoc.com. It is intended as a practical website notice and should be read together
          with any more specific privacy terms provided for individual OMNeXa products.
        </p>
      </section>

      <section className="section-shell split-section aligned-section">
        <div>
          <p className="eyebrow">Pilot applications</p>
          <h2>Your application and agreement.</h2>
        </div>
        <div className="copy-stack">
          <p>When you apply for a product pilot, OMNeXa receives your contact details, country, role, organisation where relevant, product selection, experience, testing interests and availability. We use these details to assess your request and coordinate pilot participation.</p>
          <p>We verify control of your email address and retain your typed signature, agreement version and acceptance record to evidence the agreement and administer any B2C subscription benefit. Copies are sent to support@omnexagoc.com and your verified email using Resend. Vercel hosts the flow, and Google reCAPTCHA helps prevent abuse; these providers may process data outside your country.</p>
          <p>Please do not provide medical records, financial records, identity documents or confidential employer/client information in the application. Pilot records are kept only while needed for pilot administration, subscription benefits or legal obligations, then deleted or anonymised. No marketing consent is assumed.</p>
          <p>For access, correction, deletion or consent-withdrawal requests relating to a pilot application, email <a href="mailto:support@omnexagoc.com">support@omnexagoc.com</a>. Some agreement records may need to be retained for legal purposes. Preview applications are marked as non-binding tests.</p>
        </div>
      </section>

      <section className="section-shell split-section aligned-section">
        <div>
          <p className="eyebrow">Information we receive</p>
          <h2>Only what is needed for the interaction.</h2>
        </div>
        <div className="copy-stack">
          <p>
            When you contact OMNeXa or request a meeting, we may receive your name, email address,
            organisation, role, phone number, the topic you want to discuss, and the meeting time
            you select.
          </p>
          <p>
            Basic technical and usage information may also be processed to protect the website,
            understand aggregate usage and improve performance.
          </p>
        </div>
      </section>

      <section className="band">
        <div className="section-shell aligned-section">
          <div className="section-heading">
            <p className="eyebrow">How it is used</p>
            <h2>Purpose-limited handling.</h2>
          </div>
          <div className="pillar-grid">
            <article className="pillar-card">
              <span>01</span>
              <h3>Respond</h3>
              <p>To reply to enquiries, arrange meetings and follow up on the discussion requested.</p>
            </article>
            <article className="pillar-card">
              <span>02</span>
              <h3>Protect</h3>
              <p>To prevent spam, abuse and automated misuse of forms and booking functions.</p>
            </article>
            <article className="pillar-card">
              <span>03</span>
              <h3>Improve</h3>
              <p>To understand aggregate website performance and improve the visitor experience.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section-shell split-section aligned-section">
        <div>
          <p className="eyebrow">Service providers</p>
          <h2>Booking and website infrastructure.</h2>
        </div>
        <div className="copy-stack">
          <p>
            The website may use service providers such as Vercel for hosting and website analytics,
            Google reCAPTCHA for human verification, Google Calendar and Google Meet for scheduling,
            and Resend for website email delivery. These providers may process information needed to
            deliver their respective services under their own privacy terms.
          </p>
          <p>
            OMNeXa does not publish your private calendar contents through the booking page. The
            scheduler only exposes meeting times that the booking service determines are available.
          </p>
        </div>
      </section>

      <section className="section-shell split-section aligned-section">
        <div>
          <p className="eyebrow">Questions & requests</p>
          <h2>Contact OMNeXa.</h2>
        </div>
        <div className="copy-stack">
          <p>
            For questions about information submitted through this website, or to request correction
            or deletion where applicable, contact{" "}
            <a href="mailto:dhiraj.kumar@omnexagoc.com">dhiraj.kumar@omnexagoc.com</a>.
          </p>
          <p>Last updated: 2 October 2026.</p>
        </div>
      </section>
    </main>
  );
}
