import { engagementFormats, engagementSteps, partnerTypes, services } from "@/lib/site-data";

export default function ServicesPage() {
  return (
    <main>
      <section className="page-hero section-shell">
        <p className="eyebrow">Services</p>
        <h1>Focused pages for work that should not be cramped.</h1>
        <p>
          OMNeXa offers modular advisory, facilitation and implementation support across career,
          risk, sustainability, AI readiness and conscious leadership priorities.
        </p>
      </section>

      <section className="section-shell service-stack-page">
        {services.map((service, index) => (
          <article className="service-row" key={service.title}>
            <div className="service-number">{String(index + 1).padStart(2, "0")}</div>
            <div>
              <p className="eyebrow">{service.eyebrow}</p>
              <h2>{service.title}</h2>
              <p>{service.summary}</p>
            </div>
            <ul>
              {service.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
            </ul>
          </article>
        ))}
      </section>

      <section className="section-shell preview-section">
        <div className="section-heading centered">
          <p className="eyebrow">Partner types</p>
          <h2>Ecosystem collaboration shaped around each partner.</h2>
        </div>
        <div className="service-preview-grid">
          {partnerTypes.map((partner) => (
            <article className="service-card" key={partner.title}>
              <h3>{partner.title}</h3>
              <p>{partner.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="band">
        <div className="section-shell">
          <div className="section-heading centered">
            <p className="eyebrow">Engagement model</p>
            <h2>Start small, prove value, then scale.</h2>
          </div>
          <div className="format-grid">
            {engagementFormats.map((format, index) => (
              <article key={format.title}>
                <span>{index + 1}</span>
                <h3>{format.title}</h3>
                <p>{format.description}</p>
              </article>
            ))}
          </div>

          <div className="section-heading centered compact-heading">
            <p className="eyebrow">Roadmap</p>
            <h2>Discovery to scale.</h2>
          </div>
          <div className="timeline">
            {engagementSteps.map((step, index) => (
              <div key={step}>
                <span>{index + 1}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
