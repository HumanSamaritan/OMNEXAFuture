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
    "Dhiraj Kumar is Founder & CEO of OMNeXa Pte. Ltd., Singapore. His work spans responsible AI, human-defined automation, robotics with human values, risk and governance, AML/KYC, sustainability, education and transformation.",
  alternates: {
    canonical: "/about"
  },
  openGraph: {
    title: "Dhiraj Kumar | Founder & CEO, OMNeXa Pte. Ltd.",
    description:
      "Founder of OMNeXa Pte. Ltd., connecting responsible AI, human-defined automation, governance, risk, education, sustainability and human-machine collaboration.",
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
      "Responsible AI, humans defining the loop, robotics with human values, risk and governance, education and transformation.",
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
    "Responsible AI",
    "Human-in-the-Loop AI",
    "Humans Defining the Loop",
    "Robotics with Human Values",
    "Human-machine collaboration",
    "AI governance",
    "Risk and controls",
    "AML/KYC and sanctions",
    "Compliance technology transformation",
    "Sustainability and ESG",
    "Education and employability"
  ],
  description:
    "Founder and CEO of OMNeXa Pte. Ltd., focused on responsible AI, human-defined automation, risk and governance, robotics with human values, education, sustainability and practical transformation."
};

export default function AboutPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <section className="page-hero section-shell about-hero aligned-section">
        <p className="eyebrow">Founder profile</p>
        <h1>Dhiraj Kumar — Founder & CEO of OMNeXa Pte. Ltd.</h1>
        <p>
          Based in Singapore, Dhiraj connects financial-crime execution, compliance technology,
          sustainability thinking, responsible AI readiness and conscious leadership into practical
          programs for people and organizations. His approach to AI is grounded in a simple principle:
          keep humans in the loop, and more importantly, keep humans defining the loop — the purpose,
          boundaries, accountability and values within which intelligent systems operate.
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
          <div className="founder-photo-wrap tilt-card">
            <img src="/dhiraj-founder.png" alt="Dhiraj Kumar, Founder and CEO of OMNeXa Pte. Ltd." className="founder-photo" />
          </div>
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
          <p>
            Across AI and robotics, the direction is equally clear: technology should be designed around
            human purpose and human values. OMNeXa explores how consciousness, judgement, governance and
            accountability can shape intelligent systems from the beginning rather than being added after
            deployment.
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
