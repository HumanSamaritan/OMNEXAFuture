import { aiPrinciples, proofPoints } from "@/lib/site-data";

export default function AiReadinessPage() {
  return (
    <main>
      <section className="page-hero section-shell">
        <p className="eyebrow">Human + AI readiness</p>
        <h1>Technology should amplify human values, not replace human purpose.</h1>
        <p>
          OMNeXa helps partners identify responsible AI use cases, prepare workforces for intelligent
          systems, and build governance-aware pilots for education, sustainability, inclusion and productivity.
        </p>
      </section>

      <section className="section-shell ai-grid">
        {aiPrinciples.map((principle) => (
          <article className="principle-card" key={principle.title}>
            <h2>{principle.title}</h2>
            <p>{principle.description}</p>
          </article>
        ))}
      </section>

      <section className="band">
        <div className="section-shell split-section">
          <div>
            <p className="eyebrow">Proof of readiness</p>
            <h2>Transformation needs both governance and human adoption.</h2>
          </div>
          <ul className="check-list">
            {proofPoints.map((point) => <li key={point}>{point}</li>)}
          </ul>
        </div>
      </section>
    </main>
  );
}
