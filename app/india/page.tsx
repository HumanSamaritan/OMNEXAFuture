import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OMNeXa India | AI, Robotics, Education & Transformation",
  description: "Explore OMNeXa's India-focused education, robotics and responsible AI initiatives, including student outreach in Rourkela and Bhubaneswar, Odisha. Singapore-based, globally engaged.",
  alternates: { canonical: "/india" },
  openGraph: {
    title: "OMNeXa India | Education, Robotics & Responsible AI",
    description: "OMNeXa's initiatives relevant to Indian students, institutions and organisations.",
    url: "https://www.omnexagoc.com/india",
    images: [{url: "/omnexa-logo.png", alt: "OMNeXa official logo"}]
  }
};
export default function IndiaPage() {
  return <main>
    <section className="page-hero section-shell aligned-section">
      <p className="eyebrow">OMNeXa Pte. Ltd. · Singapore-based · India initiatives</p>
      <h1>Human-centred AI, robotics and future skills for India.</h1>
      <p>OMNeXa works at the intersection of responsible AI, education, banking risk and sustainable transformation. Our India-focused outreach connects students, parents and institutions with ideas and practical learning opportunities.</p>
      <div className="hero-actions">
        <a className="button primary" href="/india/odisha/robotics">Explore Odisha robotics initiative</a>
        <a className="button secondary" href="/contact">Contact OMNeXa</a>
      </div>
    </section>
    <section className="section-shell aligned-section">
      <div className="section-heading">
        <p className="eyebrow">Initial regional focus</p>
        <h2>Physical AI and robotics for Odisha learners.</h2>
        <p>Discover proposed student-focused robotics outreach in Rourkela and Bhubaneswar. Register interest for programme updates; exact arrangements are subject to confirmation.</p>
      </div>
      <div className="hero-actions"><a className="button primary" href="/india/odisha/robotics">Rourkela &amp; Bhubaneswar programme</a></div>
    </section>
    <section className="section-shell aligned-section">
      <div className="section-heading">
        <p className="eyebrow">Broader India engagement</p>
        <h2>Responsible technology with practical outcomes.</h2>
        <p>Explore OMNeXa's <a href="/services">transformation services</a>, <a href="/robotics-with-human-values">responsible robotics principles</a> and <a href="/knowledge">official company knowledge guide</a>. OMNeXa Pte. Ltd. is registered in Singapore; this page describes its India-relevant activities, not a separate Indian legal entity.</p>
      </div>
    </section>
  </main>;
}
