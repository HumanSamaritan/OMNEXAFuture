import type { Metadata } from "next";
import Image from "next/image";
import ImageLightbox from "@/components/ImageLightbox";
import { services, testimonials } from "@/lib/site-data";

export const metadata: Metadata = {
  alternates: { canonical: "/" }
};

const focusAreas = [
  {
    index: "01",
    title: "AI, technology & transformation",
    description: "Responsible AI, automation and transformation built with governance from the start."
  },
  {
    index: "02",
    title: "Banking, risk & controls",
    description: "Payments, onboarding, financial crime, controls and multi-market change."
  },
  {
    index: "03",
    title: "Human capability & sustainable progress",
    description: "Education, employability, leadership, sustainability and well-being."
  }
];

const homePageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://www.omnexagoc.com/#webpage",
  url: "https://www.omnexagoc.com/",
  name: "OMNeXa Pte. Ltd. | Where Consciousness Meets Intelligence",
  description:
    "Official website of OMNeXa Pte. Ltd., a Singapore-based transformation and innovation company founded by Dhiraj Kumar.",
  isPartOf: { "@id": "https://www.omnexagoc.com/#website" },
  about: { "@id": "https://www.omnexagoc.com/#organization" },
  primaryImageOfPage: { "@id": "https://www.omnexagoc.com/#primary-image" },
  inLanguage: "en-SG",
  dateModified: "2026-09-16"
};

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageSchema) }}
      />
      <section className="section-shell home-hero">
        <div className="home-hero-copy">
          <p className="eyebrow">OMNeXa Pte. Ltd. · Singapore · Global</p>
          <h1>Human-centred AI. Risk-aware transformation. Leadership for what comes next.</h1>
          <p className="hero-copy">
            OMNeXa™ connects responsible AI, enterprise transformation, banking and risk, and human capability
            to turn complex change into practical, governed outcomes.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="/work">Explore our work</a>
            <a className="button secondary" href="/connect">Book a conversation</a>
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
          <p>Technology, business, controls and people — designed as one system.</p>
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
          <h2>Design around the outcome — not the tool.</h2>
        </div>
        <div className="copy-stack">
          <p>
            OMNeXa brings AI, risk, privacy, cybersecurity, operating models and human adoption together from
            the beginning, so transformation stays practical and accountable.
          </p>
        </div>
      </section>

      <section className="section-shell company-founder-callout aligned-section">
        <figure>
          <Image
            src="/dhiraj-founder.png"
            alt="Dhiraj Kumar, Founder and CEO of OMNeXa Pte. Ltd. in Singapore"
            width={1254}
            height={1254}
            sizes="(max-width: 760px) 42vw, 190px"
          />
        </figure>
        <div>
          <p className="eyebrow">Founder-led transformation</p>
          <h2>Dhiraj Kumar connects banking depth, technology leadership and governance-first AI.</h2>
          <p>Experience across banking technology, payments, financial crime, risk, controls and global transformation.</p>
          <a href="/dhiraj-kumar">Founder profile</a>
        </div>
      </section>

      <section className="band">
        <div className="section-shell aligned-section">
          <div className="section-heading">
            <p className="eyebrow">Ideas that define the work</p>
            <h2>Explore the thinking behind OMNeXa.</h2>
          </div>
          <div className="pillar-grid">
            <article className="pillar-card">
              <span>01</span>
              <h3>What is OMNeXa?</h3>
              <p>Company identity, focus and practical purpose.</p>
              <a href="/knowledge">Knowledge guide</a>
            </article>
            <article className="pillar-card">
              <span>02</span>
              <h3>Humans Defining the Loop</h3>
              <p>Keep purpose, boundaries and accountability human-defined.</p>
              <a href="/humans-defining-the-loop">Explore the principle</a>
            </article>
            <article className="pillar-card">
              <span>03</span>
              <h3>Robotics with Human Values</h3>
              <p>Anchor intelligence to dignity, safety and responsibility.</p>
              <a href="/robotics-with-human-values">Explore the principle</a>
            </article>
            <article className="pillar-card">
              <span>04</span>
              <h3>The Convergence Brief</h3>
              <p>AI, work, governance and human-machine convergence.</p>
              <a href="/convergence-brief">Explore the publication</a>
            </article>
          </div>
        </div>
      </section>

      <section className="section-shell preview-section aligned-section">
        <div className="section-heading">
          <p className="eyebrow">Ways to engage</p>
          <h2>Start focused. Scale what works.</h2>
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
