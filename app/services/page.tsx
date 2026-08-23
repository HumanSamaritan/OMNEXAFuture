import {
  educationMarketFocus,
  engagementFormats,
  engagementSteps,
  partnerTypes,
  services,
  targetMarkets
} from "@/lib/site-data";

const serviceLenses = [
  {
    title: "People & institutions",
    description: "Education, employability, leadership and capability-building designed for a workforce being reshaped by AI."
  },
  {
    title: "Banks & regulated enterprises",
    description: "Technology and functional banking transformation across payments, onboarding, financial crime, risk, controls and reporting."
  },
  {
    title: "AI & transformation leaders",
    description: "Responsible AI, governance, cybersecurity, human-defined automation and operating-model design for practical adoption."
  }
];

export default function ServicesPage() {
  return (
    <main>
      <section className="page-hero section-shell aligned-section">
        <p className="eyebrow">Services</p>
        <h1>Transformation services built around practical outcomes.</h1>
        <p>
          OMNeXa combines advisory, leadership facilitation and implementation support across technology,
          functional banking, risk and controls, AI readiness, education, sustainability and human capability.
        </p>
      </section>

      <section className="section-shell service-lead-grid" aria-label="OMNeXa service lenses">
        {serviceLenses.map((lens) => (
          <article key={lens.title}>
            <h3>{lens.title}</h3>
            <p>{lens.description}</p>
          </article>
        ))}
      </section>

      <section className="section-shell service-stack-page aligned-section">
        {services.map((service, index) => (
          <article className="service-row tilt-card" key={service.title}>
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

      <section className="section-shell preview-section aligned-section">
        <div className="section-heading">
          <p className="eyebrow">Partner types</p>
          <h2>Collaboration shaped around the problem, not a fixed package.</h2>
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

      <section className="band market-band">
        <div className="section-shell aligned-section">
          <div className="section-heading">
            <p className="eyebrow">Global education pathways</p>
            <h2>Market-aware guidance with a global perspective.</h2>
            <p>
              OMNeXa supports education and career-readiness conversations across multiple markets,
              helping students, parents and institutions compare pathways with local context and future-skills awareness.
            </p>
          </div>
          <div className="market-list">
            {targetMarkets.map((market) => (
              <span className="tilt-card" key={market}>{market}</span>
            ))}
          </div>
          <div className="education-focus-grid">
            {educationMarketFocus.map((item) => (
              <article className="tilt-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="band">
        <div className="section-shell aligned-section">
          <div className="section-heading">
            <p className="eyebrow">Engagement model</p>
            <h2>Start focused, prove value, then scale.</h2>
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

          <div className="section-heading compact-heading">
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
