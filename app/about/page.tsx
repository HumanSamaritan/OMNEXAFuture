import type { Metadata } from "next";
import Image from "next/image";

const siteUrl = "https://www.omnexagoc.com";

export const metadata: Metadata = {
  title: "About OMNeXa",
  description:
    "Official company profile of OMNeXa Pte. Ltd., a Singapore-based transformation and innovation company founded by Dhiraj Kumar, focused on human-centred AI, banking transformation, risk, governance and sustainable human capability.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About OMNeXa Pte. Ltd. | Singapore",
    description:
      "Official identity, founder, purpose and focus areas of OMNeXa Pte. Ltd. — Where Consciousness Meets Intelligence.",
    url: `${siteUrl}/about`,
    type: "website",
    images: [
      {
        url: "/omnexa-driver-home.jpg",
        width: 1254,
        height: 1254,
        alt: "OMNeXa visual representing human capability, artificial intelligence and robotics guided by human values"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "About OMNeXa Pte. Ltd. | Singapore",
    description:
      "Human-centred AI, risk-aware transformation and leadership for what comes next.",
    images: ["/omnexa-driver-home.jpg"]
  }
};

const aboutSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": `${siteUrl}/about#webpage`,
      url: `${siteUrl}/about`,
      name: "About OMNeXa Pte. Ltd.",
      description:
        "Official company profile of OMNeXa Pte. Ltd., a Singapore-based transformation and innovation company.",
      mainEntity: { "@id": `${siteUrl}/#organization` },
      primaryImageOfPage: { "@id": `${siteUrl}/#primary-image` },
      isPartOf: { "@id": `${siteUrl}/#website` },
      inLanguage: "en-SG",
      dateModified: "2026-08-23"
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${siteUrl}/`
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "About OMNeXa",
          item: `${siteUrl}/about`
        }
      ]
    }
  ]
};

const focusAreas = [
  {
    title: "Human-centred AI and transformation",
    description:
      "Responsible AI, human-defined automation and enterprise transformation designed with governance, security, privacy and accountability from the beginning."
  },
  {
    title: "Banking, risk and controls",
    description:
      "Practical experience across payments, client onboarding, financial crime, compliance technology, risk, controls, reporting and multi-market change."
  },
  {
    title: "Education and future of work",
    description:
      "Career pathways, employability, capability-building and AI-era readiness intended to help people participate in technological change."
  },
  {
    title: "Sustainability and well-being",
    description:
      "Sustainability activation, conscious leadership and human well-being connected to measurable, responsible progress."
  }
];

export default function AboutPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />

      <section className="page-hero section-shell about-hero about-hero-grid aligned-section">
        <div className="about-hero-copy">
          <p className="eyebrow">Official company profile</p>
          <h1>OMNeXa Pte. Ltd. — a Singapore-based transformation and innovation company.</h1>
          <p>
            OMNeXa brings together human-centred AI, technology and banking transformation, risk and
            governance, education, sustainability and human capability. The company is designed around
            one principle: technology should strengthen human judgement, dignity and opportunity.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="/dhiraj-kumar">Meet the founder</a>
            <a className="button secondary" href="/media">Official media assets</a>
          </div>
        </div>

        <figure className="entity-visual-panel">
          <Image
            src="/omnexa-driver-home.jpg"
            alt="OMNeXa visual representing human capability, artificial intelligence and robotics guided by human values"
            width={1254}
            height={1254}
            sizes="(max-width: 1000px) 100vw, 34vw"
            priority
          />
          <figcaption>OMNeXa™ · Where Consciousness Meets Intelligence</figcaption>
        </figure>
      </section>

      <section className="section-shell entity-facts-grid" aria-label="OMNeXa company facts">
        <article><span>Legal name</span><strong>OMNeXa Pte. Ltd.</strong></article>
        <article><span>Singapore UEN</span><strong>202628055R</strong></article>
        <article><span>Incorporated</span><strong>22 June 2026</strong></article>
        <article><span>Founder & CEO</span><strong><a href="/dhiraj-kumar">Dhiraj Kumar</a></strong></article>
      </section>

      <section className="section-shell split-section aligned-section">
        <div>
          <p className="eyebrow">Why OMNeXa exists</p>
          <h2>Design transformation around accountable outcomes.</h2>
        </div>
        <div className="copy-stack">
          <p>
            AI, regulatory pressure, workforce transition and sustainability are converging. Treating
            them as separate programs can create duplicated effort, fragmented ownership and weak
            accountability.
          </p>
          <p>
            OMNeXa connects technology decisions with business outcomes, risk and controls, people,
            operating models and long-term human value. The work is grounded in practical execution and
            governance-first leadership.
          </p>
        </div>
      </section>

      <section className="band">
        <div className="section-shell aligned-section">
          <div className="section-heading">
            <p className="eyebrow">Focus areas</p>
            <h2>One philosophy across connected transformation themes.</h2>
          </div>
          <div className="about-focus-grid">
            {focusAreas.map((area) => (
              <article key={area.title}>
                <h3>{area.title}</h3>
                <p>{area.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell aligned-section preview-section">
        <div className="section-heading">
          <p className="eyebrow">Official sources</p>
          <h2>Explore OMNeXa’s people, principles and published work.</h2>
        </div>
        <div className="pillar-grid">
          <article className="pillar-card">
            <span>01</span>
            <h3>Dhiraj Kumar</h3>
            <p>Founder profile, leadership background, experience and areas of expertise.</p>
            <a href="/dhiraj-kumar">Open founder profile</a>
          </article>
          <article className="pillar-card">
            <span>02</span>
            <h3>OMNeXa knowledge guide</h3>
            <p>Canonical answers about the company, its principles and its human-defined approach to AI.</p>
            <a href="/knowledge">Open knowledge guide</a>
          </article>
          <article className="pillar-card">
            <span>03</span>
            <h3>The Convergence Brief</h3>
            <p>OMNeXa’s thought-leadership series on AI, work, governance and human capability.</p>
            <a href="/convergence-brief">Explore the publication</a>
          </article>
        </div>
      </section>
    </main>
  );
}
