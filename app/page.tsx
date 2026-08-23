import ImageLightbox from "@/components/ImageLightbox";
import { services, testimonials } from "@/lib/site-data";

const focusAreas = [
  {
    index: "01",
    title: "AI, technology & transformation",
    description:
      "Human-defined AI, responsible automation, technology leadership and transformation programs designed with governance, security, privacy and accountability from the start."
  },
  {
    index: "02",
    title: "Banking, risk & controls",
    description:
      "Functional banking and technology leadership across payments, client onboarding, financial crime, risk, controls, compliance reporting and complex multi-market change."
  },
  {
    index: "03",
    title: "Human capability & sustainable progress",
    description:
      "Education, employability, leadership, sustainability and well-being initiatives that use technology to strengthen human capability rather than simply remove work."
  }
];

export default function Home() {
  return (
    <main>
      <section className="section-shell home-hero">
        <div className="home-hero-copy">
          <p className="eyebrow">OMNeXa Pte. Ltd. · Singapore · Global</p>
          <h1>Human-centred AI. Risk-aware transformation. Leadership for what comes next.</h1>
          <p className="hero-copy">
            OMNeXa™ brings together enterprise technology, banking and risk leadership, responsible AI,
            and human capability to help organisations turn transformation ideas into governed,
            executable outcomes.
          </p>
          <p className="hero-copy">
            We focus on the choices around AI: what should be automated, what should remain human-led,
            how accountability is retained, and how released capacity is redirected into higher-value work.
            This is the progression from Human-in-the-Loop to Humans Defining the Loop.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="/knowledge">Explore OMNeXa</a>
            <a className="button secondary" href="/contact">Start a conversation</a>
          </div>
        </div>

        <div className="home-hero-visual" aria-label="OMNeXa brand visual">
          <ImageLightbox
            src="/omnexa-driver-home.jpg"
            alt="OMNeXa visual representing human capability, artificial intelligence and robotics guided by human values"
          />
        </div>
      </section>

      <section className="section-shell aligned-section home-first-section">
        <div className="section-heading">
          <p className="eyebrow">What OMNeXa brings together</p>
          <h2>Three lenses. One transformation mindset.</h2>
          <p>
            The differentiator is not technology alone. It is the ability to connect technology decisions
            with business outcomes, controls, people, operating models and long-term human value.
          </p>
        </div>
        <div className="home-focus-grid">
          {focusAreas.map((area) => (
            <article key={area.index}>
              <span className="focus-index">{area.index}</span>
              <h3>{area.title}</h3>
              <p>{area.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell split-section aligned-section">
        <div>
          <p className="eyebrow">Why OMNeXa</p>
          <h2>Design the transformation around the outcome — not around the tool.</h2>
        </div>
        <div className="copy-stack">
          <p>
            AI disruption, regulatory pressure, changing customer journeys, workforce transition and
            sustainability are converging. Treating them as separate programs often creates duplicated
            effort and fragmented accountability.
          </p>
          <p>
            OMNeXa approaches transformation with risk, control, privacy, cybersecurity, leadership and
            human adoption considered from the beginning — while keeping the operating model practical enough to execute.
          </p>
        </div>
      </section>

      <section className="band">
        <div className="section-shell aligned-section">
          <div className="section-heading">
            <p className="eyebrow">Ideas that define the work</p>
            <h2>Understand the philosophy behind OMNeXa.</h2>
          </div>
          <div className="pillar-grid">
            <article className="pillar-card">
              <span>01</span>
              <h3>What is OMNeXa?</h3>
              <p>Official company identity, founder, focus areas and the practical problems OMNeXa is designed to address.</p>
              <a href="/knowledge">Read the knowledge guide</a>
            </article>
            <article className="pillar-card">
              <span>02</span>
              <h3>Humans Defining the Loop</h3>
              <p>Purpose, decision rights, boundaries, escalation and accountability should be defined before autonomy scales.</p>
              <a href="/humans-defining-the-loop">Explore the principle</a>
            </article>
            <article className="pillar-card">
              <span>03</span>
              <h3>Robotics with Human Values</h3>
              <p>Physical and digital intelligence should remain anchored to dignity, safety, traceability and human responsibility.</p>
              <a href="/robotics-with-human-values">Explore the principle</a>
            </article>
            <article className="pillar-card">
              <span>04</span>
              <h3>The Convergence Brief</h3>
              <p>OMNeXa's thought-leadership series on AI, work, governance, employability and human-machine convergence.</p>
              <a href="/convergence-brief">Explore the publication</a>
            </article>
          </div>
        </div>
      </section>

      <section className="section-shell preview-section aligned-section">
        <div className="section-heading">
          <p className="eyebrow">Ways to engage</p>
          <h2>Advisory, workshops and transformation programs that can start focused and scale.</h2>
        </div>
        <div className="service-preview-grid">
          {services.slice(0, 3).map((service) => (
            <article className="service-card" key={service.title}>
              <p className="eyebrow">{service.eyebrow}</p>
              <h3>{service.title}</h3>
              <p>{service.summary}</p>
            </article>
          ))}
        </div>
        <div className="hero-actions">
          <a className="button primary" href="/services">Explore services</a>
        </div>
      </section>

      <section className="section-shell testimonials-section aligned-section">
        <div className="section-heading">
          <p className="eyebrow">Leadership signals</p>
          <h2>What colleagues and leaders have valued.</h2>
        </div>
        <div className="testimonial-grid">
          {testimonials.map((testimonial) => (
            <figure key={testimonial.quote}>
              <blockquote>"{testimonial.quote}"</blockquote>
              <figcaption>{testimonial.author}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </main>
  );
}
