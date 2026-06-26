import Link from "next/link";

export const metadata = {
  title: "About | OMNeXa - Our Story & Mission",
  description: "Learn about Dhiraj Kumar and the OMNeXa journey"
};

export default function AboutPage() {
  return (
    <main>
      <div className="page-hero section-shell">
        <div>
          <p className="eyebrow">About OMNeXa</p>
          <h1>Where Consciousness Meets Intelligence</h1>
          <p className="hero-copy">
            OMNeXa is founded on the belief that the most successful transformations integrate
            compliance, sustainability, AI, education and well-being into one practical roadmap.
          </p>
        </div>
      </div>

      <section className="section-shell about-hero">
        <div className="about-card">
          <div className="founder-badge">DK</div>
          <div>
            <p className="eyebrow">Founder & Principal Advisor</p>
            <h2>Dhiraj Kumar</h2>
            <p>
              Dhiraj Kumar is Founder / Advisor at OMNeXa Pte. Ltd., bringing together financial-crime
              execution depth, sustainability thinking, AI-era readiness and human-centered leadership.
            </p>
            <p>
              His experience spans AML/KYC, sanctions, governance, control design, remediation,
              regulatory exam support, technology and workflow transformation, ESG engagement,
              education mentoring and ecosystem collaboration.
            </p>
            <p>
              With over 20 years in risk and compliance across APAC and EMEA, Dhiraj has worked with
              banks, fintechs, regulators and institutional partners to build practical transformation
              programs that balance risk intelligence, sustainability intelligence, and human resilience.
            </p>
          </div>
        </div>
      </section>

      <section className="section-shell mission-vision">
        <div className="mission-grid">
          <div className="mission-card">
            <h3>Our Mission</h3>
            <p>
              To prepare people, institutions and organizations for a future shaped by AI, sustainability,
              regulatory pressure and human resilience through practical, integrated transformation programs.
            </p>
          </div>
          <div className="mission-card">
            <h3>Our Vision</h3>
            <p>
              A world where technology amplifies human values, organizations operate sustainably and ethically,
              and people are equipped for meaningful careers in an AI-enabled economy.
            </p>
          </div>
          <div className="mission-card">
            <h3>Our Values</h3>
            <p>
              Practical wisdom over theory • Integrity in all partnerships • Human-centered innovation •
              Measurable impact • Conscious leadership and continuous learning.
            </p>
          </div>
        </div>
      </section>

      <section className="timeline-section section-shell">
        <div className="section-heading centered">
          <p className="eyebrow">Journey & Milestones</p>
          <h2>Building Trust Through Experience</h2>
        </div>

        <div className="timeline-grid">
          <div className="timeline-item">
            <span className="timeline-year">20+</span>
            <h4>Years in Risk & Compliance</h4>
            <p>Deep expertise in AML/KYC, sanctions, governance and regulatory transformation</p>
          </div>
          <div className="timeline-item">
            <span className="timeline-year">APAC + EMEA</span>
            <h4>Regional Footprint</h4>
            <p>Worked across Singapore, India, Middle East and Europe with diverse partners</p>
          </div>
          <div className="timeline-item">
            <span className="timeline-year">6</span>
            <h4>Integrated Pillars</h4>
            <p>Expertise spanning education, compliance, sustainability, AI, well-being and leadership</p>
          </div>
          <div className="timeline-item">
            <span className="timeline-year">Ecosystem</span>
            <h4>Collaboration Model</h4>
            <p>Partnerships with institutions, corporates, regulators and technology innovators</p>
          </div>
        </div>
      </section>

      <section className="cta-section section-shell">
        <div className="cta-box">
          <h2>Let's build future-ready ecosystems together</h2>
          <p>Discover how OMNeXa can support your transformation journey</p>
          <div className="cta-buttons">
            <Link href="/services" className="button primary">
              Explore Services
            </Link>
            <Link href="/contact" className="button secondary">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      <footer>
        <p>© {new Date().getFullYear()} OMNeXa Pte. Ltd. All rights reserved.</p>
        <p>Where Consciousness Meets Intelligence</p>
      </footer>
    </main>
  );
}