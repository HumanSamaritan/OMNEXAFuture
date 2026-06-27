import { proofPoints } from "@/lib/site-data";

export default function AboutPage() {
  return (
    <main>
      <section className="page-hero section-shell">
        <p className="eyebrow">Founder profile</p>
        <h1>About Dhiraj Kumar and OMNeXa.</h1>
        <p>
          Dhiraj Kumar is Founder / Advisor at OMNeXa Pte. Ltd., bringing together financial-crime
          execution depth, sustainability thinking, AI-era readiness and human-centered leadership.
        </p>
      </section>

      <section className="section-shell about-layout">
        <div className="founder-badge">DK</div>
        <div className="copy-stack">
          <h2>Experience across risk, technology, education and conscious leadership.</h2>
          <p>
            His experience spans AML/KYC, sanctions, governance, control design, remediation,
            regulatory exam support, technology and workflow transformation, ESG engagement,
            education mentoring and ecosystem collaboration.
          </p>
          <p>
            OMNeXa exists to turn that cross-domain experience into practical guidance for people and
            organizations preparing for a more intelligent, regulated, sustainability-aware future.
          </p>
        </div>
      </section>

      <section className="section-shell proof-section">
        <div className="section-heading centered">
          <p className="eyebrow">What anchors the work</p>
          <h2>Execution depth with a human-centered lens.</h2>
        </div>
        <ul className="proof-grid">
          {proofPoints.map((point) => <li key={point}>{point}</li>)}
        </ul>
      </section>
    </main>
  );
}
