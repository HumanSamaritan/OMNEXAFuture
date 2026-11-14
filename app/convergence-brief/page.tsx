import type { Metadata } from "next";
import { getConvergenceIssues } from "@/lib/publications";
import styles from "./page.module.css";

const siteUrl = "https://www.omnexagoc.com";
const latestNewsletterUrl =
  "https://www.linkedin.com/pulse/accountability-gap-when-ai-acts-who-answers-dhiraj-kumar-qqjve/";

export const metadata: Metadata = {
  title: "The Convergence Brief | AI, Human Agency & Future of Work",
  description:
    "Evidence-led OMNeXa perspectives on AI, human agency, accountable action, future of work and responsible transformation.",
  alternates: { canonical: `${siteUrl}/convergence-brief` },
  openGraph: {
    title: "The Convergence Brief | OMNeXa",
    description:
      "Evidence-led perspectives on AI, human agency, accountable action and responsible transformation.",
    url: `${siteUrl}/convergence-brief`,
    type: "website"
  }
};

export default async function ConvergenceBriefPage() {
  const issues = await getConvergenceIssues();
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteUrl}/convergence-brief#collection`,
    name: "The Convergence Brief",
    description:
      "An evidence-led OMNeXa publication connecting AI, human agency, future of work, human capability, governance and responsible transformation.",
    url: `${siteUrl}/convergence-brief`,
    publisher: { "@id": `${siteUrl}/#organization` },
    hasPart: [
      ...issues.map((issue) => ({
        "@type": "Article",
        "@id": `${siteUrl}/convergence-brief/${issue.slug}#article`,
        name: issue.title,
        url: `${siteUrl}/convergence-brief/${issue.slug}`
      })),
      {
        "@type": "Article",
        name: "The Accountability Gap: When AI Acts, Who Answers?",
        url: latestNewsletterUrl
      }
    ],
    inLanguage: "en-SG"
  };

  const issueLinks = [...issues].reverse();

  return (
    <main className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <div>
            <p className={styles.eyebrow}>OMNeXa perspectives · AI, people & transformation</p>
            <h1>The Convergence Brief</h1>
            <p className={styles.heroCopy}>
              Practical questions for leaders navigating the convergence of human purpose and intelligent systems.
              Grounded in OMNeXa&apos;s product-creation journey, shared as perspectives for wider discussion.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.primaryLink} href="#published-issues">Explore the issues <span aria-hidden="true">↓</span></a>
              <a className={styles.secondaryLink} href="/about">About OMNeXa <span aria-hidden="true">→</span></a>
            </div>
          </div>

          <article className={styles.spotlight} aria-labelledby="latest-newsletter-title">
            <p className={styles.spotlightLabel}>Latest newsletter</p>
            <h2 id="latest-newsletter-title">The Accountability Gap: When AI Acts, Who Answers?</h2>
            <p>
              A leadership question for the agentic era: how should accountability be understood when AI takes action?
            </p>
            <a className={styles.primaryLink} href={latestNewsletterUrl} target="_blank" rel="noopener noreferrer">
              Read the newsletter on LinkedIn
            </a>
          </article>
        </div>
      </header>

      <section className={styles.section} aria-labelledby="journey-title">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <p className={styles.eyebrow}>The editorial journey</p>
            <h2 id="journey-title">From AI capability to accountable human capability.</h2>
            <p>
              The series follows the questions that emerge as AI moves from a tool people use to a system that can
              interpret, coordinate and act. Each issue adds a perspective; none is presented as a settled answer.
            </p>
          </div>

          <div className={styles.arc}>
            <article className={styles.arcStep}>
              <span className={styles.arcNo}>01 — 03 · DESIGN</span>
              <h3>How should we shape the system?</h3>
              <p>Technology choices, decision rights and experiences that preserve human agency.</p>
            </article>
            <article className={styles.arcStep}>
              <span className={styles.arcNo}>04 — 07 · CAPABILITY</span>
              <h3>How do people stay capable?</h3>
              <p>Testing, traceability and learning as people work alongside increasingly capable AI.</p>
            </article>
            <article className={styles.arcStep}>
              <span className={styles.arcNo}>08 — ONWARD · ACCOUNTABILITY</span>
              <h3>When may an agent act?</h3>
              <p>Authority, accountability and the conditions that make AI-enabled action legitimate.</p>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.issuesSection} id="published-issues" aria-labelledby="issues-title">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <p className={styles.eyebrow}>Published issues</p>
            <h2 id="issues-title">Explore the conversation.</h2>
            <p>Read each OMNeXa overview or continue to the original LinkedIn edition.</p>
          </div>

          <div className={styles.issueGrid}>
            {issueLinks.map((issue) => (
              <article className={styles.issueCard} id={issue.slug} key={issue.slug}>
                <p className={styles.issueMeta}>{issue.issue}</p>
                <h3>{issue.title}</h3>
                <p>{issue.summary}</p>
                <div className={styles.cardLinks}>
                  <a className={styles.cardLink} href={`/convergence-brief/${issue.slug}`}>
                    Read the issue overview <span aria-hidden="true">→</span>
                  </a>
                  {issue.linkedinUrl ? (
                    <a className={styles.cardLink} href={issue.linkedinUrl} target="_blank" rel="noopener noreferrer">
                      Read on LinkedIn
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.bottomSection}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <p className={styles.eyebrow}>The principles behind the publication</p>
            <h2>Keep human purpose visible as capability grows.</h2>
            <p>
              OMNeXa&apos;s point of view is a work in progress: evidence-led, open to challenge, and clear about the
              difference between current work and broader aspirations.
            </p>
          </div>
          <div className={styles.principles}>
            <article className={styles.principle}>
              <h3>OViA framework</h3>
              <p>Publication-integrity controls that support evidence checks, counter-evidence, risk review and accountable human decisions.</p>
              <a href="/ovia">Explore OViA →</a>
            </article>
            <article className={styles.principle}>
              <h3>Humans defining the loop</h3>
              <p>Human purpose, authority, accountability and escalation are part of how AI systems should be designed.</p>
              <a href="/humans-defining-the-loop">Read the concept →</a>
            </article>
            <article className={styles.principle}>
              <h3>Robotics with human values</h3>
              <p>Explore robotics through human purpose, dignity, safety and responsible interaction.</p>
              <a href="/robotics-with-human-values">Read the concept →</a>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
