import type { Metadata } from "next";
import "./india.css";

const siteUrl = "https://www.omnexagoc.com";
const pageUrl = `${siteUrl}/india`;

export const metadata: Metadata = {
  title: "OMNeXa India | Responsible AI, Banking Risk & Future Skills",
  description:
    "Explore OMNeXa's India-relevant consultancy, responsible AI and governance, banking risk and controls, NeXaCareer, education partnerships and proposed Odisha robotics outreach.",
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "OMNeXa in India | AI, Risk, Education & Future Skills",
    description:
      "Singapore-based OMNeXa works with India-relevant organisations and partners across responsible AI, banking risk, future skills and robotics education.",
    url: pageUrl,
    siteName: "OMNeXa Pte. Ltd.",
    type: "website",
    locale: "en_IN",
    images: [{ url: "/omnexa-logo.png", alt: "Official OMNeXa logo" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "OMNeXa in India | Responsible AI, Risk & Future Skills",
    description:
      "India-relevant advisory, career pathways, partnerships and proposed robotics learning outreach from OMNeXa.",
    images: ["/omnexa-logo.png"]
  }
};

const indiaSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: "OMNeXa India | Responsible AI, Banking Risk & Future Skills",
      description: "India-relevant services, products, partnerships and learning initiatives from OMNeXa Pte. Ltd.",
      inLanguage: "en-IN",
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#organization` },
      breadcrumb: { "@id": `${pageUrl}#breadcrumb` }
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "India", item: pageUrl }
      ]
    }
  ]
};

const focusAreas = [
  {
    number: "01",
    title: "Responsible AI & governance",
    text: "Assess how AI is introduced into real workflows: intended use, human decision rights, oversight, testing, traceability and controls.",
    href: "/ai-readiness",
    link: "Explore AI readiness"
  },
  {
    number: "02",
    title: "Banking risk & controls",
    text: "Practical advisory informed by experience across AML/KYC, sanctions, client onboarding, payments, financial crime and multi-market change.",
    href: "/consultancy",
    link: "Explore consultancy"
  },
  {
    number: "03",
    title: "Careers & future skills",
    text: "NeXaCareer is live for individuals and organisations, connecting learning, capability development and career opportunities.",
    href: "/work/educareer",
    link: "Explore NeXaCareer"
  },
  {
    number: "04",
    title: "Robotics & Physical AI learning",
    text: "A proposed student learning initiative for Odisha introduces robotics and human-centred technology. Dates and venues remain subject to confirmation.",
    href: "/india/odisha/robotics",
    link: "View Odisha programme"
  }
];

const answers = [
  {
    question: "What is OMNeXa?",
    answer:
      "OMNeXa is the brand of OMNeXa Pte. Ltd., a Singapore-based transformation and innovation company. Its work connects responsible technology, business risk, education, sustainability and human capability."
  },
  {
    question: "Does OMNeXa have an Indian legal entity or office?",
    answer:
      "OMNeXa Pte. Ltd. is registered in Singapore. This website does not represent it as an Indian legal entity. India-related services and partnerships can be discussed directly with OMNeXa."
  },
  {
    question: "How can an Indian organisation work with OMNeXa?",
    answer:
      "Organisations can discuss a focused consultancy engagement, AI readiness or governance work, banking risk and controls, career and education initiatives, or an ecosystem partnership. Scope, availability and commercial terms are agreed directly."
  },
  {
    question: "Is the Odisha robotics roadshow confirmed?",
    answer:
      "The Physical AI (Robots) learning initiative is an interest route. Event dates, venues and delivery arrangements are subject to confirmation; registering interest is not a confirmed booking."
  },
  {
    question: "What is the status of the OMNeXa trademark?",
    answer:
      "OMNeXa has informed us that a trademark application has been filed. Filing is not the same as registration. The application jurisdiction, number and current registry status should be confirmed from the relevant official trademark registry before making a market-specific claim."
  }
];

