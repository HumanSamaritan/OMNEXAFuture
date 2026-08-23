import type { Metadata } from "next";
import { getConvergenceIssues } from "@/lib/publications";

const siteUrl = "https://www.omnexagoc.com";

export const metadata: Metadata = {
  title: "The Convergence Brief",
  description:
    "The Convergence Brief is OMNeXa's thought-leadership series on AI, work, governance, employability, human-machine collaboration and responsible transformation.",
  alternates: { canonical: `${siteUrl}/convergence-brief` },
  openGraph: {
    title: "The Convergence Brief | OMNeXa",
    description:
      "OMNeXa's thought-leadership series on AI, work, governance and human-machine convergence.",
    url: `${siteUrl}/convergence-brief`,
    type: "website"
  }
};

const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${siteUrl}/convergence-brief#collection`,
  name: "The Convergence Brief",
  description:
    "OMNeXa's thought-leadership series exploring AI, work, governance, employability and human-machine convergence.",
  url: `${siteUrl}/convergence-brief`,
  publisher: { "@id": `${siteUrl}/#organization` },
  about: [
    "Artificial intelligence",
    "Human-machine collaboration",
    "AI governance",
    "Employability",
    "Responsible automation"
  ],
  inLanguage: "en-SG"
};

export default async function ConvergenceBriefPage() {
  const issues = await getConvergenceIssues();

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <section className="page-hero section-shell aligned-section">
        <p className="eyebrow">OMNeXa thought leadership</p>
        <h1>The Convergence Brief</h1>
        <p>
          The Convergence Brief examines how AI, work, governance, employability and human-machine
          collaboration are converging — and what leadership must define as intelligent systems scale.
        </p>
      </section>

      <section className="section-shell split-section aligned-section">
        <div>
          <p className="eyebrow">Editorial position</p>
          <h2>Technology capability is only one part of transformation.</h2>
        </div>
        <div className="copy-stack">
          <p>
            OMNeXa separates facts, forecasts, interpretations and opinions wherever practical. The
            objective is not to advocate for humans against machines, or machines against humans, but
            to examine the operating model that creates useful, accountable outcomes.
          </p>
          <p>
            OVIA — the OMNeXa Verification & Integrity Assistant — provides the publication integrity
            controls behind the series, including evidence checks, counter-evidence, risk and controls,
            reciprocal bias review and accountable human decision-making.
          </p>
          <a href="/ovia">Explore the OVIA framework</a>
        </div>
      </section>

      <section className="band">
        <div className="section-shell aligned-section">
          <div className="section-heading">
            <p className="eyebrow">Published issues</p>
            <h2>Issues shaping the OMNeXa point of view.</h2>
            <p>
              This issue list is generated from one shared publication source so the Knowledge and
              Convergence Brief pages stay consistent as the series grows.
            </p>
          </div>
          <div className="publication-grid">
            {issues.map((issue) => (
              <article className="publication-card" id={issue.slug} key={issue.slug}>
                <p className="publication-meta">{issue.issue}</p>
                <h3>{issue.title}</h3>
                <p>{issue.summary}</p>
                <a href={`/convergence-brief/${issue.slug}`}>Read the official issue overview</a>
                {issue.linkedinUrl ? (
                  <a className="secondary-publication-link" href={issue.linkedinUrl} target="_blank" rel="noreferrer">
                    Read on LinkedIn
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell aligned-section">
        <div className="section-heading">
          <p className="eyebrow">Canonical concepts</p>
          <h2>Explore the principles behind the publication.</h2>
        </div>
        <div className="pillar-grid">
          <article className="pillar-card">
            <span>01</span>
            <h3>OVIA Framework</h3>
            <p>Evidence, counter-evidence, risk, controls and integrity checks for AI-assisted analysis.</p>
            <a href="/ovia">Open OVIA</a>
          </article>
          <article className="pillar-card">
            <span>02</span>
            <h3>Humans Defining the Loop</h3>
            <p>Human purpose, authority, accountability and escalation as part of AI system design.</p>
            <a href="/humans-defining-the-loop">Read the concept</a>
          </article>
          <article className="pillar-card">
            <span>03</span>
            <h3>Robotics with Human Values</h3>
            <p>Robotics designed around human purpose, dignity, safety and responsible interaction.</p>
            <a href="/robotics-with-human-values">Read the concept</a>
          </article>
        </div>
      </section>
    </main>
  );
}
