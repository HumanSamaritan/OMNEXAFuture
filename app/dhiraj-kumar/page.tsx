import type { Metadata } from "next";
import Image from "next/image";
import {
  coreCompetencies,
  educationCredentials,
  experienceTimeline,
  linkedinRecommendations,
  proofPoints,
  trackRecord
} from "@/lib/site-data";

const siteUrl = "https://www.omnexagoc.com";
const profileUrl = `${siteUrl}/dhiraj-kumar`;
const portraitUrl = `${siteUrl}/dhiraj-founder.png`;

export const metadata: Metadata = {
  title: "Dhiraj Kumar | Founder & CEO",
  description:
    "Official profile of Dhiraj Kumar, Founder & CEO of OMNeXa Pte. Ltd., Singapore. Technology and banking transformation, responsible AI, risk, governance, controls, sustainability and leadership.",
  alternates: { canonical: "/dhiraj-kumar" },
  openGraph: {
    title: "Dhiraj Kumar | Founder & CEO, OMNeXa Pte. Ltd.",
    description:
      "Official founder profile connecting technology leadership, banking transformation, responsible AI, governance, risk and human capability.",
    url: profileUrl,
    type: "profile",
    images: [
      {
        url: "/dhiraj-founder.png",
        width: 1254,
        height: 1254,
        alt: "Dhiraj Kumar, Founder and CEO of OMNeXa Pte. Ltd. in Singapore"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Dhiraj Kumar | Founder & CEO, OMNeXa Pte. Ltd.",
    description:
      "Technology and banking transformation, responsible AI, governance, risk and global leadership.",
    images: ["/dhiraj-founder.png"]
  }
};

const profilePageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": `${profileUrl}#profile-page`,
      url: profileUrl,
      name: "Dhiraj Kumar — Founder & CEO of OMNeXa Pte. Ltd.",
      description:
        "Official profile of Dhiraj Kumar, Founder and CEO of OMNeXa Pte. Ltd., Singapore.",
      dateCreated: "2026-08-23",
      dateModified: "2026-08-23",
      inLanguage: "en-SG",
      isPartOf: { "@id": `${siteUrl}/#website` },
      primaryImageOfPage: { "@id": `${profileUrl}#portrait` },
      mainEntity: { "@id": `${profileUrl}#person` }
    },
    {
      "@type": "Person",
      "@id": `${profileUrl}#person`,
      name: "Dhiraj Kumar",
      givenName: "Dhiraj",
      familyName: "Kumar",
      url: profileUrl,
      mainEntityOfPage: { "@id": `${profileUrl}#profile-page` },
      image: { "@id": `${profileUrl}#portrait` },
      jobTitle: "Founder & CEO",
      worksFor: { "@id": `${siteUrl}/#organization` },
      homeLocation: { "@type": "Place", name: "Singapore" },
      sameAs: ["https://www.linkedin.com/in/dhiraj-kumar-a9763616"],
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
        "Founder and CEO of OMNeXa Pte. Ltd., connecting technology leadership, functional banking transformation, responsible AI, governance, risk, human capability and sustainable progress."
    },
    {
      "@type": "ImageObject",
      "@id": `${profileUrl}#portrait`,
      contentUrl: portraitUrl,
      url: portraitUrl,
      width: 1254,
      height: 1254,
      caption: "Dhiraj Kumar, Founder and CEO of OMNeXa Pte. Ltd. in Singapore",
      representativeOfPage: true
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
        { "@type": "ListItem", position: 2, name: "Dhiraj Kumar", item: profileUrl }
      ]
    }
  ]
};

export default function DhirajKumarPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />

      <section className="page-hero section-shell about-hero about-hero-grid aligned-section">
        <div className="about-hero-copy">
          <p className="eyebrow">Official founder profile</p>
          <h1>
            Dhiraj Kumar — <span className="founder-role-nowrap">Founder &amp; CEO</span> of OMNeXa Pte. Ltd.
          </h1>
          <p>
            Based in Singapore, Dhiraj brings together technology leadership, functional banking leadership,
            risk and governance expertise, and human-centred AI thinking. His experience spans payments,
            client onboarding, financial crime, compliance technology, risk and controls, reporting and
            complex multi-market transformation.
          </p>
          <p>
            His leadership approach combines execution discipline with empathy — setting the right tone from
            the top, strengthening accountability and helping teams navigate change responsibly.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="/contact">Start a conversation</a>
            <a className="button secondary" href="/about">About OMNeXa</a>
          </div>
        </div>

        <figure className="founder-portrait-panel" aria-label="Dhiraj Kumar profile photograph">
          <Image
            src="/dhiraj-founder.png"
            alt="Dhiraj Kumar, Founder and CEO of OMNeXa Pte. Ltd. in Singapore"
            width={1254}
            height={1254}
            sizes="(max-width: 1000px) 100vw, 330px"
            priority
          />
          <figcaption>Founder & CEO · OMNeXa Pte. Ltd. · Singapore</figcaption>
        </figure>
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
              Dhiraj’s work has required technology and business teams to move together — translating
              complex regulatory, operational and customer requirements into practical delivery across
              banking systems, payments, onboarding, financial crime, controls and reporting.
            </p>
            <p>
              Through OMNeXa, the focus is not technology for its own sake, but using AI and digital
              capability to improve decisions, remove repetitive work, strengthen controls, develop people
              and create measurable outcomes.
            </p>
          </div>
        </div>
        <div className="leadership-signature" aria-label="Leadership approach">
          <article><strong>Lead with empathy</strong><span>Build capability, create clarity and help diverse teams perform through change.</span></article>
          <article><strong>Set the tone from the top</strong><span>Make compliance, accountability and responsible execution visible leadership expectations.</span></article>
          <article><strong>Connect business and technology</strong><span>Translate functional banking needs into scalable technology and operating-model change.</span></article>
          <article><strong>Design controls early</strong><span>Build risk, security, privacy and governance into transformation from the start.</span></article>
        </div>
      </section>

      <section className="band about-band">
        <div className="section-shell aligned-section">
          <div className="section-heading">
            <p className="eyebrow">Core strengths</p>
            <h2>The operating range behind OMNeXa.</h2>
          </div>
          <div className="competency-grid">
            {coreCompetencies.map((competency) => <span key={competency}>{competency}</span>)}
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
        <ul className="proof-grid">{proofPoints.map((point) => <li key={point}>{point}</li>)}</ul>
      </section>

      <section className="band about-band">
        <div className="section-shell aligned-section education-layout">
          <div><p className="eyebrow">Education</p><h2>Learning foundation.</h2></div>
          <div className="education-grid">
            {educationCredentials.map((item) => (
              <article key={item.title}><h3>{item.title}</h3><p>{item.detail}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell testimonials-section aligned-section">
        <div className="section-heading">
          <p className="eyebrow">Leadership recommendations</p>
          <h2>Signals from colleagues and leaders.</h2>
          <p>A selection focused on leadership, delivery, team building, problem solving and trust.</p>
        </div>
        <div className="recommendation-grid">
          {linkedinRecommendations.map((recommendation) => (
            <figure key={`${recommendation.author}-${recommendation.theme}`}>
              <p className="recommendation-theme">{recommendation.theme}</p>
              <blockquote>“{recommendation.quote}”</blockquote>
              <figcaption><strong>{recommendation.author}</strong><span>{recommendation.role}</span></figcaption>
            </figure>
          ))}
        </div>
      </section>
    </main>
  );
}
