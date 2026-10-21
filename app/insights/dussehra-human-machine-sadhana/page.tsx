import type { Metadata } from "next";

const url = "https://www.omnexagoc.com/insights/dussehra-human-machine-sadhana";
const video = "https://www.youtube.com/watch?v=faabEp-rkIQ";

export const metadata: Metadata = {
  title: "Dussehra 2026: Conquer Your Inner Ravan | Human + Machine Sadhana",
  description: "This Dussehra, OMNeXa introduces the Human + Machine Sadhana pilot journey: daily awareness, human agency, responsible AI and lessons from Ram and his allies.",
  alternates: { canonical: "/insights/dussehra-human-machine-sadhana" },
  openGraph: { title: "Conquer Your Inner Ravan. Awaken the Ram Within. | OMNeXa", description: "A timeless Dussehra reflection on conscious daily life, trusted allies and human-centred AI.", url, type: "article", images: [{ url: "/omnexa-driver-home.jpg", width: 1254, height: 1254, alt: "OMNeXa — Where Consciousness Meets Intelligence" }] }
};

export default function DussehraHmsArticle() {
  const article = { "@context": "https://schema.org", "@type": "Article", headline: "This Dussehra, Conquer Your Inner Ravan. Awaken the Ram Within.", datePublished: "2026-10-21", dateModified: "2026-10-21", mainEntityOfPage: url, author: { "@type": "Organization", name: "OMNeXa Pte. Ltd.", url: "https://www.omnexagoc.com" }, publisher: { "@type": "Organization", name: "OMNeXa Pte. Ltd." }, about: ["Dussehra", "Human + Machine Sadhana", "human agency", "responsible AI"] };
  const videoData = { "@context": "https://schema.org", "@type": "VideoObject", name: "Dussehra 2026 | Conquer Your Inner Ravan | OMNeXa Human + Machine Sadhana", description: "OMNeXa introduces the Human + Machine Sadhana journey with the lessons of Dussehra.", uploadDate: "2026-10-21", thumbnailUrl: "https://img.youtube.com/vi/faabEp-rkIQ/hqdefault.jpg", embedUrl: "https://www.youtube.com/embed/faabEp-rkIQ", contentUrl: video };
  return <main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([article, videoData]) }} />
    <article className="section-shell aligned-section" style={{maxWidth: "950px",paddingTop: "3rem",paddingBottom: "4rem"}}>
      <p className="eyebrow">OMNeXa perspective · Dussehra 2026 · Human + Machine Sadhana</p>
      <h1>This Dussehra, Conquer Your Inner Ravan. Awaken the Ram Within.</h1>
      <p className="hero-copy">What if the greatest victory we seek begins within ourselves?</p>
      <div style={{position:"relative",width:"100%",aspectRatio:"16 / 9",overflow:"hidden",borderRadius: "18px",background:"#071725",margin:"2rem 0"}}>
        <iframe title="OMNeXa Dussehra Human + Machine Sadhana film" src="https://www.youtube-nocookie.com/embed/faabEp-rkIQ" loading="lazy" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen style={{width:"100%",height:"100%",border:0}} />
      </div>
      <p><a href={video} target="_blank" rel="noopener noreferrer">Watch the Dussehra film on YouTube ↗</a></p>
      <p><strong>Stress. Distraction. Fear. Self-doubt. Burnout. Anger. Anxiety. Comparison. Overload. Isolation.</strong></p>
      <p>Ten challenges we encounter in our everyday lives.</p>
      <p>The Ramayana reminds us that Lord Ram&apos;s victory was guided not only by courage and wisdom, but also by the strength of his allies—Hanuman and the Vanara Sena, united by purpose and collective effort.</p>
      <h2>What might this story mean for modern life?</h2>
      <p>Lord Ram&apos;s journey offers enduring themes of compassion, responsibility and integrity. In the metaphor of an inner Ravan, the challenges we face are not enemies outside us but habits and pressures that can cloud our judgement.</p>
      <p>Just as Lord Ram brought together trusted allies, we envision intelligent machines and AI agents as meaningful partners in our lives—strengthening human capabilities without replacing human judgement.</p>
      <h2>Introducing Human + Machine Sadhana (HMS)</h2>
      <p>This Dussehra, OMNeXa introduces the HMS pilot journey: an initiative bringing together conscious daily practices, self-reflection, wellbeing and responsible artificial intelligence.</p>
      <p><strong>Human wisdom leads. Technology supports. Human agency remains in control.</strong></p>
      <p>We believe the principles of Ram Rajya—compassion, fairness, responsibility and harmony—must begin within each of us before they can flourish in our families, communities and society.</p>
      <h2>Join the HMS pilot journey</h2>
      <p>We invite individuals and collaborators to help us test, learn and shape a more human-centred wellbeing experience. Qualifying participants who complete agreed pilot activities and feedback may receive six months of free individual subscription, subject to pilot terms and product availability. Registration alone does not guarantee selection or access.</p>
      <div style={{display:"flex",flexWrap:"wrap",gap:"12px",margin:"1.5rem 0"}}>
        <a className="button primary" href="/work/human-machine-sadhana">Explore HMS</a>
        <a className="button secondary" href="/pilot?product=human-machine-sadhana">Apply to the HMS pilot</a>
      </div>
      <h2>Happy Dussehra from OMNeXa</h2>
      <p>May we conquer the Ravan within, awaken the Ram within our hearts and take meaningful steps towards the ideals of Ram Rajya.</p>
      <p><strong>OMNeXa — Where Consciousness Meets Intelligence.</strong></p>
    </article>
  </main>;
}
