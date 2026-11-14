import type { Metadata } from "next";
import "./ecosystem-collaboration.css";

const partnerPortal = "https://omnexa-career.omnexagoc.com/partners";

export const metadata: Metadata = {
  title: "Ecosystem Collaboration | OMNeXa",
  description: "Explore OMNeXa's grounded approach to future-of-work collaboration and start a partnership conversation through the NeXaCareer Partner Network.",
  alternates: { canonical: "/ecosystem-collaboration" },
  openGraph: {
    title: "Ecosystem Collaboration | OMNeXa",
    description: "Connect complementary capabilities around education, skills, opportunity, well-being and responsible technology.",
    url: "https://www.omnexagoc.com/ecosystem-collaboration",
    type: "website"
  }
};

const collaborationLanes = [
  {
    title: "Education and learner pathways",
    description: "Schools, universities, admissions organisations and counsellors can connect learners with relevant pathways and guidance."
  },
  {
    title: "Skills and training",
    description: "Training providers can help people build capabilities linked to their goals, experience and changing work."
  },
  {
    title: "Jobs and opportunity",
    description: "Employers and opportunity networks can make internships, projects, jobs and early-career routes easier to discover."
  },
  {
    title: "Life, work and well-being",
    description: "Community and well-being organisations can contribute support that recognises the person behind a career journey."
  },
  {
    title: "Responsible technology and Physical AI",
    description: "Technology, AI and robotics partners can help make innovation practical, human-centred and accountable."
  },
  {
    title: "Access and mobility",
    description: "Accommodation, education finance and mobility-support organisations can contribute at relevant points in a learner or work journey."
  }
];

const principles = [
  {
    title: "Start with people and the outcome",
    description: "Define whose journey should improve and what a useful next step looks like before choosing a platform, programme or partnership model."
  },
  {
    title: "Connect complementary strengths",
    description: "Bring together partners for the capabilities each can responsibly contribute. Collaboration should add value on both sides and make hand-offs clear."
  },
  {
    title: "Keep responsibility visible",
    description: "People should understand who provides a service, who makes a decision and where to raise a question. AI can assist work; accountable people remain responsible."
  }
];

const collaborationSteps = [
  { title: "Align", description: "Agree the shared need, intended participants and a practical outcome." },
  { title: "Connect", description: "Map partner roles, service boundaries, locations and hand-offs." },
  { title: "Begin with scope", description: "Shape a focused conversation, programme or proposed pilot with clear responsibilities." },
  { title: "Learn and improve", description: "Review feedback and evidence together before deciding whether or how to extend the work." }
];

export default function EcosystemCollaborationPage() {
  return (
    <main className="ecosystem-page">
      <section className="page-hero section-shell aligned-section ecosystem-hero">
        <p className="eyebrow">Ecosystem collaboration</p>
        <h1>The future of work is a shared design challenge.</h1>
        <p>
          Education, skills, opportunity, technology and well-being increasingly meet in the same human journey.
          OMNeXa believes progress comes from connecting complementary capabilities around people and practical
          outcomes—with clear roles, grounded expectations and human accountability.
        </p>
        <div className="hero-actions">
          <a className="button primary" href={partnerPortal} target="_blank" rel="noopener noreferrer">Explore partnership options</a>
          <a className="button secondary" href="/services">See OMNeXa services</a>
        </div>
        <p className="ecosystem-qualification">This page describes OMNeXa&apos;s approach and invitation to collaborate; it does not imply that a particular partnership or programme has been agreed.</p>
      </section>

      <section className="band ecosystem-belief-band">
        <div className="section-shell aligned-section">
          <div className="section-heading">
            <p className="eyebrow">What we believe</p>
            <h2>Build a connected journey, not another isolated hand-off.</h2>
            <p>Partnerships work best when people can move between learning, capability, opportunity and support with a clearer sense of what happens next.</p>
          </div>
          <div className="service-lead-grid ecosystem-principle-grid">
            {principles.map((principle) => (
              <article className="tilt-card" key={principle.title}>
                <h3>{principle.title}</h3>
                <p>{principle.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell aligned-section ecosystem-lanes-section">
        <div className="section-heading">
          <p className="eyebrow">Where partners can contribute</p>
          <h2>Different strengths. A more connected ecosystem.</h2>
          <p>These are collaboration pathways, not a claim that each programme or partner relationship is already active.</p>
        </div>
        <div className="service-preview-grid ecosystem-lane-grid">
          {collaborationLanes.map((lane) => (
            <article className="service-card tilt-card" key={lane.title}>
              <h3>{lane.title}</h3>
              <p>{lane.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="band ecosystem-method-band">
        <div className="section-shell aligned-section">
          <div className="section-heading">
            <p className="eyebrow">A practical way to collaborate</p>
            <h2>Start with a clear purpose. Learn before scaling.</h2>
          </div>
          <div className="format-grid ecosystem-step-grid">
            {collaborationSteps.map((step, index) => (
              <article className="tilt-card" key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell aligned-section ecosystem-portal-section">
        <div className="ecosystem-portal-card">
          <div>
            <p className="eyebrow">Start a partnership conversation</p>
            <h2>What can your organisation contribute?</h2>
            <p>
              The NeXaCareer Partner Network is the existing route for organisations to describe their services,
              opportunities, training or mobility support. Submissions are reviewed by OMNeXa; a submission is not
              itself an approval or a public partner listing.
            </p>
          </div>
          <div className="ecosystem-portal-actions">
            <a className="button primary" href={partnerPortal} target="_blank" rel="noopener noreferrer">Open the partner portal</a>
            <a className="button secondary" href="/contact">Discuss another collaboration</a>
            <a className="ecosystem-work-link" href="/work">Explore OMNeXa work →</a>
          </div>
        </div>
      </section>
    </main>
  );
}
