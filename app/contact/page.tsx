import ContactForm from "@/components/ContactForm";
import { faqs } from "@/lib/site-data";

export default function ContactPage() {
  return (
    <main>
      <section className="page-hero section-shell aligned-section">
        <p className="eyebrow">Contact</p>
        <h1>Start with the problem. Build the right conversation.</h1>
        <p>
          Share what you are trying to achieve across AI, technology transformation, banking, risk and controls,
          education, sustainability or leadership. OMNeXa will use the context to identify the most relevant next step.
        </p>
      </section>

      <section className="section-shell contact-grid aligned-section">
        <div className="contact-copy">
          <div className="contact-card">
            <strong>Email</strong>
            <a href="mailto:dhiraj.kumar@omnexagoc.com">dhiraj.kumar@omnexagoc.com</a>
          </div>
          <div className="contact-card">
            <strong>WhatsApp</strong>
            <span>+65 9067 1304</span>
            <p>Use the WhatsApp button on this page. A short intake form will prepare your message before WhatsApp opens.</p>
          </div>
          <div className="faq-list">
            {faqs.map((faq) => (
              <article key={faq.question}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
        <ContactForm />
      </section>
    </main>
  );
}
