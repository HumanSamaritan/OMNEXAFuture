import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, getProductsByService, getServiceSegment, products } from "@/lib/product-data";
import "./detail-refine.css";

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
  return {
    title: `${product.name} | OMNeXa`,
    description: product.oneLiner,
    keywords: [product.name, ...product.alternateNames, ...product.seoTerms],
    alternates: { canonical: `/work/${product.slug}` },
    openGraph: {
      title: `${product.name} by OMNeXa`,
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
      answer: `${product.name} is currently under construction. Any accessible work-in-progress environment may change as the product is tested and refined.`
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
        sameAs: product.externalUrl,
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
          value: product.status
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
              <span className="work-status large">{product.status}</span>
              <a className="button secondary" href={product.externalUrl} target="_blank" rel="noreferrer">Open work-in-progress site ↗</a>
            </div>
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

      <section className="section-shell aligned-section product-detail-story">
        <article>
          <p className="eyebrow">Why it exists</p>
          <h2>The problem</h2>
          <p>{product.problem}</p>
        </article>
        <article>
          <p className="eyebrow">What we are building</p>
          <h2>The direction</h2>
          <p>{product.description}</p>
        </article>
      </section>

      <section className="band product-capability-band">
        <div className="section-shell aligned-section">
          <div className="section-heading compact-heading">
            <p className="eyebrow">Current capability direction</p>
            <h2>What the product is being designed to support.</h2>
            <p>These are development intentions, not claims of completed or validated outcomes.</p>
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
            <h2>Other products in {service?.shortTitle}.</h2>
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
