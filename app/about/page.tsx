import {
  coreCompetencies,
  educationCredentials,
  experienceTimeline,
  linkedinRecommendations,
  proofPoints,
  trackRecord
} from "@/lib/site-data";

export default function AboutPage() {
  return (
    <main>
      <section className="page-hero section-shell about-hero aligned-section">
        <p className="eyebrow">Founder profile</p>
        <h1>Dhiraj Kumar brings compliance depth into human-centered transformation.</h1>
        <p>
          Founder / Advisor at OMNeXa Pte. Ltd., Dhiraj connects financial-crime execution,
          compliance technology, sustainability thinking, responsible AI readiness and conscious
          leadership into practical programs for people and organizations.
        </p>
      </section>

      <section className="section-shell track-record-grid" aria-label="Dhiraj Kumar track record">
        {trackRecord.map((item) => (
          <article key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
      </section>

      <section className="section-shell about-profile-grid aligned-section">
        <div className="profile-card">
          <div className="founder-badge">DK</div>
          <p className="eyebrow">OMNeXa founder</p>
          <h2>Risk discipline. Technology fluency. Human progress.</h2>
        </div>
        <div className="copy-stack profile-copy">
          <p>
            Dhiraj has spent more than two decades helping financial institutions and global teams
            solve hard problems across AML/KYC, sanctions, onboarding, controls, compliance technology,
            regulatory readiness and transformation delivery.
          </p>
          <p>
            OMNeXa builds from that foundation. The work is designed for implementation: diagnose the
            challenge, align stakeholders, build capability, strengthen governance and turn future-ready
            ideas into repeatable programs.
          </p>
        </div>
      </section>

      <section className="band about-band">
        <div className="section-shell aligned-section">
          <div className="section-heading">
            <p className="eyebrow">Core strengths</p>
            <h2>The operating range behind OMNeXa.</h2>
          </div>
          <div className="competency-grid">
            {coreCompetencies.map((competency) => (
              <span key={competency}>{competency}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell experience-section aligned-section">
        <div className="section-heading">
          <p className="eyebrow">Experience</p>
          <h2>Built across Citi, consulting, banking technology and global delivery.</h2>
        </div>
        <div className="experience-timeline">
          {experienceTimeline.map((role) => (
            <article key={`${role.company}-${role.title}-${role.period}`}>
              <div className="timeline-dot" />
              <div>
                <p className="role-period">{role.period}</p>
                <h3>{role.title}</h3>
                <strong>{role.company}</strong>
                <p>{role.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell proof-section aligned-section">
        <div className="section-heading">
          <p className="eyebrow">What anchors the work</p>
          <h2>Execution depth with a human-centered lens.</h2>
        </div>
        <ul className="proof-grid">
          {proofPoints.map((point) => <li key={point}>{point}</li>)}
        </ul>
      </section>

      <section className="band about-band">
        <div className="section-shell aligned-section education-layout">
          <div>
            <p className="eyebrow">Education</p>
            <h2>Learning foundation.</h2>
          </div>
          <div className="education-grid">
            {educationCredentials.map((item) => (
              <article key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell testimonials-section aligned-section">
        <div className="section-heading">
          <p className="eyebrow">LinkedIn recommendations</p>
          <h2>Selected signals from colleagues, clients and leaders.</h2>
          <p>
            A concise selection from the LinkedIn recommendations provided, focused on the themes most
            relevant to OMNeXa: compliance leadership, delivery, team building, problem solving and trust.
          </p>
        </div>
        <div className="recommendation-grid">
          {linkedinRecommendations.map((recommendation) => (
            <figure key={`${recommendation.author}-${recommendation.theme}`}>
              <p className="recommendation-theme">{recommendation.theme}</p>
              <blockquote>"{recommendation.quote}"</blockquote>
              <figcaption>
                <strong>{recommendation.author}</strong>
                <span>{recommendation.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </main>
  );
}