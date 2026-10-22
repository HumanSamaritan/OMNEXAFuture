import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, getProductsByService, getServiceSegment, products } from "@/lib/product-data";
import "./detail-refine.css";
import "./hero-restore.css";

const siteUrl = "https://www.omnexagoc.com";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};

  const service = getServiceSegment(product.serviceSlug);
  const isLive = product.status === "Live";
  return {
    title: `${product.name} | ${isLive ? "Live App" : "Coming Soon"} | OMNeXa`,
    description: `${product.oneLiner} ${isLive ? "Open the live application; optional pilot registration is also available." : "Coming soon from OMNeXa."}`,
    keywords: [product.name, ...product.alternateNames, ...product.seoTerms],
    alternates: { canonical: `/work/${product.slug}` },
    openGraph: {
      title: `${product.name} by OMNeXa | ${isLive ? "Live App" : "Coming Soon"}`,
      description: product.oneLiner,
      url: `${siteUrl}/work/${product.slug}`,
      type: "website",
      images: [
        {
          url: "/omnexa-driver-home.jpg",
          width: 1254,
          height: 1254,
          alt: `${product.name} by OMNeXa — ${service?.shortTitle ?? "product in development"}`
        }
      ]
    }
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const service = getServiceSegment(product.serviceSlug);
  const siblings = getProductsByService(product.serviceSlug).filter((item) => item.slug !== product.slug);
  const isLive = product.status === "Live";

  const faqs = [
    {
      question: `What is ${product.name}?`,
      answer: product.description
    },
    {
      question: `What problem is ${product.name} designed to address?`,
      answer: product.problem
    },
    {
      question: `Why is ${product.name} part of ${service?.title ?? "OMNeXa's services"}?`,
      answer: product.whyHere
    },
    {
      question: `Is ${product.name} available now?`,
      answer: isLive
        ? `${product.name} is available at ${product.externalUrl}. You can use the app directly. Optional OMNeXa pilot registration is available at https://www.omnexagoc.com/pilot?product=${product.slug}, with separate pilot terms and feedback.`
        : `${product.name} is coming soon. This page describes its intended direction and planned capabilities; public product access is not available yet.`
    }
  ];

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${siteUrl}/work/${product.slug}#software`,
        name: product.name,
        alternateName: product.alternateNames,
        url: `${siteUrl}/work/${product.slug}`,
        description: product.description,
        applicationCategory: service?.title,
        operatingSystem: "Web",
        creator: { "@id": `${siteUrl}/#organization` },
        keywords: product.seoTerms.join(", "),
        audience: product.audiences.map((audience) => ({
          "@type": "Audience",
          audienceType: audience
        })),
        featureList: product.capabilities,
        additionalProperty: {
          "@type": "PropertyValue",
          name: "Development status",
          value: product.status === "Live" ? "Live" : "Coming Soon"
        }
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "OMNeXa", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Our Work", item: `${siteUrl}/work` },
          { "@type": "ListItem", position: 3, name: product.name, item: `${siteUrl}/work/${product.slug}` }
        ]
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer }
        }))
      }
    ]
  };

  return (
    <main className="product-detail-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="section-shell aligned-section product-detail-hero">
        <div className="product-detail-crumbs" aria-label="Breadcrumb">
          <a href="/work">Our Work</a>
          <span>/</span>
          <span>{product.name}</span>
        </div>
        <div className="product-detail-grid">
          <div>
            <p className="eyebrow">{service?.shortTitle}</p>
            <h1>{product.name}</h1>
            <p className="product-detail-lead">{product.oneLiner}</p>
            <div className="product-detail-actions">
              <span className="work-status large">{isLive ? "Live · Available now" : "Coming Soon"}</span>
              {isLive && product.externalUrl ? <a className="button" href={product.externalUrl} target="_blank" rel="noopener noreferrer">Open {product.name} →</a> : null}
              {isLive && ["human-machine-sadhana", "educareer", "nexakriya"].includes(product.slug) ? <a className="button secondary" href={`/pilot?product=${product.slug}`}>Join the pilot →</a> : null}
            </div>
            <p>
              {isLive ? "The application is available now. You can use it directly without joining a pilot. If you choose to participate in a pilot, your application and feedback are managed separately." : "OMNeXa is currently building and validating this product. This public page explains what it is intended to do; access to the unfinished application is not being provided from the OMNeXa website."}
            </p>
          </div>

          <div className="product-detail-visual" aria-label={`${product.name} concept visual`}>
            <span>{product.visualKicker}</span>
            <strong>{product.visualTitle}</strong>
            <div>
              {product.visualItems.map((item) => <span key={item}>{item}</span>)}
            </div>
          </div>
        </div>
      </section>

      {product.slug === "human-machine-sadhana" ? <section className="section-shell aligned-section" style={{paddingBottom:"2rem"}}><p className="eyebrow">Dussehra 2026 · HMS launch story</p><h2>Conquer Your Inner Ravan. Awaken the Ram Within.</h2><p>Discover the philosophy behind HMS through the Ramayana, human agency and responsible AI.</p><a className="button secondary" href="/insights/dussehra-human-machine-sadhana">Read the story and watch the film →</a></section> : null}
      <section className="section-shell aligned-section product-detail-story">
        <article>
          <p className="eyebrow">Why it exists</p>
          <h2>The problem</h2>
          <p>{product.problem}</p>
        </article>
        <article>
          <p className="eyebrow">What we offer</p>
          <h2>The direction</h2>
          <p>{product.description}</p>
        </article>
      </section>

      <section className="band product-capability-band">
        <div className="section-shell aligned-section">
          <div className="section-heading compact-heading">
            <p className="eyebrow">Product capabilities</p>
            <h2>What the product supports and continues to improve.</h2>
            <p>Features and availability may evolve as we improve the service.</p>
          </div>
          <div className="product-capability-grid">
            {product.capabilities.map((capability, index) => (
              <article key={capability}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{capability}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell aligned-section product-service-fit">
        <div>
          <p className="eyebrow">Why this service category</p>
          <h2>{service?.title}</h2>
          <p>{product.whyHere}</p>
          <a href={service?.href ?? "/services"}>See this OMNeXa service segment →</a>
        </div>
        <aside>
          <p className="eyebrow">Designed for</p>
          <div className="audience-chip-list">
            {product.audiences.map((audience) => <span key={audience}>{audience}</span>)}
          </div>
        </aside>
      </section>

      {siblings.length > 0 ? (
        <section className="section-shell aligned-section sibling-products">
          <div className="section-heading compact-heading">
            <p className="eyebrow">Related OMNeXa work</p>
            <h2>Other OMNeXa products in {service?.shortTitle}.</h2>
          </div>
          <div className="sibling-product-grid">
            {siblings.map((item) => (
              <a href={`/work/${item.slug}`} key={item.slug}>
                <span>{item.visualKicker}</span>
                <strong>{item.name}</strong>
                <p>{item.oneLiner}</p>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <section className="section-shell aligned-section product-faq-section">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Answer engine context</p>
          <h2>Questions about {product.name}.</h2>
        </div>
        <div className="faq-grid">
          {faqs.map((faq) => (
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
