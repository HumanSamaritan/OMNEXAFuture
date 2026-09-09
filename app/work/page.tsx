import type { Metadata } from "next";
import { products, serviceSegments } from "@/lib/product-data";

const siteUrl = "https://www.omnexagoc.com";

export const metadata: Metadata = {
  title: "Our Work | OMNeXa Products & Platforms",
  description:
    "Explore OMNeXa products and work in progress across AI and responsible innovation, education and careers, sustainability and ESG, and well-being and conscious leadership.",
  keywords: [
    "OMNeXa products",
    "OMNeXa portfolio",
    "HumanMachineSadhana",
    "Human Machine Sadhana",
    "NeXaKriya",
    "NeXaVirama",
    "EduCareer",
    "Sahaay-Setu",
    "SwayamITR",
    "PSLE practice",
    "Lotus Karmic Balance",
    "AI wellness",
    "responsible innovation",
    "education technology",
    "sustainability technology"
  ],
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Our Work | OMNeXa Products & Platforms",
    description:
      "A connected portfolio of OMNeXa products being developed across human-centred AI, education, sustainability and well-being.",
    url: `${siteUrl}/work`,
    type: "website",
    images: [
      {
        url: "/omnexa-driver-home.jpg",
        width: 1254,
        height: 1254,
        alt: "OMNeXa — human capability, intelligence and responsible innovation"
      }
    ]
  }
};

const workFaqs = [
  {
    question: "What products is OMNeXa developing?",
    answer:
      "OMNeXa is developing products across AI and responsible innovation, education and career pathways, sustainability engagement, and well-being and conscious leadership. Current work includes HumanMachineSadhana, NeXaKriya, NeXaVirama, EduCareer, PSLE Practice Space, Sahaay-Setu, SwayamITR and Lotus Karmic Balance."
  },
  {
    question: "Are OMNeXa products available now?",
    answer:
      "The products shown on this page are currently under construction. Some work-in-progress environments may be accessible, but capabilities, availability and interfaces can change during development."
  },
  {
    question: "How are OMNeXa products connected to its services?",
    answer:
      "Each product is mapped to the OMNeXa service segment whose primary outcome it supports. The portfolio is designed to turn service principles into practical tools, pilots and digital experiences."
  },
  {
    question: "What is HumanMachineSadhana by OMNeXa?",
    answer:
      "HumanMachineSadhana, also written Human Machine Sadhana and abbreviated HMS, is an AI-enabled wellness and human-readiness platform being developed by OMNeXa to support awareness across everyday wellbeing patterns while keeping human choice central."
  }
];

const collectionSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${siteUrl}/work#collection`,
      url: `${siteUrl}/work`,
      name: "OMNeXa Products & Platforms",
      description:
        "OMNeXa work in progress across responsible innovation, education, sustainability and well-being.",
      about: { "@id": `${siteUrl}/#organization` },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: products.length,
        itemListElement: products.map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "SoftwareApplication",
            "@id": `${siteUrl}/work/${product.slug}#software`,
            name: product.name,
            alternateName: product.alternateNames,
            url: `${siteUrl}/work/${product.slug}`,
            sameAs: product.externalUrl,
            description: product.description,
            applicationCategory: getCategoryName(product.serviceSlug),
            operatingSystem: "Web",
            creator: { "@id": `${siteUrl}/#organization` },
            keywords: product.seoTerms.join(", "),
            additionalProperty: {
              "@type": "PropertyValue",
              name: "Development status",
              value: product.status
            }
          }
        }))
      }
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/work#faq`,
      mainEntity: workFaqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer
        }
      }))
    }
  ]
};

function getCategoryName(serviceSlug: string) {
  return serviceSegments.find((segment) => segment.slug === serviceSlug)?.title ?? "OMNeXa product";
}

