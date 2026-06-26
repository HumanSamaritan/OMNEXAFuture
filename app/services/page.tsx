import Link from "next/link";
import { pillars, services } from "@/lib/site-data";

export const metadata = {
  title: "Services | OMNeXa - Consultancy Services",
  description: "Explore OMNeXa's comprehensive services across 6 integrated pillars"
};

export default function ServicesPage() {
  return (
    <main>
      <div className="page-hero section-shell">
        <div>
          <p className="eyebrow">Our Expertise</p>
          <h1>Six Integrated Pillars, One Implementation Mindset</h1>
          <p className="hero-copy">
            Each pillar can stand alone. The strongest value comes when OMNeXa integrates them into
            an ecosystem collaboration model for companies, institutions and communities.
          </p>
        </div>
      </div>

      <section className="section-shell" id="pillars">
        <div className="pillar-grid">
          {pillars.map((pillar, index) => (
            <article className="pillar-card" key={pillar.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{pillar.title}</h3>
              <p>{pillar.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell services-details">
        <div className="section-heading centered">
          <p className="eyebrow">Service Offerings</p>
          <h2>Tailored Solutions for Every Need</h2>
        </div>

        <div className="service-stack">
          {services.map((service) => (
            <article className="service-card" key={service.title}>
              <p className="eyebrow">{service.eyebrow}</p>
              <h3>{service.title}</h3>
              <ul>
                {service.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="future-panel">
        <div className="section-shell future-grid">
          <div>
            <p className="eyebrow">Human + AI Future Readiness</p>
            <h2>Technology should amplify human values, not replace human purpose.</h2>
            <p>
              OMNeXa helps partners identify responsible AI use cases, design governance-aware pilots,
              prepare workforces for intelligent systems, and build narratives where humans and machines
              collaborate for education, sustainability, inclusion, health and productivity.
            </p>
          </div>

          <div className="principle-list">
            <div>
              <strong>Responsible intelligence</strong>
              <span>AI adoption with risk, ethics and accountability built in.</span>
            </div>
            <div>
              <strong>Human capability</strong>
              <span>Coaching, mentoring and proof-of-work pathways for people.</span>
            </div>
            <div>
              <strong>Measurable sustainability</strong>
              <span>Culture, behavior and impact metrics beyond awareness.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section section-shell">
        <div className="cta-box">
          <h2>Interested in our services?</h2>
          <p>Get in touch to discuss how OMNeXa can help your organization.</p>
          <Link href="/contact" className="button primary">
            Start a Conversation
          </Link>
        </div>
      </section>

      <footer>
        <p>© {new Date().getFullYear()} OMNeXa Pte. Ltd. All rights reserved.</p>
        <p>Where Consciousness Meets Intelligence</p>
      </footer>
    </main>
  );
}