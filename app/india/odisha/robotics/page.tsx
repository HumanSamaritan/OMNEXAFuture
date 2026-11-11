import type { Metadata } from "next";

const base = "https://www.omnexagoc.com";
const registration = "https://omnexa-career.omnexagoc.com/physical-ai-robots";

export const metadata: Metadata = {
  title: "Robotics & Physical AI in Odisha | Rourkela and Bhubaneswar",
  description: "Explore OMNeXa's proposed student robotics and human-centred Physical AI initiative in Rourkela and Bhubaneswar, Odisha. Learn about the programme and register interest for verified details.",
  alternates: { canonical: "/india/odisha/robotics" },
  openGraph: {
    title: "Odisha Robotics & Physical AI | OMNeXa",
    description: "An OMNeXa student-focused robotics and responsible AI learning initiative for Rourkela and Bhubaneswar. Explore the programme and register interest.",
    url: `${base}/india/odisha/robotics`,
    type: "website",
    images: [{ url: "/omnexa-logo.png", alt: "OMNeXa official logo — Where Consciousness Meets Intelligence" }]
  }
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${base}/india/odisha/robotics#webpage`,
  url: `${base}/india/odisha/robotics`,
  name: "Robotics and Physical AI learning in Odisha | OMNeXa",
  description: "Student-focused robotics and human-centred AI initiative for Rourkela and Bhubaneswar.",
  inLanguage: "en-IN",
  isPartOf: { "@id": `${base}/#website` },
  about: { "@id": `${base}/#organization` },
  spatialCoverage: [
    { "@type": "Place", name: "Rourkela, Odisha, India" },
    { "@type": "Place", name: "Bhubaneswar, Odisha, India" }
  ]
};

export default function OdishaRoboticsPage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <section className="page-hero section-shell aligned-section">
        <p className="eyebrow">OMNeXa India · Odisha · Student learning</p>
        <h1>Explore robotics and Physical AI in Odisha.</h1>
        <p>
          OMNeXa is developing a student-focused introduction to robotics and human-centred AI for
          learners and institutions in Rourkela and Bhubaneswar. Discover the initiative and
          register interest to receive verified programme details.
        </p>
        <div className="hero-actions">
          <a className="button primary" href={registration}>Explore programme &amp; register interest</a>
          <a className="button secondary" href="/contact">Enquire as a school or institution</a>
        </div>
        <p>Event dates, venues and participation arrangements are subject to confirmation. Registration of interest is not a confirmed event booking.</p>
      </section>
      <section className="section-shell aligned-section">
        <div className="section-heading">
          <p className="eyebrow">Local learning conversations</p>
          <h2>Rourkela and Bhubaneswar</h2>
          <p>These two Odisha cities are the initial focus of OMNeXa's proposed student robotics outreach.</p>
        </div>
        <div className="pillar-grid">
          <article className="pillar-card">
            <span>01</span>
            <h3>Robotics learning in Rourkela</h3>
            <p>For students, parents and schools exploring how physical systems, sensors and intelligent technology connect with responsible human decisions.</p>
          </article>
          <article className="pillar-card">
            <span>02</span>
            <h3>Robotics learning in Bhubaneswar</h3>
            <p>For education communities interested in future skills, robotics awareness and practical conversations about human-centred AI.</p>
          </article>
        </div>
      </section>
      <section className="band">
        <div className="section-shell aligned-section">
          <div className="section-heading">
            <p className="eyebrow">Why Physical AI?</p>
            <h2>Build understanding, not just excitement.</h2>
          </div>
          <div className="copy-stack">
            <p>Physical AI connects computation with real-world sensing and action. Responsible robotics also asks who decides what a machine may do, how safety is managed and how people remain accountable.</p>
            <p>OMNeXa's education outreach is guided by its <a href="/robotics-with-human-values">Robotics with Human Values</a> principle. Programme activities and delivery details will be confirmed through the registration channel.</p>
          </div>
        </div>
      </section>
      <section className="section-shell aligned-section">
        <div className="section-heading">
          <p className="eyebrow">For students, parents and institutions</p>
          <h2>Stay informed about the Odisha initiative.</h2>
          <p>Use the OMNeXa Career programme page for interest registration and official updates. Schools and potential partners can contact OMNeXa directly.</p>
        </div>
        <div className="hero-actions">
          <a className="button primary" href={registration}>Visit Physical AI (Robots) registration</a>
          <a className="button secondary" href="/india">Explore OMNeXa in India</a>
        </div>
      </section>
    </main>
  );
}
