import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact | OMNeXa - Get in Touch",
  description: "Get in touch with OMNeXa for advisory, speaking, workshops, or transformation programs"
};

export default function ContactPage() {
  return (
    <main>
      <div className="page-hero section-shell">
        <div>
          <p className="eyebrow">Let's Connect</p>
          <h1>Build Future-Ready Ecosystems Together</h1>
          <p className="hero-copy">
            Whether you're looking for advisory, speaking engagements, workshops, mentoring, ecosystem
            collaboration or integrated transformation programs, we're here to help.
          </p>
        </div>
      </div>

      <section className="contact-section full-width">
        <div className="section-shell contact-grid">
          <div>
            <p className="eyebrow">Get In Touch</p>
            <h2>Let's discuss your needs</h2>
            <p>
              Fill out the form or reach out directly. We typically respond within 24-48 hours.
            </p>

            <div className="contact-methods">
              <div className="contact-card">
                <strong>Email</strong>
                <a href="mailto:dhiraj.kumar@omnexagoc.com">dhiraj.kumar@omnexagoc.com</a>
              </div>

              <div className="contact-card">
                <strong>Location</strong>
                <p>Singapore-based, serving APAC and EMEA regions</p>
              </div>

              <div className="contact-card">
                <strong>Response Time</strong>
                <p>24-48 hours during business days</p>
              </div>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>

      <section className="faq-section section-shell">
        <div className="section-heading centered">
          <p className="eyebrow">Common Questions</p>
          <h2>What We Do & How We Work</h2>
        </div>

        <div className="faq-grid">
          <div className="faq-item">
            <h4>What industries do you serve?</h4>
            <p>
              We work across financial services, corporates, educational institutions, non-profits,
              startups and government organizations across APAC and EMEA.
            </p>
          </div>

          <div className="faq-item">
            <h4>What's your engagement model?</h4>
            <p>
              We follow a "start small, prove value, then scale" approach. Typically: discovery → design
              → pilot → integration → scaling.
            </p>
          </div>

          <div className="faq-item">
            <h4>Do you offer fractional advisory?</h4>
            <p>
              Yes. We provide fractional CRO support, compliance advisory, and ESG advisory on part-time
              or project-based arrangements.
            </p>
          </div>

          <div className="faq-item">
            <h4>Can you conduct workshops for our team?</h4>
            <p>
              Absolutely. We design custom workshops on AI readiness, ESG alignment, well-being,
              leadership and transformation topics.
            </p>
          </div>

          <div className="faq-item">
            <h4>What's the typical project duration?</h4>
            <p>
              Projects range from 1-day workshops to 6-12 month transformation programs. We customize
              timelines based on your needs.
            </p>
          </div>

          <div className="faq-item">
            <h4>How do you measure success?</h4>
            <p>
              We define clear KPIs upfront: compliance metrics, employee engagement, sustainability impact,
              skill readiness, and business outcomes.
            </p>
          </div>
        </div>
      </section>

      <footer>
        <p>© {new Date().getFullYear()} OMNeXa Pte. Ltd. All rights reserved.</p>
        <p>Where Consciousness Meets Intelligence</p>
      </footer>
    </main>
  );
}