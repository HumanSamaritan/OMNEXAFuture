import { ConsultancyCurrency, ConsultancyPrice } from "@/components/ConsultancyCurrency";
import type { Metadata } from "next";
import { companyLinkedIn, consultancyContact, consultancyFaqs, consultancySessions, discoveryBookingUrl } from "@/lib/consultancy";
import "./consultancy.css";

const siteUrl = "https://www.omnexagoc.com";
const pageUrl = `${siteUrl}/consultancy`;
const description = "Explore OMNeXa consultancy with Dhiraj Kumar: practical AI, prototype roadmaps, responsible AI, NeXaAML demos, AML/KYC and Tranche 2 training, HMS wellbeing and sustainability action. Start with a free 15-minute discovery call.";

export const metadata: Metadata = {
  title: "Consultancy & 1:1 Sessions with Dhiraj Kumar",
  description,
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "OMNeXa Consultancy | Practical AI, AML/KYC, HMS & Sustainability",
    description,
    url: pageUrl,
    type: "website",
    images: [{ url: "/dhiraj-founder.png", width: 1254, height: 1254, alt: "Dhiraj Kumar, Founder & CEO of OMNeXa" }]
  },
  twitter: { card: "summary_large_image", title: "OMNeXa Consultancy with Dhiraj Kumar", description, images: ["/dhiraj-founder.png"] }
};

const services = consultancySessions.map((session) => ({
  "@type": "Service",
  "@id": `${pageUrl}#${session.id}`,
  name: session.title,
  serviceType: session.title,
  description: `${session.summary} Session outputs: ${session.outcomes.join("; ")}. ${session.scope}`,
  url: `${pageUrl}#${session.id}`,
  provider: { "@id": `${siteUrl}/#organization` },
  availableChannel: { "@type": "ServiceChannel", serviceUrl: `${pageUrl}/book?service=${session.id}` },
  audience: { "@type": "Audience", audienceType: session.audience },
  areaServed: "Global"
}));

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage", "@id": `${pageUrl}#webpage`, url: pageUrl,
      name: "OMNeXa Consultancy & 1:1 Sessions with Dhiraj Kumar", description,
      dateModified: "2026-10-31", isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#organization` },
      mainEntity: { "@id": `${pageUrl}#catalog` }
    },
    {
      "@type": "OfferCatalog", "@id": `${pageUrl}#catalog`, name: "OMNeXa consultancy sessions",
      itemListElement: services.map((service) => ({ "@type": "Offer", itemOffered: { "@id": service["@id"] }, url: service.availableChannel.serviceUrl }))
    },
    ...services,
    {
      "@type": "FAQPage", "@id": `${pageUrl}#faq`,
      mainEntity: consultancyFaqs.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } }))
    },
    {
      "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Services", item: `${siteUrl}/services` },
        { "@type": "ListItem", position: 3, name: "Consultancy", item: pageUrl }
      ]
    }
  ]
};

