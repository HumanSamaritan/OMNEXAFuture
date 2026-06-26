import ContactForm from "@/components/ContactForm";
import { engagementSteps, navItems, pillars, services, stats, testimonials } from "@/lib/site-data";

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="OMNeXa home">
          <span className="brand-mark">OX</span>
          <span>
            <strong>OMNeXa</strong>
            <small>Where Consciousness Meets Intelligence</small>
          </span>
        </a>

        <nav aria-label="Main navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </header>

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
            <a className="button primary" href="#contact">
              Start a conversation
            </a>
            <a className="button secondary" href="#services">
              Explore services
            </a>
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

      <section className="section-shell" id="services">
        <div className="section-heading centered">
          <p className="eyebrow">Services</p>
          <h2>Six integrated pillars, one implementation mindset.</h2>
          <p>
            Each pillar can stand alone. The strongest value comes when OMNeXa integrates them into
            an ecosystem collaboration model for companies, institutions and communities.
          </p>
        </div>

        <div className="pillar-grid">
          {pillars.map((pillar, index) => (
            <article className="pillar-card" key={pillar.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{pillar.title}</h3>
              <p>{pillar.description}</p>
            </article>
          ))}
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

      <section className="future-panel" id="future">
        <div className="section-shell future-grid">
          <div>
            <p className="eyebrow">Human + AI future readiness</p>
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

      <section className="section-shell" id="model">
        <div className="section-heading centered">
          <p className="eyebrow">Engagement model</p>
          <h2>Start small, prove value, then scale.</h2>
        </div>

        <div className="timeline">
          {engagementSteps.map((step, index) => (
            <div key={step}>
              <span>{index + 1}</span>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell about" id="about">
        <div className="about-card">
          <div className="founder-badge">DK</div>
          <div>
            <p className="eyebrow">Founder profile</p>
            <h2>About Dhiraj Kumar</h2>
            <p>
              Dhiraj Kumar is Founder / Advisor at OMNeXa Pte. Ltd., bringing together financial-crime
              execution depth, sustainability thinking, AI-era readiness and human-centered leadership.
              His experience spans AML/KYC, sanctions, governance, control design, remediation,
              regulatory exam support, technology and workflow transformation, ESG engagement,
              education mentoring and ecosystem collaboration.
            </p>
          </div>
        </div>
      </section>

      <section className="section-shell" id="testimonials">
        <div className="section-heading centered">
          <p className="eyebrow">Client feedback</p>
          <h2>Practical guidance, future-focused outcomes.</h2>
        </div>

        <div className="testimonial-grid">
          {testimonials.map((testimonial) => (
            <figure key={testimonial.quote}>
              <blockquote>“{testimonial.quote}”</blockquote>
              <figcaption>{testimonial.author}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="section-shell contact-grid">
          <div>
            <p className="eyebrow">Contact us</p>
            <h2>Let’s build future-ready ecosystems.</h2>
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
