import type { Metadata } from "next";
import { getConvergenceIssues } from "@/lib/publications";
import "./convergence-brief.css";

const siteUrl = "https://www.omnexagoc.com";

export const metadata: Metadata = {
  title: "The Convergence Brief | AI, Human Agency & Future of Work",
  description:
    "Evidence-led OMNeXa perspectives connecting AI, human agency, future of work, human capability, governance, assurance and responsible transformation.",
  keywords: [
    "agentic AI",
    "AI testing",
    "testing AI agents",
    "quality engineering",
    "AI assurance",
    "defect prevention",
    "AI quality control",
    "requirement traceability",
    "human-agent traceability",
    "AI governance",
    "human-machine collaboration",
    "agentic AI interface",
    "human agency",
    "human authority",
    "AI product engineering",
    "agent interoperability",
    "human AI partnership",
    "AI future of work",
    "human capability",
    "AI transition",
    "AI transformation",
    "workplace learning"
  ],
  alternates: { canonical: `${siteUrl}/convergence-brief` },
  openGraph: {
    title: "The Convergence Brief | OMNeXa",
    description:
      "Evidence-led OMNeXa perspectives on AI, human agency, future of work, human capability and responsible transformation — Where Consciousness Meets Intelligence.",
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
      "An evidence-led OMNeXa publication connecting AI, human agency, future of work, human capability, governance, assurance and responsible transformation.",
    url: `${siteUrl}/convergence-brief`,
    publisher: { "@id": `${siteUrl}/#organization` },
    about: [
      "Artificial intelligence",
      "Agentic AI",
      "AI testing",
      "Quality Engineering",
      "AI assurance",
      "Defect prevention",
      "Requirement traceability",
      "Human-agent traceability",
      "AI governance",
      "Agentic interfaces",
      "Human-machine collaboration",
      "Human agency",
      "Human authority",
      "AI product engineering",
      "Agent interoperability",
      "Human-AI partnership",
      "Future of work",
      "Human capability",
      "AI transition",
      "Workplace learning"
    ],
    hasPart: issues.map((issue) => ({
      "@type": "Article",
      "@id": `${siteUrl}/convergence-brief/${issue.slug}#article`,
      name: issue.title,
      url: `${siteUrl}/convergence-brief/${issue.slug}`
    })),
    inLanguage: "en-SG"
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <section className="cb-hero">
        <div className="section-shell cb-hero-inner">
          <div className="cb-hero-copy">
            <p className="eyebrow">OMNeXa thought leadership</p>
            <h1>The Convergence Brief</h1>
            <p className="cb-lede">
              Practical perspectives on how AI is changing work, decisions and human capability.
            </p>
            <p className="cb-intro">
              Grounded in questions emerging as OMNeXa builds AI products, this series connects
              architecture, human agency, decision rights, experience, engineering and accountable
              agentic AI.
            </p>
            <a className="cb-text-link" href="#published-issues">Explore the issues <span aria-hidden="true">↓</span></a>
          </div>
          <aside className="cb-principle">
            <span className="cb-principle-label">The OMNeXa principle</span>
            <p><strong>Where Consciousness Meets Intelligence</strong></p>
            <p>Human purpose, exploration and advancement belong in the transformation as intelligent systems expand what people and organisations can do.</p>
          </aside>
        </div>
      </section>

      <section className="section-shell cb-journey">
        <div className="cb-journey-heading">
          <p className="eyebrow">The journey so far</p>
          <h2>From AI capability to the future of human capability.</h2>
          <p>Eight connected questions trace the changing relationship between people and intelligent systems.</p>
        </div>
        <div className="cb-issue-journey">
          <article><span>01</span><h3>Two technology universes</h3><p>Are organisations duplicating effort across traditional and AI delivery?</p></article>
          <article><span>02</span><h3>Decision rights</h3><p>Who defines the AI loop, its purpose and its limits?</p></article>
          <article><span>03</span><h3>Experience beyond screens</h3><p>What changes when the interface is no longer the product?</p></article>
          <article><span>04</span><h3>Intent through testing</h3><p>How can teams trace intent through assurance and agent execution?</p></article>
          <article><span>05</span><h3>Authority across boundaries</h3><p>How does human authority travel as agents coordinate an outcome?</p></article>
          <article><span>06</span><h3>Learning through work</h3><p>How do people build judgement when AI performs more of the work?</p></article>
          <article><span>07</span><h3>The learning divide</h3><p>Does AI strengthen independent understanding or replace learning?</p></article>
          <article><span>08</span><h3>Legitimate agent action</h3><p>Why does technical access alone not grant authority to decide or act?</p></article>
        </div>
        <div className="cb-integrity-note">
          <div>
            <p className="eyebrow">Publication integrity</p>
            <h3>Ideas shaped by practice, checked with care.</h3>
          </div>
          <div>
            <p>The issues grow from practical questions and design choices in OMNeXa's product-creation journey, then examine what may apply more broadly. OVIA supports the series with evidence checks, counter-evidence, risk and control review, prior-art review and accountable human decisions.</p>
            <a href="/ovia">Explore the OVIA framework <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="section-shell aligned-section">
          <div className="section-heading">
            <p className="eyebrow">Published issues</p>
            <h2>Issues shaping the OMNeXa point of view.</h2>
            <p>
              Each issue has an official OMNeXa overview with machine-readable metadata and a link to the
              corresponding LinkedIn publication. Latest issues are shown first.
            </p>
          </div>
          <div className="publication-grid">
            {[...issues].reverse().map((issue) => (
              <article className="publication-card" id={issue.slug} key={issue.slug}>
                <p className="publication-meta">{issue.issue}</p>
                <h3>{issue.title}</h3>
                {issue.subtitle ? <p><strong>{issue.subtitle}</strong></p> : null}
                <p>{issue.summary}</p>
                <a href={`/convergence-brief/${issue.slug}`}>Read the official issue overview</a>
                {issue.linkedinUrl ? (
                  <a className="secondary-publication-link" href={issue.linkedinUrl} target="_blank" rel="noreferrer">
                    Read the published LinkedIn edition
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell aligned-section">
        <div className="section-heading">
          <p className="eyebrow">Current engineering lens</p>
          <h2>AI testing now extends beyond checking an output.</h2>
          <p>
            Issue 04 examines a practical testing and Quality Engineering question: when agents interpret,
            delegate and act, how do we trace human intent through agent hand-offs, verify the resulting
            business state, identify where defects entered and prevent recurrence?
          </p>
        </div>
        <div className="pillar-grid">
          <article className="pillar-card">
            <span>01</span>
            <h3>AI testing & Quality Engineering</h3>
            <p>Functional correctness remains foundational, while interpretation, delegation and outcome become additional test surfaces.</p>
            <a href="/convergence-brief/issue-04">Explore Issue 04</a>
          </article>
          <article className="pillar-card">
            <span>02</span>
            <h3>Requirement traceability</h3>
            <p>Follow requirement meaning across human-agent and agent-to-agent transitions instead of ending the trace at the test case.</p>
            <a href="/convergence-brief/issue-04">Read the traceability perspective</a>
          </article>
          <article className="pillar-card">
            <span>03</span>
            <h3>Defect prevention & assurance</h3>
            <p>Ask where intent, evidence, authority or execution diverged — then change the control that allowed recurrence.</p>
            <a href="/convergence-brief/issue-04">Read the defect-prevention perspective</a>
          </article>
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
