import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { canonicalIssues, getConvergenceIssue } from "@/lib/publications";

const siteUrl = "https://www.omnexagoc.com";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return canonicalIssues.map((issue) => ({ slug: issue.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const issue = await getConvergenceIssue(slug);

  if (!issue) return {};

  const pageUrl = `${siteUrl}/convergence-brief/${issue.slug}`;
  const imageUrl = `${pageUrl}/opengraph-image`;

  return {
    title: `${issue.issue}: ${issue.title}`,
    description: issue.summary,
    keywords: issue.seoKeywords || issue.themes,
    alternates: { canonical: pageUrl },
    authors: [{ name: "Dhiraj Kumar", url: `${siteUrl}/dhiraj-kumar` }],
    openGraph: {
      title: `${issue.title} | ${issue.issue}`,
      description: issue.summary,
      url: pageUrl,
      type: "article",
      publishedTime: issue.publishedAt,
      authors: [`${siteUrl}/dhiraj-kumar`],
      tags: issue.themes,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${issue.title} — ${issue.issue} of The Convergence Brief by OMNeXa`
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: `${issue.title} | ${issue.issue}`,
      description: issue.summary,
      images: [imageUrl]
    }
  };
}

export default async function ConvergenceIssuePage({ params }: Props) {
  const { slug } = await params;
  const issue = await getConvergenceIssue(slug);

  if (!issue) notFound();

  const pageUrl = `${siteUrl}/convergence-brief/${issue.slug}`;
  const imageUrl = `${pageUrl}/opengraph-image`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: issue.title,
        ...(issue.subtitle ? { alternativeHeadline: issue.subtitle } : { alternativeHeadline: `${issue.issue} of The Convergence Brief` }),
        description: issue.summary,
        url: pageUrl,
        mainEntityOfPage: pageUrl,
        image: {
          "@type": "ImageObject",
          url: imageUrl,
          contentUrl: imageUrl,
          width: 1200,
          height: 630,
          caption: `${issue.title} — ${issue.issue} of The Convergence Brief by OMNeXa`
        },
        ...(issue.publishedAt ? { datePublished: issue.publishedAt, dateModified: issue.publishedAt } : {}),
        author: { "@id": `${siteUrl}/dhiraj-kumar#person` },
        publisher: { "@id": `${siteUrl}/#organization` },
        isPartOf: { "@id": `${siteUrl}/convergence-brief#collection` },
        about: issue.themes,
        keywords: issue.seoKeywords,
        ...(issue.linkedinUrl ? { sameAs: [issue.linkedinUrl] } : {}),
        isAccessibleForFree: true,
        inLanguage: "en-SG"
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
          {
            "@type": "ListItem",
            position: 2,
            name: "The Convergence Brief",
            item: `${siteUrl}/convergence-brief`
          },
          { "@type": "ListItem", position: 3, name: issue.issue, item: pageUrl }
        ]
      },
      ...(issue.questions?.length
        ? [
            {
              "@type": "FAQPage",
              "@id": `${pageUrl}#faq`,
              mainEntity: issue.questions.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: item.answer
                }
              }))
            }
          ]
        : [])
    ]
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <article className="issue-page">
        <header className="page-hero section-shell aligned-section issue-header">
          <p className="eyebrow">The Convergence Brief · {issue.issue}</p>
          <h1>{issue.title}</h1>
          {issue.subtitle ? <p><strong>{issue.subtitle}</strong></p> : null}
          <p>{issue.summary}</p>
          <p className="issue-byline">
            By <a href="/dhiraj-kumar">Dhiraj Kumar</a> · Founder & CEO, OMNeXa Pte. Ltd.
            {issue.publishedAt ? ` · ${new Date(`${issue.publishedAt}T00:00:00Z`).toLocaleDateString("en-SG", {
              day: "numeric",
              month: "long",
              year: "numeric",
              timeZone: "UTC"
            })}` : ""}
          </p>
        </header>

        <figure className="section-shell issue-hero-image">
          <Image
            src={`/convergence-brief/${issue.slug}/opengraph-image`}
            alt={`${issue.title} — ${issue.issue} of The Convergence Brief by OMNeXa`}
            width={1200}
            height={630}
            sizes="(max-width: 1200px) 100vw, 1120px"
            unoptimized
            priority
          />
          <figcaption>{issue.title} · The Convergence Brief · OMNeXa Pte. Ltd.</figcaption>
        </figure>

        <section className="section-shell issue-content aligned-section">
          <div className="issue-sections">
            {issue.sections?.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                <p>{section.body}</p>
              </section>
            ))}
          </div>
          <aside className="issue-aside">
            <p className="eyebrow">Themes</p>
            <ul>
              {issue.themes?.map((theme) => <li key={theme}>{theme}</li>)}
            </ul>
            {issue.linkedinUrl ? (
              <a className="button primary" href={issue.linkedinUrl} target="_blank" rel="noreferrer">
                Read the published LinkedIn edition
              </a>
            ) : null}
            <a className="button secondary" href="/convergence-brief">
              Explore all Convergence Brief issues
            </a>
          </aside>
        </section>

        {issue.questions?.length ? (
          <section className="band">
            <div className="section-shell aligned-section">
              <div className="section-heading">
                <p className="eyebrow">Direct answers</p>
                <h2>Questions this issue answers.</h2>
                <p>
                  Concise answers are included for readers and machine systems looking for clear context
                  on the topic before exploring the full issue.
                </p>
              </div>
              <div className="service-preview-grid">
                {issue.questions.map((item) => (
                  <article className="service-card" key={item.question}>
                    <h3>{item.question}</h3>
                    <p>{item.answer}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="section-shell split-section aligned-section compact-band-content">
          <div>
            <p className="eyebrow">Publication integrity</p>
            <h2>Evidence, uncertainty and accountability remain visible.</h2>
          </div>
          <div className="copy-stack">
            <p>
              The Convergence Brief follows the OVIA integrity framework for evidence checks,
              counter-evidence, risk and controls, reciprocal bias review, market-convergence and
              prior-art checks, and accountable human decisions.
            </p>
            <p>
              OMNeXa treats these issue frameworks as practitioner working models. They are intended to
              be tested against implementation evidence and improved through counter-cases and practitioner feedback.
            </p>
            <a href="/ovia">Explore the OVIA framework</a>
          </div>
        </section>
      </article>
    </main>
  );
}
