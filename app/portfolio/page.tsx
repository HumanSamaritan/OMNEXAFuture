import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Portfolio | OMNeXa",
  description: "OMNeXa case studies and client transformations"
};

const cases = [
  {
    id: 1,
    title: "AI-Readiness for Regional Bank",
    category: "AI & Governance",
    challenge: "Build governance frameworks for responsible AI adoption",
    solution: "Comprehensive workshops, use case mapping, pilot roadmap",
    outcome: "3 AI pilots with embedded risk management, 40% faster decisions",
    image: "https://images.unsplash.com/photo-1677442d019cecf8d5dfa34bec0f5a8c?w=600&h=400&fit=crop"
  },
  {
    id: 2,
    title: "ESG Activation in Multinational",
    category: "Sustainability",
    challenge: "Engage employees in ESG commitments",
    solution: "Integrated activation program with dashboards and green champions",
    outcome: "50% employee participation increase, measurable carbon reduction",
    image: "https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=600&h=400&fit=crop"
  },
  {
    id: 3,
    title: "Career Pathways for 500+ Students",
    category: "Education",
    challenge: "Guide students on future-ready career paths",
    solution: "Structured guidance with industry exposure and mentoring",
    outcome: "85% gained clarity, 30% secured internships",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop"
  },
  {
    id: 4,
    title: "AML/KYC Remediation for Fintech",
    category: "Compliance",
    challenge: "Achieve regulatory compliance with tech integration",
    solution: "Control design, workflow optimization, technology advisory",
    outcome: "Full compliance in 6 months, 60% false positive reduction, $500K savings",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop"
  },
  {
    id: 5,
    title: "Well-being Program for Tech Startup",
    category: "Well-being",
    challenge: "Address burnout and build conscious leadership",
    solution: "Leadership circles, well-being workshops, performance frameworks",
    outcome: "30% attrition reduction, improved team morale",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop"
  },
  {
    id: 6,
    title: "EdTech Ecosystem Collaboration",
    category: "Partnership",
    challenge: "Build multi-sector partnerships for education innovation",
    solution: "Stakeholder mapping, collaboration framework, alignment workshops",
    outcome: "15+ partners, 10,000+ students reached",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop"
  }
];

export default function PortfolioPage() {
  return (
    <main>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="section-shell">
          <h1>Case Studies</h1>
          <p>Real-world transformations across compliance, AI, sustainability, education and well-being</p>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="portfolio-section section-shell">
        <div className="cases-grid">
          {cases.map((caseStudy) => (
            <div key={caseStudy.id} className="case-card">
              <div className="case-image">
                <Image
                  src={caseStudy.image}
                  alt={caseStudy.title}
                  width={500}
                  height={300}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="case-body">
                <span className="case-category">{caseStudy.category}</span>
                <h3>{caseStudy.title}</h3>
                
                <div className="case-item">
                  <strong>Challenge</strong>
                  <p>{caseStudy.challenge}</p>
                </div>
                
                <div className="case-item">
                  <strong>Outcome</strong>
                  <p>{caseStudy.outcome}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Impact Stats */}
      <section className="impact-section">
        <div className="section-shell">
          <h2>Our Impact</h2>
          <div className="impact-grid">
            <div className="impact-stat">
              <div className="impact-number">50+</div>
              <p>Organizations Transformed</p>
            </div>
            <div className="impact-stat">
              <div className="impact-number">20K+</div>
              <p>Individuals Impacted</p>
            </div>
            <div className="impact-stat">
              <div className="impact-number">$50M+</div>
              <p>Value Created</p>
            </div>
            <div className="impact-stat">
              <div className="impact-number">85%+</div>
              <p>Client Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="final-cta section-shell">
        <h2>Your transformation starts here</h2>
        <Link href="/contact" className="btn btn-primary">
          Schedule a Consultation
        </Link>
      </section>
    </main>
  );
}