import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Services | OMNeXa",
  description: "OMNeXa's comprehensive consulting services"
};

const services = [
  {
    id: "compliance",
    title: "Risk & Compliance",
    description: "Fractional AML/KYC, sanctions, governance and regulatory readiness",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
    offerings: [
      "AML/KYC and sanctions advisory",
      "Compliance remediation support",
      "Regulatory exam readiness",
      "Control design and governance frameworks"
    ]
  },
  {
    id: "ai",
    title: "AI & Responsible Innovation",
    description: "AI readiness, governance frameworks and responsible implementation",
    image: "https://images.unsplash.com/photo-1677442d019cecf8d5dfa34bec0f5a8c?w=600&h=400&fit=crop",
    offerings: [
      "AI readiness workshops",
      "Governance framework design",
      "Workforce preparation programs",
      "Use case identification and piloting"
    ]
  },
  {
    id: "sustainability",
    title: "Sustainability & ESG",
    description: "Employee engagement, ESG alignment and sustainable transformation",
    image: "https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=600&h=400&fit=crop",
    offerings: [
      "ESG culture activation",
      "Sustainability alignment",
      "Employee engagement programs",
      "Impact measurement and dashboards"
    ]
  },
  {
    id: "wellbeing",
    title: "Well-being & Leadership",
    description: "Conscious leadership development and sustainable performance",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
    offerings: [
      "Leadership circle programs",
      "Well-being workshops",
      "Resilience training",
      "Organizational health assessments"
    ]
  },
  {
    id: "education",
    title: "Career & Education",
    description: "Student guidance, career pathways and future-skills readiness",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
    offerings: [
      "Career counselling",
      "Future-skills assessment",
      "Global pathway discussions",
      "Professional transition support"
    ]
  }
];

export default function ServicesPage() {
  return (
    <main>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="section-shell">
          <h1>Our Services</h1>
          <p>
            Integrated consulting across compliance, AI, sustainability, well-being and education. 
            Each service stands alone. The strongest value comes when integrated.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="services-section section-shell">
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.id} className="service-item">
              <div className="service-image">
                <Image
                  src={service.image}
                  alt={service.title}
                  width={500}
                  height={300}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="service-content">
                <h3>{service.title}</h3>
                <p className="service-description">{service.description}</p>
                <ul className="offerings-list">
                  {service.offerings.map((offering) => (
                    <li key={offering}>{offering}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Engagement Model */}
      <section className="engagement-model">
        <div className="section-shell">
          <h2>Our Engagement Model</h2>
          <p className="subtitle">Start small, prove value, then scale</p>
          
          <div className="model-steps">
            <div className="step">
              <div className="step-number">1</div>
              <h4>Discover</h4>
              <p>Understand your priorities, challenges and success metrics</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h4>Design</h4>
              <p>Co-create a tailored advisory, workshop or pilot approach</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h4>Implement</h4>
              <p>Execute with embedded stakeholder alignment and learning</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h4>Scale</h4>
              <p>Transform into repeatable programs and organizational capability</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="final-cta section-shell">
        <h2>Ready to get started?</h2>
        <Link href="/contact" className="btn btn-primary">
          Schedule a Consultation
        </Link>
      </section>
    </main>
  );
}