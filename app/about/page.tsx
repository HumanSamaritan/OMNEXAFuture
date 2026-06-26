import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "About | OMNeXa",
  description: "Learn about OMNeXa and our founder Dhiraj Kumar"
};

export default function AboutPage() {
  return (
    <main>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="section-shell">
          <h1>About OMNeXa</h1>
          <p>
            We prepare people, institutions and organizations for a future shaped by AI, 
            sustainability, regulatory pressure and human resilience.
          </p>
        </div>
      </section>

      {/* Founder Section */}
      <section className="founder-full section-shell">
        <div className="founder-layout">
          <div className="founder-image">
            <div className="founder-badge-large">DK</div>
          </div>
          <div className="founder-bio">
            <h2>Dhiraj Kumar</h2>
            <p className="role">Founder & Principal Advisor</p>
            
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

      {/* Mission, Vision, Values */}
      <section className="mvv-section">
        <div className="section-shell">
          <div className="mvv-grid">
            <div className="mvv-card">
              <h3>Our Mission</h3>
              <p>
                To prepare people, institutions and organizations for a future shaped by AI, 
                sustainability, regulatory pressure and human resilience through practical, 
                integrated transformation programs.
              </p>
            </div>
            <div className="mvv-card">
              <h3>Our Vision</h3>
              <p>
                A world where technology amplifies human values, organizations operate sustainably 
                and ethically, and people are equipped for meaningful careers in an AI-enabled economy.
              </p>
            </div>
            <div className="mvv-card">
              <h3>Our Values</h3>
              <p>
                Practical wisdom over theory • Integrity in partnerships • Human-centered innovation • 
                Measurable impact • Conscious leadership
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section section-shell">
        <div className="stats-grid">
          <div className="stat">
            <div className="stat-value">20+</div>
            <p>Years in Risk & Compliance</p>
          </div>
          <div className="stat">
            <div className="stat-value">6</div>
            <p>Integrated Service Pillars</p>
          </div>
          <div className="stat">
            <div className="stat-value">50+</div>
            <p>Organizations Transformed</p>
          </div>
          <div className="stat">
            <div className="stat-value">APAC + EMEA</div>
            <p>Regional Presence</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="final-cta section-shell">
        <h2>Let's build future-ready ecosystems together</h2>
        <Link href="/contact" className="btn btn-primary">
          Get in Touch
        </Link>
      </section>
    </main>
  );
}