export default function IndiaPage() {
  return (
    <main className="india-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(indiaSchema) }} />

      <section className="india-hero">
        <div className="india-hero-inner">
          <p className="eyebrow">OMNeXa Pte. Ltd. <span>·</span> Singapore-based <span>·</span> India engagement</p>
          <h1>Building responsible AI capability and future-ready organisations in India.</h1>
          <p className="india-hero-lead">
            From banking risk and AI governance to career pathways and robotics learning, OMNeXa connects technology choices to accountable business and human outcomes.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="/consultancy">Discuss an advisory need <span aria-hidden="true">→</span></a>
            <a className="button secondary" href="/ecosystem-collaboration">Explore a partnership</a>
          </div>
          <div className="india-proofline" aria-label="OMNeXa facts">
            <span>Singapore-registered company</span><span>India-focused initiatives</span><span>Human-defined AI principles</span>
          </div>
        </div>
        <aside className="india-hero-aside">
          <span className="india-aside-kicker">The OMNeXa approach</span>
          <h2>Make progress practical. Keep people accountable.</h2>
          <p>Technology creates value when people can understand it, guide it and build capability alongside it.</p>
          <a href="/ovia">Our grounding principles <span aria-hidden="true">↗</span></a>
        </aside>
      </section>

      <section className="section-shell india-section" aria-labelledby="india-focus-title">
        <div className="section-heading india-heading">
          <p className="eyebrow">Where we can contribute</p>
          <h2 id="india-focus-title">A practical agenda for India's next phase of change.</h2>
          <p>Start with a defined challenge. Build the right capability, controls and partnerships around it.</p>
        </div>
        <div className="india-focus-grid">
          {focusAreas.map((item) => (
            <article className="india-focus-card" key={item.number}>
              <span className="india-card-number">{item.number}</span>
              <div><h3>{item.title}</h3><p>{item.text}</p><a href={item.href}>{item.link} <span aria-hidden="true">→</span></a></div>
            </article>
          ))}
        </div>
      </section>

      <section className="india-programme-band">
        <div className="section-shell india-programme-layout">
          <div>
            <p className="eyebrow">Regional learning · Odisha</p>
            <h2>Robotics learning that puts human judgement at the centre.</h2>
            <p>Explore the proposed Physical AI student initiative for Rourkela and Bhubaneswar. Parents, learners and institutions can register interest while programme arrangements are developed.</p>
          </div>
          <a className="button primary" href="/india/odisha/robotics">Explore the Odisha initiative <span aria-hidden="true">→</span></a>
        </div>
      </section>

      <section className="section-shell india-section india-collaboration">
        <div className="india-collab-copy">
          <p className="eyebrow">Partnership & ecosystem building</p>
          <h2>India's future of work will be built through collaboration.</h2>
          <p>OMNeXa believes meaningful progress comes from connecting educators, employers, technology teams and community partners. We welcome conversations that turn shared intent into practical learning, opportunity and responsible innovation.</p>
          <a className="button secondary" href="/ecosystem-collaboration">Explore ecosystem collaboration <span aria-hidden="true">→</span></a>
        </div>
        <div className="india-collab-panel">
          <span>NEXACAREER · LIVE</span>
          <h3>Learning should connect to opportunity.</h3>
          <p>NeXaCareer is live for B2C and B2B. Institutions and organisations can explore the platform and its partner network.</p>
          <a href="https://omnexa-career.omnexagoc.com/partners" target="_blank" rel="noopener noreferrer">Open the NeXaCareer partner network ↗</a>
        </div>
      </section>

      <section className="india-answers-band" aria-labelledby="india-answers-title">
        <div className="section-shell india-section">
          <div className="section-heading india-heading">
            <p className="eyebrow">Clear answers</p>
            <h2 id="india-answers-title">Questions about OMNeXa in India.</h2>
          </div>
          <div className="india-answer-list">
            {answers.map((item) => <article key={item.question}><h3>{item.question}</h3><p>{item.answer}</p></article>)}
          </div>
          <p className="india-trademark-note">Trademark status can differ by country. OMNeXa uses the brand name in line with the information currently provided by the company; no statement of registration is made here.</p>
        </div>
      </section>

      <section className="section-shell india-final-cta">
        <div><p className="eyebrow">Start a conversation</p><h2>Have a specific India opportunity in mind?</h2><p>Share your organisation, challenge or partnership idea. OMNeXa can discuss fit, scope and next steps directly.</p></div>
        <div className="hero-actions"><a className="button primary" href="/contact">Contact OMNeXa <span aria-hidden="true">→</span></a><a className="button secondary" href="/services">View services</a></div>
      </section>
    </main>
  );
}
