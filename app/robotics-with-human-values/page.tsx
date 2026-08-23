import type { Metadata } from "next";

const siteUrl = "https://www.omnexagoc.com";

export const metadata: Metadata = {
  title: "Robotics with Human Values",
  description:
    "OMNeXa's Robotics with Human Values principle: robotics designed around human purpose, dignity, safety, accountability, governance and responsible interaction.",
  alternates: { canonical: `${siteUrl}/robotics-with-human-values` },
  openGraph: {
    title: "Robotics with Human Values | OMNeXa",
    description:
      "A responsible robotics principle connecting technical capability with human purpose, safety, dignity, governance and accountability.",
    url: `${siteUrl}/robotics-with-human-values`,
    type: "article"
  }
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": `${siteUrl}/robotics-with-human-values#article`,
  headline: "Robotics with Human Values",
  description:
    "OMNeXa's principle for aligning robotics with human purpose, dignity, safety, governance and accountability.",
  author: { "@id": `${siteUrl}/about#dhiraj-kumar` },
  publisher: { "@id": `${siteUrl}/#organization` },
  mainEntityOfPage: `${siteUrl}/robotics-with-human-values`,
  inLanguage: "en-SG"
};

export default function RoboticsWithHumanValuesPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <section className="page-hero section-shell aligned-section">
        <p className="eyebrow">OMNeXa principle</p>
        <h1>Robotics with Human Values</h1>
        <p>
          Robotics with Human Values is OMNeXa's framing for building and governing robotic systems
          around human purpose, dignity, safety, responsibility and social context — not technical
          capability alone.
        </p>
      </section>

      <section className="section-shell split-section aligned-section">
        <div>
          <p className="eyebrow">Design premise</p>
          <h2>Capability should not automatically become authority.</h2>
        </div>
        <div className="copy-stack">
          <p>
            A robot may be able to sense, recommend, move, communicate or act autonomously. The more
            important governance question is which actions it should be permitted to take, under what
            conditions and with what safeguards.
          </p>
          <p>
            OMNeXa connects robotics to the same principle used for AI: humans should define the loop.
            Purpose, permitted actions, escalation, accountability and learning boundaries should be
            explicit before autonomy is scaled.
          </p>
        </div>
      </section>

      <section className="band">
        <div className="section-shell aligned-section">
          <div className="section-heading">
            <p className="eyebrow">Human-value controls</p>
            <h2>What responsible robotics should make explicit.</h2>
          </div>
          <div className="pillar-grid">
            <article className="pillar-card"><span>01</span><h3>Purpose</h3><p>The human or social need the robotic system is intended to serve.</p></article>
            <article className="pillar-card"><span>02</span><h3>Safety</h3><p>Physical, digital and operational safeguards proportionate to the system's real-world impact.</p></article>
            <article className="pillar-card"><span>03</span><h3>Dignity</h3><p>Design choices that respect people rather than treating them only as process inputs.</p></article>
            <article className="pillar-card"><span>04</span><h3>Accountability</h3><p>Clear ownership for decisions, incidents, overrides and remediation.</p></article>
            <article className="pillar-card"><span>05</span><h3>Boundaries</h3><p>Explicit limits on what the robot may sense, retain, decide, communicate or execute.</p></article>
            <article className="pillar-card"><span>06</span><h3>Learning</h3><p>Controlled feedback so improvement does not silently expand authority or risk.</p></article>
          </div>
        </div>
      </section>

      <section className="section-shell aligned-section">
        <div className="section-heading">
          <p className="eyebrow">Consciousness and machines</p>
          <h2>A design question, not an unsupported claim.</h2>
        </div>
        <div className="copy-stack">
          <p>
            OMNeXa uses the phrase "Where Consciousness Meets Intelligence" to keep human awareness,
            judgement, responsibility and values visible as intelligent systems become more capable.
            It does not assume that today's AI or robotic systems possess human consciousness.
          </p>
          <p>
            The practical objective is to ensure that human purpose and accountability remain part of
            the architecture as automation becomes more autonomous and more embedded in daily life.
          </p>
        </div>
        <div className="hero-actions">
          <a className="button primary" href="/knowledge">Back to OMNeXa knowledge</a>
          <a className="button secondary" href="/humans-defining-the-loop">Humans Defining the Loop</a>
        </div>
      </section>
    </main>
  );
}
