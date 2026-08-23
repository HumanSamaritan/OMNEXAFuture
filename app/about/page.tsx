import type { Metadata } from "next";
import {
  coreCompetencies,
  educationCredentials,
  experienceTimeline,
  linkedinRecommendations,
  proofPoints,
  trackRecord
} from "@/lib/site-data";

const siteUrl = "https://www.omnexagoc.com";

export const metadata: Metadata = {
  title: "Dhiraj Kumar | Founder & CEO",
  description:
    "Dhiraj Kumar is Founder & CEO of OMNeXa Pte. Ltd., Singapore. His work spans technology and banking transformation, responsible AI, risk and governance, controls, payments, client onboarding, sustainability, education and leadership.",
  alternates: {
    canonical: "/about"
  },
  openGraph: {
    title: "Dhiraj Kumar | Founder & CEO, OMNeXa Pte. Ltd.",
    description:
      "Founder of OMNeXa Pte. Ltd., connecting technology leadership, banking transformation, responsible AI, governance, risk, human capability and sustainable progress.",
    url: `${siteUrl}/about`,
    type: "profile",
    images: [
      {
        url: "/dhiraj-founder.png",
        alt: "Dhiraj Kumar, Founder and CEO of OMNeXa Pte. Ltd."
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Dhiraj Kumar | Founder & CEO, OMNeXa Pte. Ltd.",
    description:
      "Technology and banking transformation, responsible AI, humans defining the loop, risk, governance and global leadership.",
    images: ["/dhiraj-founder.png"]
  }
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${siteUrl}/about#dhiraj-kumar`,
  name: "Dhiraj Kumar",
  url: `${siteUrl}/about`,
  image: `${siteUrl}/dhiraj-founder.png`,
  jobTitle: "Founder & CEO",
  worksFor: {
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "OMNeXa Pte. Ltd.",
    url: siteUrl
  },
  sameAs: ["https://sg.linkedin.com/in/dhiraj-kumar-a9763616"],
  knowsAbout: [
    "Technology transformation",
    "Banking transformation",
    "Payments and client onboarding",
    "Responsible AI",
    "Human-in-the-Loop AI",
    "Humans Defining the Loop",
    "Robotics with Human Values",
    "AI governance",
    "Cybersecurity, risk and controls",
    "AML/KYC and sanctions",
    "Risk and compliance reporting",
    "Sustainability and ESG",
    "Leadership and capability building"
  ],
  description:
    "Founder and CEO of OMNeXa Pte. Ltd., connecting technology leadership, banking-functional transformation, responsible AI, governance, risk, human capability and sustainable progress."
};

export default function AboutPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <section className="page-hero section-shell about-hero about-hero-grid aligned-section">
        <div className="about-hero-copy">
          <p className="eyebrow">Founder profile</p>
          <h1>Dhiraj Kumar — Founder & CEO of OMNeXa Pte. Ltd.</h1>
          <p>
            Based in Singapore, Dhiraj brings together technology leadership, functional banking leadership,
            risk and governance expertise, and human-centred AI thinking. His experience spans payments,
            client onboarding, financial crime, compliance technology, risk and controls, reporting and
            complex multi-market transformation.
          </p>
          <p>
            His leadership approach combines execution discipline with empathy — setting the right tone from
            the top, strengthening accountability and helping teams navigate change responsibly. Through
            OMNeXa, he focuses on future-ready ecosystems where technology strengthens human judgement,
            capability and sustainable progress.
          </p>
        </div>

        <aside className="founder-portrait-panel" aria-label="Dhiraj Kumar profile photograph">
          <img src="/dhiraj-founder.png" alt="Dhiraj Kumar, Founder and CEO of OMNeXa Pte. Ltd." />
          <p>Founder & CEO · OMNeXa Pte. Ltd. · Singapore</p>
        </aside>
      </section>

      <section className="section-shell track-record-grid" aria-label="Dhiraj Kumar leadership track record">
        {trackRecord.map((item) => (
          <article key={item.value}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
      </section>

      <section className="section-shell leadership-profile aligned-section">
        <div>
          <p className="eyebrow">Leadership profile</p>
          <h2>Technology fluency. Banking depth. Governance-first execution.</h2>
          <div className="copy-stack">
            <p>
              Dhiraj's work has required technology and business teams to move together — translating complex
              regulatory, operational and customer requirements into practical delivery across banking systems,
              payments, onboarding, financial crime, controls and reporting.
            </p>
            <p>
              OMNeXa builds from that operating experience. The focus is not technology for its own sake, but
              using AI and digital capability to improve decisions, remove repetitive work, strengthen controls,
              develop people and create measurable outcomes.
            </p>
            <p>
              The human principle remains explicit: keep humans in the loop where judgement is required, and
              more importantly keep humans defining the loop — its purpose, boundaries, decision rights,
              accountability and escalation.
            </p>
          </div>
        </div>

        <div className="leadership-signature" aria-label="Leadership approach">
          <article>
            <strong>Lead with empathy</strong>
            <span>Build capability, create clarity and help diverse teams perform through change.</span>
          </article>
          <article>
            <strong>Set the tone from the top</strong>
            <span>Make compliance, accountability and responsible execution visible leadership expectations.</span>
          </article>
          <article>
            <strong>Connect business and technology</strong>
            <span>Translate functional banking needs into scalable technology and operating-model change.</span>
          </article>
          <article>
            <strong>Design controls early</strong>
            <span>Risk, security, privacy and governance should be built into transformation rather than added later.</span>
          </article>
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
          <h2>Built across banking, technology, consulting and global delivery.</h2>
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
          <h2>Execution depth with a human-centred leadership lens.</h2>
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
            A concise selection focused on leadership, delivery, team building, problem solving,
            compliance depth and trust.
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
