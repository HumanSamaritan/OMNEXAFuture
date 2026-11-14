import type { Metadata } from "next";
import { getProductVideo } from "@/lib/videos";
import { products, serviceSegments } from "@/lib/product-data";
import "./work-refine.css";

const siteUrl = "https://www.omnexagoc.com";

export const metadata: Metadata = {
  title: "Our Work | OMNeXa Products & Platforms",
  description:
    "Explore OMNeXa live apps and developing platforms across AI and responsible innovation, education and careers, sustainability and ESG, and well-being and conscious leadership.",
  keywords: [
    "OMNeXa products",
    "OMNeXa portfolio",
    "Human Machine Sadhana",
    "HMS",
    "NeXaKriya",
    "NeXaVirama",
    "NeXaCareer",
    "EduCareer",
    "NeXaLead",
    "NeXaAML",
    "NeXaSetu",
    "NeXaForge",
    "Sahaay Setu",
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
    "Explore live and developing OMNeXa products across human-centred AI, education, sustainability and well-being.",
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
    question: "What products and platforms are part of OMNeXa?",
    answer:
      "OMNeXa's portfolio includes the live NeXaCareer, NeXaKriya, NeXaVirama and Human Machine Sadhana products, alongside developing initiatives across education, banking and responsible AI, sustainability, and wellbeing. Each product page shows its current availability."
  },
  {
    question: "Are OMNeXa products available now?",
    answer:
      "NeXaCareer, Human Machine Sadhana, NeXaKriya and NeXaVirama are live at their official app links. NeXaCareer is available in production for B2C and B2B; it is not offered as a B2B product pilot. Other products have different availability and development status; check each initiative page for current details."
  },
  {
    question: "How can I register interest in a pilot?",
    answer:
      "For live products, use the official app link on the initiative page. NeXaCareer is live in production and is not listed as a product pilot. The separate Physical AI (Robots) learning initiative has its own interest-registration route."
  },
  {
    question: "How are OMNeXa products connected to its services?",
    answer:
      "Each product is mapped to the OMNeXa service area whose outcome it is designed to support. The portfolio turns service principles into practical tools, pilots and digital experiences."
  },
  {
    question: "What is Human Machine Sadhana (HMS)?",
    answer:
      "Human Machine Sadhana (HMS) is a live wellbeing reflection application designed to support awareness while keeping human choice central."
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
        "OMNeXa's live and developing products across responsible innovation, education, sustainability and well-being.",
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
            description: product.description,
            applicationCategory: getCategoryName(product.serviceSlug),
            operatingSystem: "Web",
            creator: { "@id": `${siteUrl}/#organization` },
            keywords: product.seoTerms.join(", "),
            additionalProperty: {
              "@type": "PropertyValue",
              name: "Development status",
              value: product.status === "Live" ? "Live" : "Coming Soon"
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
    <main className="work-page">
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
          <a className="button secondary" href="/pilot">Register pilot interest</a>
        </div>
      </section>

      <section className="section-shell aligned-section" aria-labelledby="robotics-learning-title">
        <div className="section-heading">
          <p className="eyebrow">Regional learning &amp; partner programmes</p>
          <h2 id="robotics-learning-title">OMNeXa India Initiatives</h2>
          <p>
            OMNeXa works with partners on India-focused learning and innovation initiatives. Our current
            proposed Odisha outreach introduces students in Grades 6–12 to robotics, Physical AI and
            human-centred technology in Rourkela and Bhubaneswar.
          </p>
        </div>
        <div className="copy-stack">
          <h3>Robotics Learning Programme — Odisha</h3>
          <p>Explore the proposed roadshow with robotics partners. Parents and guardians can register interest free of charge; event dates and venues are yet to be confirmed.</p>
        </div>
        <div className="hero-actions">
          <a className="button primary" href="/india/odisha/robotics">Explore Odisha robotics programme</a>
          <a className="button secondary" href="https://omnexa-career.omnexagoc.com/physical-ai-robots">Register interest</a>
        </div>
      </section>

      <section className="section-shell aligned-section work-service-map" aria-label="OMNeXa service segments and related products">
        <div className="section-heading compact-heading">
          <p className="eyebrow">One ecosystem</p>
          <h2>Browse OMNeXa work by service area.</h2>
          <p>
            Find an initiative by the outcome that matters to you. Explore a product overview or learn more
            about the service area behind it.
          </p>
        </div>
        <div className="work-segment-grid">
          {serviceSegments.map((segment, segmentIndex) => {
            const relatedProducts = products.filter((product) => product.serviceSlug === segment.slug);
            return (
              <article className={`work-segment-card segment-${segment.slug}`} key={segment.slug}>
                <div className="work-segment-heading">
                  <span className="work-segment-index" aria-hidden="true">{String(segmentIndex + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{segment.shortTitle}</h3>
                    <a className="work-area-link" href={segment.href}>Explore service area →</a>
                    <p className="work-segment-count">
                      {relatedProducts.length > 0
                        ? `${relatedProducts.length} ${relatedProducts.length === 1 ? "initiative" : "initiatives"}`
                        : "Advisory services"}
                    </p>
                  </div>
                </div>
                {relatedProducts.length > 0 ? (
                  <div className="work-segment-products">
                    {relatedProducts.map((product) => (
                      <a className="work-product-link" href={`/work/${product.slug}`} key={product.slug}><strong>{product.name}</strong><span>View initiative</span></a>
                    ))}
                  </div>
                ) : (
                  <div className="work-segment-products">
                    <a href={segment.href}>Explore advisory services</a>
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
          <h2>Live applications and initiatives in development.</h2>
          <p>
            These public pages outline the problem and intended direction. Pilot availability, access and available
            features are confirmed individually.
          </p>
        </div>

        <div className="work-card-grid">
          {products.map((product, index) => {
            const video = getProductVideo(product.slug);
            const segment = serviceSegments.find((item) => item.slug === product.serviceSlug);
            return (
              <article className={`work-card segment-${product.serviceSlug}`} key={product.slug}>
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
                    <span className="work-status">{product.slug === "educareer" ? "Live · B2C / B2B" : product.status === "Live" ? "Live" : "Coming Soon"}</span>
                    <a href={segment?.href ?? "/services"}>{segment?.shortTitle}</a>
                  </div>
                  <h3><a href={`/work/${product.slug}`}>{product.name}</a></h3>
                  <p>{product.oneLiner}</p>
                  <div className="work-card-links">
                    <a href={`/work/${product.slug}`}>Explore {product.name} →</a>
                    {video ? <a href={`/work/${product.slug}#introduction-video`}>Watch introduction →</a> : null}
                    {product.status === "Live" && product.externalUrl ? (
                      <a href={product.externalUrl} target="_blank" rel="noopener noreferrer">Open live app ↗</a>
                    ) : null}
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
