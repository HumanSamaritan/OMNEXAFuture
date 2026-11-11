import type { Metadata } from "next";
import Image from "next/image";
import styles from "./home-updates.module.css";
import VideoPoster from "@/components/VideoPoster";
import ImageLightbox from "@/components/ImageLightbox";
import { services, testimonials } from "@/lib/site-data";

export const revalidate = 3600;

export const metadata: Metadata = {
  alternates: { canonical: "/" }
};

const focusAreas = [
  { index: "01", title: "AI strategy & governance", description: "Prioritise practical use cases, clarify human decision rights and plan responsible AI adoption.", href: "/ai-readiness" },
  { index: "02", title: "Banking, risk & controls", description: "Connect banking transformation, financial-crime controls and operating-model change with clear accountability.", href: "/services#banking-transformation-risk-control" },
  { index: "03", title: "Physical AI & robotics", description: "Explore robotics education, future skills and responsible physical AI, including student outreach in Rourkela and Bhubaneswar, Odisha.", href: "/india/odisha/robotics" },
  { index: "04", title: "Sustainability & ESG", description: "Turn sustainability priorities into employee engagement, practical action plans and meaningful measures of progress.", href: "/services#sustainability-esg-corporate-alignment" },
  { index: "05", title: "Human-centred transformation", description: "Design change around people, connecting education, employability, leadership and human judgement with technology.", href: "/humans-defining-the-loop" },
  { index: "06", title: "Wellbeing & conscious leadership", description: "Support reflection, resilience and everyday wellbeing through conscious leadership and human-centred learning initiatives.", href: "/services#well-being-conscious-leadership" }
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
  dateModified: "2026-11-07"
};

export default function Home() {
  const today = new Date();
  const seasonal = today >= new Date("2026-11-01T00:00:00+05:30") && today < new Date("2026-11-21T00:00:00+05:30");
  const featured = seasonal ? { slug: "deepavali-human-ai-collaboration", id: "sIL8hvR5WLI", title: "Deepavali — Human + AI Collaboration", length: "11 seconds" } : { slug: "everyday-life-challenges", id: "IOF-natDy8g", title: "Human + Machine Sadhana — Everyday Life Challenges", length: "40 seconds" };
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageSchema) }}
      />
      <section className="section-shell home-hero">
        <div className="home-hero-copy">
          <p className="eyebrow">OMNeXa Pte. Ltd. · Singapore · Global perspective</p>
          <h1>AI and robotics. Guided by human purpose.</h1>
          <p className="hero-copy">
            Strategy and transformation advisory connecting responsible AI and robotics, banking and risk, sustainability, human capability and wellbeing. Define your opportunity, design the right controls and move forward with a practical plan.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="/consultancy">Explore consultancy →</a>
            <a className="button secondary" href="/services">Explore services</a>
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
          <p className="eyebrow">Our consulting pillars</p>
          <h2>Integrated expertise for human-centred transformation.</h2>
          <p>Connecting AI and robotics, banking and risk, sustainability, human capability and wellbeing to help organisations move from strategy to implementation.</p>
        </div>
        <div className="home-focus-grid">
          {focusAreas.map((area) => (
            <article key={area.index}>
              <span className="focus-index">{area.index}</span>
              <h3>{area.title}</h3>
              <p>{area.description}</p><a href={area.href}>Explore this focus →</a>
            </article>
          ))}
        </div>
      </section>

      <section className={`section-shell aligned-section ${styles.latest}`} aria-labelledby="latest-title">
        <div className={styles.sectionTop}>
          <div><p className="eyebrow">Latest from OMNeXa</p><h2 id="latest-title">Ideas into everyday action.</h2></div>
          <a href="/videos">Explore all videos →</a>
        </div>
        <div className={styles.updatesGrid}>
          <article className={styles.feature}>
            <div className={styles.featureCopy}>
              <p className="eyebrow">{seasonal ? "Deepavali 2026 · Featured story" : "Human + AI · Featured story"}</p>
              <h3>{seasonal ? "Light up new possibilities." : "Human purpose. Intelligent possibilities."}</h3>
              <p>Human judgement and responsible AI can work together to open new pathways in learning, skills and work. Discover the OMNeXa approach to collaboration.</p>
              <a className="button primary" href={`/videos/${featured.slug}`}>Watch the film →</a>
            </div>
            <a className={styles.filmLink} href={`/videos/${featured.slug}`} aria-label={`Watch ${featured.title}`}>
              <VideoPoster id={featured.id} title={featured.title} />
              <span>▶ Watch the film · {featured.length}</span>
            </a>
          </article>
          <aside className={styles.alongside} aria-label="More from OMNeXa">
            <article><p className="eyebrow">Learn & build</p><h3>Physical AI. Human values.</h3><p>A proposed robotics learning initiative for students, families, educators and creators.</p><a href="https://omnexa-career.omnexagoc.com/physical-ai-robots">Explore the initiative →</a></article>
            <article><p className="eyebrow">Reflect & grow</p><h3>A more conscious everyday life.</h3><p>Explore Human + Machine Sadhana, NeXaVirama and NeXaKriya.</p><a href="/videos#human-machine-sadhana">Discover the video collection →</a></article>
          </aside>
        </div>
      </section>

      <section className="section-shell aligned-section preview-section">
        <div className="section-heading"><p className="eyebrow">How we work</p><h2>Clarity first. A defined next step.</h2><p>Every engagement starts with the problem, the people affected and the boundaries that matter. Scope and deliverables are agreed before work begins.</p></div>
        <div className="service-preview-grid"><article className="service-card"><p className="eyebrow">01 · Discover</p><h3>Understand the challenge.</h3><p>Discuss your context, goals, constraints and decision needs.</p></article><article className="service-card"><p className="eyebrow">02 · Define</p><h3>Agree the right scope.</h3><p>Set priorities, responsibilities and practical outputs for the engagement.</p></article><article className="service-card"><p className="eyebrow">03 · Move forward</p><h3>Make the next decision.</h3><p>Use a focused assessment, advisory session or learning plan to guide action.</p></article></div>
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
          <p className="eyebrow">Leadership & experience</p>
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
      <section className={`section-shell aligned-section ${styles.closing}`}>
        <p className="eyebrow">Your next step</p><h2>Bring a challenge. Build a way forward.</h2>
        <p>Explore consultancy for a focused problem, discover our products, or start a conversation about education, health and wellness, Physical AI or robotics collaboration.</p>
        <div className="hero-actions"><a className="button primary" href="/consultancy">Explore consultancy →</a><a className="button secondary" href="/contact">Discuss a collaboration →</a></div>
      </section>
    </main>
  );
}
