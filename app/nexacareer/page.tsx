import type { Metadata } from "next";

const partnerGroups = [
  {title:"Education institutions & counsellors",text:"Universities, colleges, study-abroad advisers, school programmes and admissions networks."},
  {title:"Skills & training",text:"Training providers, certification organisations and professional academies aligning courses with real capability gaps."},
  {title:"Employers & opportunity networks",text:"Hiring teams, internship programmes, recruiters and partners offering project or fractional work."},
  {title:"Mobility & visa services",text:"Providers offering authorised document assistance and application guidance; visa decisions remain with issuing authorities."}
];
const faqs = [
  {question:"What is NeXaCareer?",answer:"NeXaCareer is OMNeXa's human-centred ecosystem connecting education discovery, skills assessment, career opportunity pathways and approved partner collaboration."},
  {question:"How does NeXaCareer protect human agency?",answer:"AI is positioned as decision support. The person can evaluate and challenge suggestions; institutions, employers, partners and authorities retain their own decisions. Product controls must be validated in practice."},
  {question:"What is the Skills Passport?",answer:"An evolving, human-directed framework to organise learning, skills, evidence, experience, capability gaps and next steps. An AI-inferred skill is not the same as a verified credential; universal passport portability remains a roadmap goal."},
  {question:"Who can request NeXaCareer partnership?",answer:"Education and counselling organisations, skills and training providers, employers and opportunity networks, and mobility or visa-support providers can submit an enquiry. OMNeXa reviews applications before public listing."}
];

export const metadata: Metadata = {
  title: "NeXaCareer | Human Agency, Skills Passport & Education Partnerships",
  description: "NeXaCareer by OMNeXa is open for education, training, employer and mobility partner enquiries. Discover human-led AI career guidance, Skills Passport design and accountable partnership review.",
  alternates:{canonical:"/nexacareer"},
  openGraph:{title:"NeXaCareer: Human Agency First. AI as a Partner.",description:"Education, skills, jobs and mobility partners connected around people with AI as a decision-support partner.",url:"https://www.omnexagoc.com/nexacareer",type:"website"}
};

export default function NexaCareerPage(){
  return <main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({
      "@context":"https://schema.org","@graph":[
        {"@type":"WebPage","@id":"https://www.omnexagoc.com/nexacareer#webpage","url":"https://www.omnexagoc.com/nexacareer","name":"NeXaCareer: Human Agency, Skills Passport & Partner Ecosystem","about":{"@id":"https://www.omnexagoc.com/#organization"}},
        {"@type":"FAQPage","mainEntity":faqs.map(f=>({"@type":"Question","name":f.question,"acceptedAnswer":{"@type":"Answer","text":f.answer}}))}
      ]
    })}}/>
    <section className="section-shell aligned-section page-hero">
      <p className="eyebrow">OMNeXa NeXaCareer · Partner enquiries open</p>
      <h1>Human agency first. AI as a partner. Your skills, your decisions, your future.</h1>
      <p>NeXaCareer connects learning, skills and work through a human-centred model. AI can help people find pathways, assess evidence and explore next steps, but it does not replace informed human choice or institutional accountability.</p>
      <div className="hero-actions">
        <a className="button primary" href="https://omnexa-career.omnexagoc.com/partners">Request a partnership</a>
        <a className="button secondary" href="https://omnexa-career.omnexagoc.com/">Explore NeXaCareer</a>
      </div>
    </section>
    <section className="section-shell aligned-section">
      <div className="section-heading"><p className="eyebrow">A learner-owned direction</p><h2>The Skills Passport should remain understandable to the person it represents.</h2></div>
      <p>A simple passport model joins learning history, source evidence, experience, capabilities, gaps and goals. AI can propose interpretations, but claims, verified credentials and model inferences must remain distinguishable. A portable consent-managed passport is an evolving product direction, not an assertion of universal live integration.</p>
      <p><a href="https://omnexa-career.omnexagoc.com/skill-passport">Understand the Skills Passport approach →</a></p>
    </section>
    <section className="section-shell aligned-section">
      <div className="section-heading"><p className="eyebrow">Four open partner categories</p><h2>Request a partnership across the education-to-opportunity journey.</h2></div>
      <div className="service-preview-grid">{partnerGroups.map(p=><article className="service-card" key={p.title}><h3>{p.title}</h3><p>{p.text}</p></article>)}</div>
      <p>All enquiries undergo review. AI-assisted summaries never constitute approval, accreditation or a guarantee of commercial terms.</p>
      <div className="hero-actions"><a className="button primary" href="https://omnexa-career.omnexagoc.com/partners#partner-enquiry">Apply to partner with NeXaCareer</a></div>
    </section>
    <section className="section-shell aligned-section">
      <div className="section-heading"><p className="eyebrow">Questions and answers</p><h2>Human-centred education and AI collaboration explained.</h2></div>
      <div className="service-preview-grid">{faqs.map(f=><article className="service-card" key={f.question}><h3>{f.question}</h3><p>{f.answer}</p></article>)}</div>
    </section>
  </main>;
}
