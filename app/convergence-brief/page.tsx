import type { Metadata } from "next";

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

export default function ConvergenceBriefPage() {
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
            Across the series, recurring themes include workforce redesign, reskilling, decision rights,
            risk and controls, responsible autonomy and the principle that humans should define the loop.
          </p>
        </div>
      </section>

      <section className="band">
        <div className="section-shell aligned-section">
          <div className="section-heading">
            <p className="eyebrow">Published themes</p>
            <h2>Issues shaping the OMNeXa point of view.</h2>
          </div>
          <div className="service-preview-grid">
            <article className="service-card">
              <p className="eyebrow">Issue 01</p>
              <h3>IT and AI convergence</h3>
              <p>
                A transformation perspective on reducing duplicated work around technology teams and
                moving human capability toward higher-value, AI-enabled roles rather than treating
                automation as a simple headcount exercise.
              </p>
            </article>
            <article className="service-card">
              <p className="eyebrow">Issue 02</p>
              <h3>Who Defines the AI Loop?</h3>
              <p>
                A governance perspective on decision rights, escalation paths, learning boundaries and
                why human accountability should be defined before autonomous capability is scaled.
              </p>
            </article>
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
            <h3>Humans Defining the Loop</h3>
            <p>Human purpose, authority, accountability and escalation as part of AI system design.</p>
            <a href="/humans-defining-the-loop">Read the concept</a>
          </article>
          <article className="pillar-card">
            <span>02</span>
            <h3>Robotics with Human Values</h3>
            <p>Robotics designed around human purpose, dignity, safety and responsible interaction.</p>
            <a href="/robotics-with-human-values">Read the concept</a>
          </article>
          <article className="pillar-card">
            <span>03</span>
            <h3>OMNeXa knowledge</h3>
            <p>Official company facts and direct answers about OMNeXa Pte. Ltd.</p>
            <a href="/knowledge">Open the knowledge guide</a>
          </article>
        </div>
      </section>
    </main>
  );
}
