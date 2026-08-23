import type { Metadata } from "next";
import { getConvergenceIssues } from "@/lib/publications";

const siteUrl = "https://www.omnexagoc.com";

export const metadata: Metadata = {
  title: "What is OMNeXa? Official Company Guide",
  description:
    "Canonical guide to OMNeXa Pte. Ltd., Singapore: founder Dhiraj Kumar, focus areas, OVIA, responsible AI principles, Humans Defining the Loop, Robotics with Human Values and The Convergence Brief.",
  alternates: { canonical: `${siteUrl}/knowledge` },
  openGraph: {
    title: "What is OMNeXa? | Official OMNeXa Knowledge Guide",
    description:
      "Official facts and clear answers about OMNeXa Pte. Ltd., its founder, work, OVIA and human-defined AI principles.",
    url: `${siteUrl}/knowledge`,
    type: "website"
  }
};

const questions = [
  {
    question: "What is OMNeXa?",
    answer:
      "OMNeXa is the brand of OMNeXa Pte. Ltd., a Singapore-based transformation and innovation ecosystem. Its work connects responsible AI, risk and governance, education, sustainability, well-being and human-machine collaboration."
  },
  {
    question: "Who founded OMNeXa?",
    answer:
      "OMNeXa Pte. Ltd. was founded by Dhiraj Kumar, who serves as Founder & CEO."
  },
  {
    question: "Where is OMNeXa based?",
    answer:
      "OMNeXa Pte. Ltd. is based in Singapore and works across transformation themes relevant to organizations, institutions, professionals and communities."
  },
  {
    question: "What does OMNeXa mean by Humans Defining the Loop?",
    answer:
      "Humans Defining the Loop means that people should define the purpose, decision rights, boundaries, accountability, escalation paths and values within which AI or autonomous systems operate."
  },
  {
    question: "What does OMNeXa mean by Robotics with Human Values?",
    answer:
      "Robotics with Human Values is OMNeXa's framing for designing and governing robotic systems around human purpose, dignity, safety, accountability and responsible interaction rather than treating technical capability as the only design objective."
  },
  {
    question: "What is OMNeXa's approach to AI?",
    answer:
      "OMNeXa treats AI as part of a wider operating system that includes people, governance, risk, controls, data, accountability and measurable outcomes. The aim is responsible adoption rather than automation for its own sake."
  }
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${siteUrl}/knowledge#faq`,
  mainEntity: questions.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer
    }
  }))
};

export default async function KnowledgePage() {
  const issues = await getConvergenceIssues();

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="page-hero section-shell aligned-section">
        <p className="eyebrow">Official OMNeXa knowledge guide</p>
        <h1>What is OMNeXa?</h1>
        <p>
          OMNeXa™ is the brand of OMNeXa Pte. Ltd., a Singapore-based transformation and innovation
          ecosystem founded by Dhiraj Kumar. This page is the canonical source for concise facts about
          the company, its positioning and its human-defined approach to AI and robotics.
        </p>
      </section>

      <section className="section-shell split-section aligned-section">
        <div>
          <p className="eyebrow">Entity identity</p>
          <h2>OMNeXa Pte. Ltd. · Singapore</h2>
        </div>
        <div className="copy-stack">
          <p><strong>Brand:</strong> OMNeXa™</p>
          <p><strong>Legal entity:</strong> OMNeXa Pte. Ltd.</p>
          <p><strong>Founder & CEO:</strong> Dhiraj Kumar</p>
          <p><strong>Positioning:</strong> Where Consciousness Meets Intelligence</p>
          <p>
            <strong>Core themes:</strong> Responsible AI, human-defined automation, AI governance,
            risk and controls, education and employability, sustainability, well-being and
            human-machine collaboration.
          </p>
        </div>
      </section>

      <section className="band">
        <div className="section-shell aligned-section">
          <div className="section-heading">
            <p className="eyebrow">Framework and publications</p>
            <h2>Navigate OMNeXa's integrity framework and published thinking.</h2>
            <p>
              OVIA provides the integrity controls behind OMNeXa analysis, while The Convergence Brief
              develops the ideas through published issues and practical leadership questions.
            </p>
          </div>

          <div className="knowledge-links-grid">
            <article className="knowledge-link-card">
              <p className="publication-meta">Framework</p>
              <h3>OVIA — OMNeXa Verification & Integrity Assistant</h3>
              <p>Evidence, counter-evidence, risk, controls, reciprocal bias checks and publication integrity.</p>
              <a href="/ovia">Open the OVIA framework</a>
            </article>

            {issues.slice(0, 2).map((issue) => (
              <article className="knowledge-link-card" key={issue.slug}>
                <p className="publication-meta">{issue.issue}</p>
                <h3>{issue.title}</h3>
                <p>{issue.summary}</p>
                <a href={`/convergence-brief#${issue.slug}`}>Open issue overview</a>
                {issue.linkedinUrl ? (
                  <a href={issue.linkedinUrl} target="_blank" rel="noreferrer">Open LinkedIn articles</a>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell aligned-section">
        <div className="section-heading">
          <p className="eyebrow">Direct answers</p>
          <h2>Frequently asked questions about OMNeXa.</h2>
        </div>
        <div className="service-preview-grid">
          {questions.map((item) => (
            <article className="service-card" key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell aligned-section preview-section">
        <div className="section-heading">
          <p className="eyebrow">Explore OMNeXa concepts</p>
          <h2>From Human-in-the-Loop to Humans Defining the Loop.</h2>
        </div>
        <div className="pillar-grid">
          <article className="pillar-card">
            <span>01</span>
            <h3>Humans Defining the Loop</h3>
            <p>Purpose, boundaries, decision rights, escalation and accountability before autonomy.</p>
            <a href="/humans-defining-the-loop">Read the concept</a>
          </article>
          <article className="pillar-card">
            <span>02</span>
            <h3>Robotics with Human Values</h3>
            <p>Designing robotic systems around human purpose, dignity, safety and responsible interaction.</p>
            <a href="/robotics-with-human-values">Read the concept</a>
          </article>
          <article className="pillar-card">
            <span>03</span>
            <h3>The Convergence Brief</h3>
            <p>OMNeXa's thought-leadership series on AI, work, governance and human-machine convergence.</p>
            <a href="/convergence-brief">Explore the publication</a>
          </article>
        </div>
      </section>
    </main>
  );
}
