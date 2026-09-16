import ContactForm from "@/components/ContactForm";
import { faqs } from "@/lib/site-data";

export default function ContactPage() {
  return (
    <main>
      <section className="page-hero section-shell aligned-section">
        <p className="eyebrow">Contact</p>
        <h1>Let&apos;s connect.</h1>
        <p>Book a call, email or WhatsApp.</p>
        <div className="hero-actions">
          <a className="button primary" href="/connect">Book a 30-minute call</a>
        </div>
      </section>

      <section className="section-shell contact-grid aligned-section">
        <div className="contact-copy">
          <div className="contact-card">
            <strong>📅 Book a call</strong>
            <p>Choose a free 30-minute slot.</p>
            <a href="/connect">See available times →</a>
          </div>
          <div className="contact-card">
            <strong>✉️ Email</strong>
            <a href="mailto:dhiraj.kumar@omnexagoc.com">dhiraj.kumar@omnexagoc.com</a>
          </div>
          <div className="contact-card">
            <strong>💬 WhatsApp</strong>
            <span>+65 9067 1304</span>
          </div>

          <div className="faq-list">
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
        <ContactForm />
      </section>
    </main>
  );
}
