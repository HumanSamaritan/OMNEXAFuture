import Link from "next/link";

export const metadata = {
  title: "Portfolio | OMNeXa - Case Studies & Success Stories",
  description: "Explore OMNeXa case studies and success stories across industries"
};

interface CaseStudy {
  id: string;
  title: string;
  category: string;
  challenge: string;
  solution: string;
  outcome: string;
  tags: string[];
}

const caseStudies: CaseStudy[] = [
  {
    id: "1",
    title: "AI-Readiness Transformation for Financial Institution",
    category: "AI & Governance",
    challenge:
      "A major regional bank needed to understand responsible AI applications and build governance frameworks for AI adoption.",
    solution:
      "OMNeXa designed and conducted a comprehensive AI-readiness workshop, mapped use cases, and co-created a governance-aware pilot roadmap.",
    outcome:
      "Bank successfully launched 3 AI pilots with embedded risk management, improved regulatory alignment, and 40% faster decision cycles.",
    tags: ["AI", "Governance", "Financial Services"]
  },
  {
    id: "2",
    title: "Sustainability Culture Activation in Multinational",
    category: "ESG & Culture",
    challenge:
      "A multinational corporation had ESG commitments but struggled with employee engagement and Scope 3 emissions clarity.",
    solution:
      "OMNeXa developed an integrated ESG activation program including workshops, dashboards, and green champion models.",
    outcome:
      "50% increase in employee participation, measurable carbon reduction, and ESG strategy embedded in performance metrics.",
    tags: ["Sustainability", "Employee Engagement", "Corporate"]
  },
  {
    id: "3",
    title: "Career Pathways Program for 500+ Students",
    category: "Education & Career Development",
    challenge:
      "Educational institution needed to guide students on future-ready career paths in an AI-influenced economy.",
    solution:
      "OMNeXa created structured career guidance program with industry exposure, skill mapping, and mentoring.",
    outcome:
      "85% of students gained clarity on career direction, 30% secured internships with partner organizations.",
    tags: ["Education", "Career Development", "Youth Empowerment"]
  },
  {
    id: "4",
    title: "AML/KYC Remediation & Tech Integration",
    category: "Compliance & Technology",
    challenge:
      "Fintech company faced regulatory gaps in AML/KYC processes and needed technology-enabled solutions.",
    solution:
      "OMNeXa provided fractional advisory on control design, workflow optimization, and technology integration.",
    outcome:
      "Achieved full regulatory compliance in 6 months, reduced false positives by 60%, saved $500K annually.",
    tags: ["Compliance", "AML/KYC", "Fintech"]
  },
  {
    id: "5",
    title: "Well-being & Leadership Program for Tech Startup",
    category: "Well-being & Leadership",
    challenge:
      "Fast-growing tech company faced burnout and needed conscious leadership development for management team.",
    solution:
      "OMNeXa designed leadership circles, well-being workshops, and sustainable performance frameworks.",
    outcome:
      "30% reduction in attrition, improved team morale, and leadership team developed integrated decision-making practices.",
    tags: ["Well-being", "Leadership", "Tech"]
  },
  {
    id: "6",
    title: "Ecosystem Collaboration for EdTech Initiative",
    category: "Ecosystem & Innovation",
    challenge:
      "Non-profit needed to build partnerships across education, technology, and government sectors for innovation program.",
    solution:
      "OMNeXa facilitated stakeholder mapping, designed collaboration framework, and led partner alignment workshops.",
    outcome:
      "Successfully launched multi-sector initiative with 15+ partner organizations, reached 10,000+ students.",
    tags: ["Ecosystem", "Partnership", "EdTech"]
  }
];

export default function PortfolioPage() {
  return (
    <main>
      <div className="page-hero section-shell">
        <div>
          <p className="eyebrow">Our Work</p>
          <h1>Case Studies & Success Stories</h1>
          <p className="hero-copy">
            Real-world transformations across industries. Practical solutions. Measurable impact.
          </p>
        </div>
      </div>

      <section className="section-shell portfolio-section">
        <div className="case-studies-grid">
          {caseStudies.map((study) => (
            <article key={study.id} className="case-study-card">
              <div className="case-study-header">
                <span className="case-category">{study.category}</span>
              </div>
              <h3>{study.title}</h3>

              <div className="case-section">
                <strong>Challenge</strong>
                <p>{study.challenge}</p>
              </div>

              <div className="case-section">
                <strong>Solution</strong>
                <p>{study.solution}</p>
              </div>

              <div className="case-section">
                <strong>Outcome</strong>
                <p>{study.outcome}</p>
              </div>

              <div className="case-tags">
                {study.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="stats-section section-shell">
        <div className="section-heading centered">
          <p className="eyebrow">Impact By Numbers</p>
          <h2>Measurable Results Across All Engagements</h2>
        </div>

        <div className="impact-grid">
          <div className="impact-card">
            <strong>50+</strong>
            <p>Organizations Transformed</p>
          </div>
          <div className="impact-card">
            <strong>20K+</strong>
            <p>Individuals Impacted</p>
          </div>
          <div className="impact-card">
            <strong>$50M+</strong>
            <p>Risk Mitigated / Value Created</p>
          </div>
          <div className="impact-card">
            <strong>85%+</strong>
            <p>Client Satisfaction & Retention</p>
          </div>
        </div>
      </section>

      <section className="cta-section section-shell">
        <div className="cta-box">
          <h2>Your transformation starts here</h2>
          <p>Let's discuss how OMNeXa can create impact for your organization</p>
          <Link href="/contact" className="button primary">
            Schedule a Consultation
          </Link>
        </div>
      </section>

      <footer>
        <p>© {new Date().getFullYear()} OMNeXa Pte. Ltd. All rights reserved.</p>
        <p>Where Consciousness Meets Intelligence</p>
      </footer>
    </main>
  );
}