export default function ConsultancyPage() {
  return (
    <main className="consultancy-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <section className="page-hero section-shell aligned-section">
        <p className="eyebrow">OMNeXa consultancy · Work directly with Dhiraj</p>
        <h1>Bring one real challenge. Leave with a practical next step.</h1>
        <p>Work directly with Dhiraj Kumar, Founder &amp; CEO of OMNeXa Pte. Ltd., Singapore. Choose a focused session in practical AI, product planning, governance, AML/KYC, wellbeing or sustainability.</p>
        <p>Banking, financial crime and transformation experience meets hands-on learning from developing OMNeXa products. Each session has a defined output we work on together.</p>
        <div className="hero-actions">
          <a className="button primary" href={discoveryBookingUrl}>Book a free 15-minute discovery call</a>
          <a className="button secondary" href="#session-heading">Explore all seven services</a>
          <a className="button secondary" href={`mailto:${consultancyContact}`}>Discuss a team engagement</a>
        </div>
        <p className="consultancy-note">The free introduction is available for every service, with no obligation. For detailed sessions, open your service page, complete the preparation questions and pay securely when checkout is available. Calendar selection follows verified payment. Contact: <a href={`mailto:${consultancyContact}`}>{consultancyContact}</a></p>
      </section>

      <section className="section-shell aligned-section" aria-labelledby="session-heading">
        <div className="section-heading"><p className="eyebrow">Choose your focus</p><h2 id="session-heading">Clear scope. Tangible session outputs.</h2></div>
        <p>Individual session fees are set in USD. You can view an estimate in your preferred currency. Team engagements and implementation are quoted separately. Start with a free introduction to confirm fit and scope.</p>
        <ConsultancyCurrency><div className="consultancy-grid">
          {consultancySessions.map((session) => (
            <article className="service-card consultancy-card" id={session.id} key={session.id}>
              <p className="eyebrow">{session.minutes}-minute online session · <ConsultancyPrice cents={session.priceCents} base={session.currency} /></p>
              <h3>{session.title}</h3>
              <p><strong>For:</strong> {session.audience}.</p>
              <p>{session.summary}</p>
              <h4>What you will leave with</h4>
              <ul>{session.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul>
              <p className="consultancy-scope">{session.scope}</p>
              <a className="button secondary" href={`/consultancy/book?service=${session.id}`}>Prepare and book this session →</a>
            </article>
          ))}
        </div></ConsultancyCurrency>
      </section>

      <section className="band">
        <div className="section-shell aligned-section">
          <div className="section-heading"><p className="eyebrow">The HMS philosophy</p><h2>Pause. Notice patterns. Choose. Practise. Review.</h2></div>
          <p>A pause creates room to examine an automatic response. Pattern identification helps reveal triggers, barriers and conditions for learning. A small, deliberate practice then gives you something concrete to review. We use this development loop to explore attention, reflection, decision-making and follow-through.</p>
          <p>In Human + Machine Sadhana, technology can help surface observations; the human retains context, judgement and choice. Sustainability extends that awareness from self and family to work, society and planet, connecting reflection with specific actions and evidence.</p>
          <p>Our products are being developed and tested. These sessions share practical methods and lessons; they do not promise validated clinical, environmental or commercial outcomes.</p>
          <div className="hero-actions"><a className="button secondary" href="/work/human-machine-sadhana">Explore HMS</a><a className="button secondary" href="/humans-defining-the-loop">Humans Defining the Loop</a><a className="button secondary" href="/work">See OMNeXa work</a></div>
        </div>
      </section>

      <section className="section-shell aligned-section" aria-labelledby="consultancy-faq">
        <div className="section-heading"><p className="eyebrow">Before you book</p><h2 id="consultancy-faq">Consultancy questions, answered.</h2></div>
        <p>For Australian regulatory context, see <a href="https://www.austrac.gov.au/industry-and-business/about-amlctf-reforms/about-reforms" target="_blank" rel="noopener noreferrer">AUSTRAC’s official AML/CTF reform guidance ↗</a>. Regulatory context checked 28 October 2026.</p>
        <div className="faq-list">{consultancyFaqs.map((faq) => <article key={faq.question}><h3>{faq.question}</h3><p>{faq.answer}</p></article>)}</div>
      </section>

      <section className="section-shell aligned-section consultancy-end">
        <h2>Start with one session. Scope larger work around the need.</h2>
        <p>For team training, workshops or an implementation engagement, contact OMNeXa to agree the audience, deliverables, timing and scope.</p>
        <div className="hero-actions"><a className="button primary" href={discoveryBookingUrl}>Book a free 15-minute introduction</a><a className="button secondary" href={companyLinkedIn} target="_blank" rel="noopener noreferrer">Follow OMNeXa on LinkedIn ↗</a><a className="button secondary" href="/dhiraj-kumar">Meet Dhiraj Kumar</a></div>
      </section>
    </main>
  );
}
