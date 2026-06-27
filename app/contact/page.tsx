import ContactForm from "@/components/ContactForm";
import { faqs } from "@/lib/site-data";

export default function ContactPage() {
  return (
    <main>
      <section className="page-hero section-shell">
        <p className="eyebrow">Contact</p>
        <h1>Let us build future-ready ecosystems.</h1>
        <p>
          Use the form to request advisory, speaking, workshops, mentoring, ecosystem collaboration or
          integrated transformation programs.
        </p>
      </section>

      <section className="section-shell contact-grid">
        <div className="contact-copy">
          <div className="contact-card">
            <strong>Email</strong>
            <a href="mailto:dhiraj.kumar@omnexagoc.com">dhiraj.kumar@omnexagoc.com</a>
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
