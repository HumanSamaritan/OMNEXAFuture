import type { Metadata } from "next";

const siteUrl = "https://www.omnexagoc.com";

export const metadata: Metadata = {
  title: "Humans Defining the Loop",
  description:
    "OMNeXa's Humans Defining the Loop principle: people define purpose, boundaries, decision rights, accountability and escalation for AI and autonomous systems.",
  alternates: { canonical: `${siteUrl}/humans-defining-the-loop` },
  openGraph: {
    title: "Humans Defining the Loop | OMNeXa",
    description:
      "A human-defined AI principle focused on purpose, boundaries, accountability, escalation and responsible autonomy.",
    url: `${siteUrl}/humans-defining-the-loop`,
    type: "article"
  }
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": `${siteUrl}/humans-defining-the-loop#article`,
  headline: "Humans Defining the Loop",
  description:
    "OMNeXa's principle that humans should define the purpose, boundaries, accountability and escalation rules within which AI and autonomous systems operate.",
  author: { "@id": `${siteUrl}/dhiraj-kumar#person` },
  publisher: { "@id": `${siteUrl}/#organization` },
  mainEntityOfPage: `${siteUrl}/humans-defining-the-loop`,
  inLanguage: "en-SG"
};

export default function HumansDefiningTheLoopPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <section className="page-hero section-shell aligned-section">
        <p className="eyebrow">OMNeXa principle</p>
        <h1>Humans Defining the Loop</h1>
        <p>
          Human-in-the-loop asks where a person should intervene. Humans Defining the Loop asks an
          earlier and broader question: who defines the purpose, boundaries, authority, accountability
          and escalation rules within which an intelligent system is allowed to act?
        </p>
      </section>

      <section className="section-shell split-section aligned-section">
        <div>
          <p className="eyebrow">The distinction</p>
          <h2>Human oversight is not the same as human-defined design.</h2>
        </div>
        <div className="copy-stack">
          <p>
            A system can include human review and still be built around poorly defined objectives,
            unclear decision rights or weak escalation paths. OMNeXa therefore treats human oversight
            as one control within a wider governance design.
          </p>
          <p>
            The loop should begin with explicit human choices about what the system is trying to achieve,
            what it may decide, what it must never decide alone, what evidence it can rely on and who
            remains accountable for the outcome.
          </p>
        </div>
      </section>

      <section className="band">
        <div className="section-shell aligned-section">
          <div className="section-heading">
            <p className="eyebrow">Five design questions</p>
            <h2>What leadership should define before autonomy scales.</h2>
          </div>
          <div className="pillar-grid">
            <article className="pillar-card"><span>01</span><h3>Purpose</h3><p>What outcome is the system intended to create, and for whom?</p></article>
            <article className="pillar-card"><span>02</span><h3>Boundaries</h3><p>Which decisions may be automated, and which remain outside the system's authority?</p></article>
            <article className="pillar-card"><span>03</span><h3>Decision rights</h3><p>When may AI recommend, execute, pause or request human approval?</p></article>
            <article className="pillar-card"><span>04</span><h3>Accountability</h3><p>Who owns the outcome when machine recommendations influence a real-world decision?</p></article>
            <article className="pillar-card"><span>05</span><h3>Escalation and learning</h3><p>How are uncertainty, exceptions, errors and feedback routed back into the operating model?</p></article>
          </div>
        </div>
      </section>

      <section className="section-shell aligned-section">
        <div className="section-heading">
          <p className="eyebrow">Why it matters</p>
          <h2>AI capability and AI authority are different things.</h2>
        </div>
        <div className="copy-stack">
          <p>
            A model may be technically capable of taking an action without that action being appropriate,
            permitted or desirable. Responsible AI therefore requires leadership to define operating
            boundaries alongside technical capability.
          </p>
          <p>
            This framing is relevant to agentic AI, payments, customer operations, financial crime,
            education, robotics and other environments where automated decisions can affect people,
            assets or regulated processes.
          </p>
        </div>
        <div className="hero-actions">
          <a className="button primary" href="/knowledge">Back to OMNeXa knowledge</a>
          <a className="button secondary" href="/robotics-with-human-values">Robotics with Human Values</a>
        </div>
      </section>
    </main>
  );
}
