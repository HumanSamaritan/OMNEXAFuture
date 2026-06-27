import { audienceRoutes, pillars, services, stats, testimonials } from "@/lib/site-data";

export default function Home() {
  return (
    <main>
      <section className="driver-home" aria-label="OMNeXa driver image">
        <img
          src="/omnexa-driver-home.jpg"
          alt="OMNeXa driver visual showing evolution from instinct to humanoids with consciousness and intelligence"
          className="driver-home-image"
        />
      </section>

      <section className="section-shell intro-section">
        <div className="intro-copy">
          <p className="eyebrow">Singapore-based future readiness consultancy</p>
          <h1>Navigate human transformation in an AI-enabled world.</h1>
          <p className="hero-copy">
            OMNeXa helps people, institutions and organizations connect compliance, sustainability,
            AI readiness, education and well-being into practical programs that can be implemented.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="/contact">Start a conversation</a>
            <a className="button secondary" href="/services">Explore services</a>
          </div>
        </div>
      </section>

      <section className="stats-strip section-shell" aria-label="OMNeXa highlights">
        {stats.map((stat) => (
          <div key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>

      <section className="section-shell split-section aligned-section">
        <div>
          <p className="eyebrow">Why OMNeXa</p>
          <h2>The ecosystem is converging.</h2>
        </div>
        <div className="copy-stack">
          <p>
            AI disruption, regulatory pressure, ESG transition, education gaps, human stress and the
            partnership economy are no longer separate conversations.
          </p>
          <p>
            OMNeXa helps partners integrate capability, governance, sustainability and human progress
            into one practical roadmap.
          </p>
        </div>
      </section>

      <section className="band">
        <div className="section-shell aligned-section">
          <div className="section-heading">
            <p className="eyebrow">Who it helps</p>
            <h2>Clear entry points for different audiences.</h2>
          </div>
          <div className="route-list">
            {audienceRoutes.map((route) => <span key={route}>{route}</span>)}
          </div>
        </div>
      </section>

      <section className="section-shell aligned-section">
        <div className="section-heading">
          <p className="eyebrow">Pillars</p>
          <h2>Six pillars, one implementation mindset.</h2>
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
      </section>

      <section className="section-shell preview-section aligned-section">
        <div className="section-heading">
          <p className="eyebrow">Services</p>
          <h2>Advisory, workshops and programs that can start small and scale.</h2>
        </div>
        <div className="service-preview-grid">
          {services.slice(0, 3).map((service) => (
            <article className="service-card" key={service.title}>
              <p className="eyebrow">{service.eyebrow}</p>
              <h3>{service.title}</h3>
              <p>{service.summary}</p>
            </article>
          ))}
        </div>
        <div className="hero-actions">
          <a className="button primary" href="/services">View all services</a>
        </div>
      </section>

      <section className="section-shell testimonials-section aligned-section">
        <div className="section-heading">
          <p className="eyebrow">Testimonials</p>
          <h2>Practical guidance, future-focused outcomes.</h2>
        </div>
        <div className="testimonial-grid">
          {testimonials.map((testimonial) => (
            <figure key={testimonial.quote}>
              <blockquote>"{testimonial.quote}"</blockquote>
              <figcaption>{testimonial.author}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </main>
  );
}