import type { Metadata } from "next";

const siteUrl = "https://www.omnexagoc.com";

export const metadata: Metadata = {
  title: "Initiatives & Products",
  description:
    "Explore OMNeXa initiatives being developed across responsible AI, education, action management, human development, community support and sustainability.",
  alternates: { canonical: "/portfolio" },
  openGraph: {
    title: "OMNeXa Initiatives & Products",
    description:
      "A factual overview of OMNeXa initiatives being developed across education, human capability, action management, community support and sustainability.",
    url: `${siteUrl}/portfolio`,
    type: "website",
    images: [
      {
        url: "/omnexa-driver-home.jpg",
        width: 1254,
        height: 1254,
        alt: "OMNeXa visual representing human capability, artificial intelligence and robotics guided by human values"
      }
    ]
  }
};

const initiatives = [
  {
    name: "OMNeXa EduCareer",
    category: "Education, skills and employability",
    description:
      "A career and education pathway platform being developed to connect education choices, skills, jobs and practical next steps for students and professionals.",
    url: "https://educareer.omnexagoc.com"
  },
  {
    name: "Human-Machine Sadhana",
    category: "Human capability and responsible technology",
    description:
      "A human-development initiative exploring how technology can support reflection, consistency, positive habits and accountable personal progress.",
    url: "https://humanmachinesadhana.omnexagoc.com"
  },
  {
    name: "ActionLoop",
    category: "Action and follow-up management",
    description:
      "A practical action-management application being developed to connect tasks, follow-ups, status changes and calendar coordination across devices.",
    url: "https://actionloop.omnexagoc.com"
  },
  {
    name: "Sahaay-Setu",
    category: "Community and household support",
    description:
      "A service-coordination concept intended to make support for seniors, families and households easier to discover, request and manage.",
    url: "https://sahaay-setu.omnexagoc.com"
  },
  {
    name: "Lotus Karmic Balance",
    category: "Sustainability and participation",
    description:
      "A sustainability-engagement concept connecting positive participation, simple recognition and community-oriented environmental action.",
    url: "https://lotusbalance.omnexagoc.com"
  },
  {
    name: "Future Plus pathways",
    category: "Education ecosystem collaboration",
    description:
      "An education-pathway and counsellor collaboration delivered with Future Plus Educom LLP to support structured student onboarding and guidance.",
    url: "https://futureplus.omnexagoc.com"
  }
];

const portfolioSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${siteUrl}/portfolio#collection`,
  url: `${siteUrl}/portfolio`,
  name: "OMNeXa Initiatives & Products",
  description:
    "A factual overview of initiatives being developed across education, human capability, action management, community support and sustainability.",
  about: { "@id": `${siteUrl}/#organization` },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: initiatives.map((initiative, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CreativeWork",
        name: initiative.name,
        description: initiative.description,
        url: initiative.url,
        creator: { "@id": `${siteUrl}/#organization` }
      }
    }))
  },
  inLanguage: "en-SG"
};

export default function PortfolioPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioSchema) }}
      />

      <section className="page-hero section-shell aligned-section">
        <p className="eyebrow">Initiatives in development</p>
        <h1>From principles to practical platforms.</h1>
        <p>
          OMNeXa is developing and supporting a connected set of initiatives across education, human
          capability, action management, community support and sustainability. This page describes the
          current purpose and development direction of each initiative.
        </p>
      </section>

      <section className="section-shell initiative-grid aligned-section">
        {initiatives.map((initiative, index) => (
          <article key={initiative.name}>
            <span className="initiative-index">{String(index + 1).padStart(2, "0")}</span>
            <p className="publication-meta">{initiative.category}</p>
            <h2>{initiative.name}</h2>
            <p>{initiative.description}</p>
            <a href={initiative.url} target="_blank" rel="noreferrer">Visit initiative</a>
          </article>
        ))}
      </section>

      <section className="band">
        <div className="section-shell split-section aligned-section compact-band-content">
          <div>
            <p className="eyebrow">Evidence discipline</p>
            <h2>Progress will be communicated with clear status and evidence.</h2>
          </div>
          <div className="copy-stack">
            <p>
              OMNeXa distinguishes initiatives being developed from completed client engagements and
              measured outcomes. Quantitative results will be published only when the supporting evidence
              and measurement basis are available.
            </p>
            <a href="/ovia">Explore the OVIA integrity framework</a>
          </div>
        </div>
      </section>
    </main>
  );
}
