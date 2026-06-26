import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact | OMNeXa",
  description: "Get in touch with OMNeXa"
};

export default function ContactPage() {
  return (
    <main>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="section-shell">
          <h1>Get in Touch</h1>
          <p>
            Whether you're looking for advisory, speaking, workshops, mentoring or transformation programs, 
            we're here to help. We typically respond within 24-48 hours.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-main section-shell">
        <div className="contact-layout">
          <div className="contact-info">
            <h2>Contact Information</h2>
            
            <div className="info-block">
              <h4>Email</h4>
              <a href="mailto:dhiraj.kumar@omnexagoc.com" className="contact-link">
                dhiraj.kumar@omnexagoc.com
              </a>
            </div>

            <div className="info-block">
              <h4>Location</h4>
              <p>Singapore-based</p>
              <p>Serving APAC and EMEA regions</p>
            </div>

            <div className="info-block">
              <h4>Response Time</h4>
              <p>24-48 hours during business days</p>
            </div>

            <div className="info-block">
              <h4>What we can help with</h4>
              <ul>
                <li>Advisory and fractional CRO support</li>
                <li>Speaking engagements and keynotes</li>
                <li>Custom workshops and training</li>
                <li>Ecosystem collaboration</li>
                <li>Transformation program design</li>
              </ul>
            </div>
          </div>

          <div className="contact-form-wrapper">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section section-shell">
        <h2>Common Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h4>What industries do you serve?</h4>
            <p>Financial services, corporates, institutions, non-profits, startups and government across APAC and EMEA</p>
          </div>
          <div className="faq-item">
            <h4>What's your engagement model?</h4>
            <p>We follow "start small, prove value, then scale". Engagements range from workshops to 6-12 month programs</p>
          </div>
          <div className="faq-item">
            <h4>Do you offer fractional advisory?</h4>
            <p>Yes. We provide fractional CRO, compliance advisory and ESG advisory on part-time or project basis</p>
          </div>
          <div className="faq-item">
            <h4>How do you measure success?</h4>
            <p>We define clear KPIs upfront: compliance metrics, engagement, impact, skills, and business outcomes</p>
          </div>
        </div>
      </section>
    </main>
  );
}