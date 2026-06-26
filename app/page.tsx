import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import { stats } from "@/lib/site-data";

export default function Home() {
  return (
    <main>
      <section id="top" className="hero section-shell">
        <div className="hero-content">
          <p className="eyebrow">Singapore-based future readiness consultancy</p>
          <h1>Human-centered transformation for an AI-enabled world.</h1>
          <p className="hero-copy">
            OMNeXa prepares people, institutions and organizations for a future shaped by AI,
            sustainability, regulatory pressure and human resilience. We connect risk intelligence,
            sustainability intelligence, AI intelligence, human intelligence and conscious intelligence
            into practical programs that can be implemented.
          </p>

          <div className="hero-actions">
            <Link href="/contact" className="button primary">
              Start a conversation
            </Link>
            <Link href="/services" className="button secondary">
              Explore services
            </Link>
          </div>
        </div>

        <aside className="hero-card" aria-label="OMNeXa proposition">
          <div className="orb" />
          <p className="card-kicker">Core proposition</p>
          <h2>Compliance + Sustainability + AI + Education + Well-being</h2>
          <p>
            A practical bridge for partners who need implementation support, future-ready narratives,
            ecosystem collaboration and values-led transformation.
          </p>
        </aside>
      </section>

      <section className="stats-strip section-shell" aria-label="OMNeXa highlights">
        {stats.map((stat) => (
          <div key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>

      <section className="section-shell split" id="why">
        <div>
          <p className="eyebrow">Why OMNeXa</p>
          <h2>The ecosystem is converging.</h2>
        </div>
        <p className="section-lead">
          AI disruption, regulatory pressure, ESG transition, education gaps, human stress and the
          partnership economy are no longer separate conversations. OMNeXa helps partners integrate
          capability, governance, sustainability and human progress into one practical roadmap.
        </p>
      </section>

      <section className="cta-section section-shell">
        <div className="cta-box">
          <h2>Ready to transform your organization?</h2>
          <p>Explore our comprehensive services and get started with OMNeXa today.</p>
          <div className="cta-buttons">
            <Link href="/services" className="button primary">
              View All Services
            </Link>
            <Link href="/about" className="button secondary">
              Learn About Us
            </Link>
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="section-shell contact-grid">
          <div>
            <p className="eyebrow">Contact us</p>
            <h2>Let's build future-ready ecosystems.</h2>
            <p>
              Use the form to request advisory, speaking, workshops, mentoring, ecosystem collaboration
              or integrated transformation programs.
            </p>
            <div className="contact-card">
              <strong>Email</strong>
              <a href="mailto:dhiraj.kumar@omnexagoc.com">dhiraj.kumar@omnexagoc.com</a>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>

      <footer>
        <p>© {new Date().getFullYear()} OMNeXa Pte. Ltd. All rights reserved.</p>
        <p>Where Consciousness Meets Intelligence</p>
      </footer>
    </main>
  );
}