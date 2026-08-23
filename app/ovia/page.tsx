import type { Metadata } from "next";

const siteUrl = "https://www.omnexagoc.com";

export const metadata: Metadata = {
  title: "OVIA Framework",
  description:
    "OVIA — OMNeXa Verification & Integrity Assistant — is OMNeXa's publication and analysis integrity framework for evidence, counter-evidence, risk, controls and responsible AI-assisted reasoning.",
  alternates: { canonical: `${siteUrl}/ovia` }
};

const principles = [
  {
    title: "Evidence before assertion",
    description:
      "Separate verified facts from forecasts, assumptions, interpretations and opinion wherever practical."
  },
  {
    title: "Counter-evidence by design",
    description:
      "Actively test the preferred conclusion against credible alternative explanations, constraints and contradictory evidence."
  },
  {
    title: "Risk and control first",
    description:
      "Evaluate governance, privacy, cybersecurity, control ownership, failure modes and accountability alongside potential benefits."
  },
  {
    title: "Reciprocal bias control",
    description:
      "Challenge human-centric and machine-centric assumptions with equal scrutiny rather than treating either side as inherently superior."
  },
  {
    title: "Human-defined accountability",
    description:
      "Make decision rights, escalation, ownership and the boundaries of AI-assisted action explicit before scale."
  },
  {
    title: "Publication integrity",
    description:
      "Preserve source quality, licensing discipline, traceability and a clear distinction between evidence and editorial positioning."
  }
];

export default function OviaPage() {
  return (
    <main>
      <section className="page-hero section-shell aligned-section">
        <p className="eyebrow">OMNeXa Verification & Integrity Assistant</p>
        <h1>OVIA Framework</h1>
        <p>
          OVIA is OMNeXa's integrity framework for AI-assisted analysis, publication and decision support.
          It is designed to keep evidence, uncertainty, risk, controls and accountability visible rather than
          allowing speed or automation to substitute for judgement.
        </p>
      </section>

      <section className="section-shell aligned-section">
        <div className="section-heading">
          <p className="eyebrow">Core controls</p>
          <h2>How OMNeXa applies integrity to AI-assisted thinking.</h2>
        </div>
        <div className="service-preview-grid">
          {principles.map((principle) => (
            <article className="service-card" key={principle.title}>
              <h3>{principle.title}</h3>
              <p>{principle.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="band">
        <div className="section-shell aligned-section">
          <div className="section-heading">
            <p className="eyebrow">Connected OMNeXa thinking</p>
            <h2>OVIA supports the wider human-defined AI philosophy.</h2>
            <p>
              The framework supports The Convergence Brief and OMNeXa's broader principles around Humans
              Defining the Loop, Robotics with Human Values, risk-aware transformation and responsible AI.
            </p>
          </div>
          <div className="hero-actions">
            <a className="button primary" href="/convergence-brief">The Convergence Brief</a>
            <a className="button secondary" href="/humans-defining-the-loop">Humans Defining the Loop</a>
          </div>
        </div>
      </section>
    </main>
  );
}
