import type { Metadata } from "next";
import { getConvergenceIssues } from "@/lib/publications";

const siteUrl = "https://www.omnexagoc.com";

export const metadata: Metadata = {
  title: "The Convergence Brief | Agentic AI, Human Agency & Transformation",
  description:
    "OMNeXa's Convergence Brief turns practical AI product-building lessons into perspectives on agentic AI, human agency, governance, experience, engineering, assurance and human-machine advancement.",
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
    "human AI partnership"
  ],
  alternates: { canonical: `${siteUrl}/convergence-brief` },
  openGraph: {
    title: "The Convergence Brief | OMNeXa",
    description:
      "Practical OMNeXa lessons on agentic AI, human agency, governance, experience, engineering and human-machine advancement — Where Consciousness Meets Intelligence.",
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
      "OMNeXa's practical learning series connecting agentic AI product-building lessons with human agency, governance, experience, engineering and human-machine advancement.",
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
      "Human-AI partnership"
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

      <section className="page-hero section-shell aligned-section">
        <p className="eyebrow">OMNeXa thought leadership</p>
        <h1>The Convergence Brief</h1>
        <p>
          The Convergence Brief turns questions encountered while OMNeXa builds AI products into practical
          perspectives for the wider industry — connecting architecture, human agency, decision rights,
          experience, engineering, assurance and accountable agentic AI.
        </p>
        <p>
          <strong>Where Consciousness Meets Intelligence:</strong> human purpose, exploration and advancement
          remain part of the transformation while intelligent systems expand what people and organisations can do.
        </p>
      </section>

      <section className="section-shell split-section aligned-section">
        <div>
          <p className="eyebrow">The journey so far</p>
          <h2>From AI capability to the operating loop around it.</h2>
        </div>
        <div className="copy-stack">
          <p>
            <strong>Issue 01</strong> asks whether organisations are building a parallel AI technology universe.{" "}
            <strong>Issue 02</strong> moves to decision rights and who defines the AI loop.{" "}
            <strong>Issue 03</strong> turns to experience when the screen stops being the product.{" "}
            <strong>Issue 04</strong> follows human intent through testing, assurance, traceability and defect prevention.{" "}
            <strong>Issue 05</strong> follows that authority across organisational boundaries as multiple agents and providers coordinate an outcome.
          </p>
          <p>
            The issues are not intended as abstract predictions. They are shaped by practical questions, design
            choices and lessons emerging from OMNeXa&apos;s own AI product-creation journey, then tested as
            potential lessons and ways forward for broader industry practice.
          </p>
          <p>
            The connecting principle is not simply &quot;human first&quot;. It is preserving <strong>human agency,
            exploration and advancement</strong> while building a productive partnership with an increasingly
            agentic AI universe — the practical path behind OMNeXa&apos;s <strong>Where Consciousness Meets Intelligence</strong>.
          </p>
          <p>
            OVIA — the OMNeXa Verification & Integrity Assistant — provides publication-integrity controls
            behind the series, including evidence checks, counter-evidence, risk and controls, prior-art
            review and accountable human decision-making.
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