export default function WorkPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <section className="page-hero section-shell aligned-section work-hero">
        <p className="eyebrow">Our Work</p>
        <h1>Principles become useful when they become something people can use.</h1>
        <p>
          OMNeXa is building a connected portfolio of products and practical platforms across responsible
          innovation, education, sustainability and human well-being. Every product below is mapped to the
          service outcome it is designed to strengthen.
        </p>
        <div className="work-hero-actions">
          <a className="button" href="#portfolio">Explore the portfolio</a>
          <a className="button secondary" href="/services">See our service segments</a>
        </div>
      </section>

      <section className="section-shell aligned-section work-service-map" aria-label="OMNeXa service segments and related products">
        <div className="section-heading compact-heading">
          <p className="eyebrow">One ecosystem</p>
          <h2>Browse OMNeXa work by service area.</h2>
          <p>
            Each service area links directly to the products or advisory work associated with it, so visitors
            can move from the capability they care about to the relevant OMNeXa work without interpreting product counts.
          </p>
        </div>
        <div className="work-segment-grid">
          {serviceSegments.map((segment, segmentIndex) => {
            const relatedProducts = products.filter((product) => product.serviceSlug === segment.slug);
            return (
              <article className="work-segment-card" key={segment.slug}>
                <span>{String(segmentIndex + 1).padStart(2, "0")}</span>
                <h3><a href={segment.href}>{segment.shortTitle}</a></h3>
                {relatedProducts.length > 0 ? (
                  <div className="work-card-links">
                    {relatedProducts.map((product) => (
                      <a href={`/work/${product.slug}`} key={product.slug}>{product.name} →</a>
                    ))}
                  </div>
                ) : (
                  <div className="work-card-links">
                    <a href={segment.href}>Explore advisory services →</a>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section id="portfolio" className="section-shell aligned-section work-portfolio-section">
        <div className="section-heading">
          <p className="eyebrow">Products & platforms</p>
          <h2>Work in progress, shown with clear status.</h2>
          <p>
            All products are currently under construction. We show the problem, intended role and service
            alignment now; capability and outcome claims will only mature with evidence.
          </p>
        </div>

        <div className="work-card-grid">
          {products.map((product, index) => {
            const segment = serviceSegments.find((item) => item.slug === product.serviceSlug);
            return (
              <article className={`work-card work-card-${(index % 4) + 1}`} key={product.slug}>
                <a className="work-card-visual" href={`/work/${product.slug}`} aria-label={`Read about ${product.name}`}>
                  <div className="work-visual-topline">
                    <span>{product.visualKicker}</span>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <strong>{product.visualTitle}</strong>
                  <div className="work-visual-pills">
                    {product.visualItems.map((item) => <span key={item}>{item}</span>)}
                  </div>
                </a>

                <div className="work-card-copy">
                  <div className="work-card-meta">
                    <span className="work-status">{product.status}</span>
                    <a href={segment?.href ?? "/services"}>{segment?.shortTitle}</a>
                  </div>
                  <h3><a href={`/work/${product.slug}`}>{product.name}</a></h3>
                  <p>{product.oneLiner}</p>
                  <div className="work-card-links">
                    <a href={`/work/${product.slug}`}>Why it exists →</a>
                    <a href={product.externalUrl} target="_blank" rel="noreferrer">Work-in-progress site ↗</a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="band work-evidence-band">
        <div className="section-shell aligned-section split-section compact-band-content">
          <div>
            <p className="eyebrow">Build with evidence</p>
            <h2>Construction status is part of the story, not something to hide.</h2>
          </div>
          <div className="copy-stack">
            <p>
              OMNeXa distinguishes a product being built from a product with validated outcomes. This keeps
              the portfolio useful for partners while protecting the integrity of future performance claims.
            </p>
            <a href="/ovia">See the OVIA integrity approach →</a>
          </div>
        </div>
      </section>

      <section className="section-shell aligned-section work-faq-section">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Questions answered clearly</p>
          <h2>OMNeXa product portfolio FAQ.</h2>
        </div>
        <div className="faq-grid">
          {workFaqs.map((faq) => (
            <article key={faq.question}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
