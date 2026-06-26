import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      {/* Hero Section with OMNeXa Image */}
      <section className="hero">
        <div className="hero-overlay" />
        <Image
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&h=900&fit=crop"
          alt="OMNeXa - Future Ready"
          fill
          priority
          className="hero-image"
        />
        <div className="hero-content section-shell">
          <div className="hero-text">
            <h1>Where Consciousness Meets Intelligence</h1>
            <p>
              Human-centered transformation for an AI-enabled, sustainable and resilient future
            </p>
            <div className="hero-buttons">
              <Link href="/services" className="btn btn-primary">
                Explore Services
              </Link>
              <Link href="/contact" className="btn btn-secondary">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Compact Introduction */}
      <section className="intro section-shell">
        <div className="intro-content">
          <h2>Prepare Your Organization for Tomorrow</h2>
          <p>
            OMNeXa is a Singapore-based consultancy preparing people, institutions and organizations 
            for a future shaped by AI, sustainability, regulatory pressure and human resilience.
          </p>
        </div>
      </section>

      {/* Three Core Offerings */}
      <section className="offerings section-shell">
        <div className="offerings-grid">
          <div className="offering-card">
            <div className="offering-icon">01</div>
            <h3>Risk & Compliance</h3>
            <p>Fractional AML/KYC, sanctions, governance, and regulatory readiness support</p>
            <Link href="/services#compliance" className="link-arrow">
              Learn more →
            </Link>
          </div>

          <div className="offering-card">
            <div className="offering-icon">02</div>
            <h3>AI & Transformation</h3>
            <p>Responsible AI readiness, governance frameworks, and workforce preparation</p>
            <Link href="/services#ai" className="link-arrow">
              Learn more →
            </Link>
          </div>

          <div className="offering-card">
            <div className="offering-icon">03</div>
            <h3>Sustainability & Well-being</h3>
            <p>ESG alignment, employee engagement, and conscious leadership programs</p>
            <Link href="/services#sustainability" className="link-arrow">
              Learn more →
            </Link>
          </div>
        </div>
      </section>

      {/* Why OMNeXa */}
      <section className="why-section">
        <div className="section-shell">
          <h2>Why OMNeXa</h2>
          <div className="why-grid">
            <div className="why-item">
              <h4>20+ Years Experience</h4>
              <p>Deep expertise in AML/KYC, sanctions, governance, and regulatory transformation across APAC and EMEA</p>
            </div>
            <div className="why-item">
              <h4>Integrated Approach</h4>
              <p>We don't work in silos. Compliance, sustainability, AI, education and well-being are connected</p>
            </div>
            <div className="why-item">
              <h4>Practical Results</h4>
              <p>Our engagements follow "start small, prove value, then scale" - delivering measurable outcomes</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-banner">
        <div className="section-shell">
          <h2>Ready to transform your organization?</h2>
          <Link href="/contact" className="btn btn-primary">
            Start a Conversation
          </Link>
        </div>
      </section>

      {/* Featured Case Study */}
      <section className="featured-case section-shell">
        <div className="featured-header">
          <h2>Featured Work</h2>
          <Link href="/portfolio" className="view-all">View all case studies →</Link>
        </div>
        
        <div className="case-preview">
          <div className="case-image">
            <Image
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop"
              alt="AI Implementation"
              width={600}
              height={400}
            />
          </div>
          <div className="case-text">
            <span className="case-tag">AI & Governance</span>
            <h3>AI-Readiness Transformation for Financial Institution</h3>
            <p>
              A regional bank needed to understand responsible AI applications and build governance frameworks. 
              We designed comprehensive workshops and co-created a governance-aware pilot roadmap.
            </p>
            <p className="outcome">
              <strong>Result:</strong> 3 AI pilots launched with embedded risk management, improved regulatory alignment, 40% faster decision cycles
            </p>
            <Link href="/portfolio" className="link-arrow">See more case studies →</Link>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="founder-section">
        <div className="section-shell">
          <h2>Meet the Founder</h2>
          <div className="founder-grid">
            <div className="founder-image">
              <div className="founder-badge">DK</div>
            </div>
            <div className="founder-text">
              <h3>Dhiraj Kumar</h3>
              <p className="role">Founder & Principal Advisor</p>
              <p>
                Dhiraj brings together 20+ years of financial-crime execution depth, sustainability thinking, 
                AI-era readiness and human-centered leadership.
              </p>
              <p>
                His experience spans AML/KYC, sanctions, governance, control design, regulatory exam support, 
                technology transformation, ESG engagement, education mentoring and ecosystem collaboration.
              </p>
              <Link href="/about" className="link-arrow">Learn more about us →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta section-shell">
        <h2>Let's build future-ready ecosystems together</h2>
        <Link href="/contact" className="btn btn-primary">
          Contact OMNeXa
        </Link>
      </section>
    </main>
  );
}