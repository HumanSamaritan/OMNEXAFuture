"use client";

import { useEffect, useMemo, useState } from "react";

type Platform = "LinkedIn" | "X" | "Instagram";
type Metric = { platform: Platform; impressions: number; engagements: number; clicks: number; leads: number };

const pillars = [
  "Career & Education",
  "Risk, Governance & Regulatory",
  "Sustainability & ESG",
  "AI & Robotics",
  "Health & Well-being",
  "Partnership Ecosystem",
];

const profileCopy: Record<Platform, string> = {
  LinkedIn:
    "OMNeXa | Where Consciousness Meets Intelligence. Singapore-based transformation ecosystem helping people, institutions and organizations become future-ready across AI, education & careers, governance & compliance, sustainability, and human well-being. We turn complex change into practical programs, partnerships and digital solutions that can start small and scale.",
  X:
    "Future-ready people & organizations. AI • Education & Careers • Governance • Sustainability • Well-being. Singapore. Where Consciousness Meets Intelligence.",
  Instagram:
    "Future-readiness from Singapore 🌏\nAI • Education • Careers • Governance • ESG • Well-being\nWhere Consciousness Meets Intelligence\n↓ Explore OMNeXa",
};

const launchPosts: Record<Platform, string[]> = {
  LinkedIn: [
    "The future of work, education, governance, sustainability and human well-being is converging. OMNeXa exists to help people and organizations navigate that convergence with practical, implementable solutions. Follow our journey as we build a future-ready ecosystem from Singapore for a global audience. #FutureOfWork #ArtificialIntelligence #Education #Sustainability #Governance",
    "AI readiness is not only a technology question. It is also a skills, governance, ethics, workforce and human-readiness question. OMNeXa connects these dimensions so transformation can be useful, responsible and sustainable. #AIReadiness #ResponsibleAI #FutureSkills",
    "Opportunity should not depend on geography. Through education, career, skills and ecosystem initiatives, OMNeXa is working to make future opportunities easier to discover and navigate—especially for students, job seekers, innovators and emerging institutions. #FutureOfEducation #SkillsBasedHiring #CareerDevelopment",
  ],
  X: [
    "The future is converging: AI, skills, governance, sustainability and human well-being. OMNeXa is building practical bridges between them. Where Consciousness Meets Intelligence. #FutureReady #AI",
    "AI readiness ≠ technology alone. Skills + governance + ethics + workforce readiness + human adaptability matter too. That is the OMNeXa lens. #ResponsibleAI #FutureOfWork",
    "Better access to education, skills and jobs can change the trajectory of people and communities. We are building for that future. #FutureOfEducation #Skills",
  ],
  Instagram: [
    "A new kind of transformation ecosystem is taking shape. 🌏 OMNeXa connects intelligence with human purpose across AI, education, careers, governance, sustainability and well-being. Follow the journey. #OMNeXa #FutureReady #FutureOfWork",
    "Technology changes fast. Human readiness must evolve with it. 🤝 Our work connects AI readiness with skills, governance, sustainability and well-being. #ResponsibleAI #HumanTransformation",
    "From students and job seekers to institutions and businesses—we believe future opportunity should be more connected, accessible and practical. 🎓💼 #FutureOfEducation #CareerDevelopment #SkillsBasedHiring",
  ],
};

const keywordClusters = [
  ["future of work", "AI readiness", "future-ready workforce", "human transformation"],
  ["future of education", "career ecosystem", "skills-based hiring", "student opportunities"],
  ["AML KYC sanctions", "risk governance", "regulatory transformation", "responsible AI governance"],
  ["ESG transformation", "sustainability strategy", "sustainable business", "climate readiness"],
  ["human well-being", "digital well-being", "healthy habits", "human-centered technology"],
];

function copy(text: string) {
  navigator.clipboard?.writeText(text);
}

export default function GrowthEnginePage() {
  const [platform, setPlatform] = useState<Platform>("LinkedIn");
  const [campaign, setCampaign] = useState("OMNeXa ecosystem launch");
  const [pillar, setPillar] = useState(pillars[0]);
  const [baseUrl, setBaseUrl] = useState("https://omnexagoc.com");
  const [metrics, setMetrics] = useState<Metric[]>([
    { platform: "LinkedIn", impressions: 0, engagements: 0, clicks: 0, leads: 0 },
    { platform: "X", impressions: 0, engagements: 0, clicks: 0, leads: 0 },
    { platform: "Instagram", impressions: 0, engagements: 0, clicks: 0, leads: 0 },
  ]);

  useEffect(() => {
    const saved = localStorage.getItem("omnexa-growth-metrics");
    if (saved) setMetrics(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("omnexa-growth-metrics", JSON.stringify(metrics));
  }, [metrics]);

  const utm = useMemo(() => {
    const params = new URLSearchParams({
      utm_source: platform.toLowerCase(),
      utm_medium: "organic_social",
      utm_campaign: campaign.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      utm_content: pillar.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    });
    return `${baseUrl}?${params.toString()}`;
  }, [baseUrl, campaign, pillar, platform]);

  const scores = metrics.map((m) => ({
    ...m,
    engagementRate: m.impressions ? (m.engagements / m.impressions) * 100 : 0,
    clickRate: m.impressions ? (m.clicks / m.impressions) * 100 : 0,
    leadRate: m.clicks ? (m.leads / m.clicks) * 100 : 0,
  }));
  const best = [...scores].sort((a, b) => (b.leads * 8 + b.clicks * 2 + b.engagements) - (a.leads * 8 + a.clicks * 2 + a.engagements))[0];

  return (
    <main className="growth-page">
      <style>{`
        .growth-page{min-height:100vh;background:#08101f;color:#eef4ff;padding:48px 20px 90px;font-family:Inter,system-ui,sans-serif}.growth-shell{width:min(1180px,100%);margin:auto}.growth-hero{padding:34px 0 24px}.growth-kicker{color:#69d6c9;font-weight:900;letter-spacing:.14em;text-transform:uppercase;font-size:.75rem}.growth-page h1{font-size:clamp(2.8rem,6vw,5.8rem);line-height:.95;margin:10px 0 18px;max-width:960px}.growth-page h2{font-size:1.55rem;margin:0 0 18px}.growth-page h3{margin:0 0 8px}.growth-page p{color:#aebbd1;line-height:1.65}.growth-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:16px}.panel{background:#101b2e;border:1px solid #26364f;border-radius:16px;padding:22px}.span-8{grid-column:span 8}.span-7{grid-column:span 7}.span-6{grid-column:span 6}.span-5{grid-column:span 5}.span-4{grid-column:span 4}.span-12{grid-column:span 12}.tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}.tab,.copy-btn{border:1px solid #334864;background:#16243a;color:#eaf2ff;border-radius:999px;padding:9px 13px;font-weight:800;cursor:pointer}.tab.active{background:#69d6c9;color:#07101d;border-color:#69d6c9}.profile-copy,.post-card,.utm{background:#0a1424;border:1px solid #24354e;border-radius:12px;padding:16px;white-space:pre-wrap;color:#dce7f7;line-height:1.6}.post-card+ .post-card{margin-top:10px}.action-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}.field{display:grid;gap:7px;margin-bottom:12px}.field label{color:#9fabc0;font-size:.82rem;font-weight:800}.field input,.field select{width:100%;background:#0a1424;border:1px solid #2a3e5b;color:#eef4ff;border-radius:10px;padding:12px}.metric-grid{display:grid;grid-template-columns:1.2fr repeat(4,1fr);gap:8px;align-items:center}.metric-grid input{min-width:0;background:#0a1424;border:1px solid #2a3e5b;color:#fff;border-radius:8px;padding:9px}.metric-head{color:#7f91ab;font-size:.7rem;text-transform:uppercase;font-weight:900}.pill{display:inline-block;border:1px solid #39506e;border-radius:999px;padding:6px 9px;margin:4px 4px 0 0;color:#cad7e8;font-size:.78rem}.insight{border-left:4px solid #69d6c9;padding-left:14px}.week{display:grid;grid-template-columns:repeat(7,1fr);gap:8px}.day{background:#0a1424;border:1px solid #24354e;border-radius:10px;padding:12px;min-height:122px}.day strong{display:block;color:#69d6c9;margin-bottom:8px}.day small{color:#aebbd1;line-height:1.45}.note{font-size:.82rem;color:#8394ad!important}.score{font-size:1.8rem;font-weight:900;color:#69d6c9}.danger{color:#ffbd83}.footer-note{margin-top:22px;border-top:1px solid #26364f;padding-top:18px}@media(max-width:850px){.span-8,.span-7,.span-6,.span-5,.span-4{grid-column:span 12}.week{grid-template-columns:1fr 1fr}.metric-grid{grid-template-columns:1fr 1fr}.metric-head{display:none}}`}</style>
      <div className="growth-shell">
        <section className="growth-hero">
          <div className="growth-kicker">OMNeXa Growth Engine · private workspace MVP</div>
          <h1>Build authority. Create useful content. Learn from what converts.</h1>
          <p>This workspace converts OMNeXa's six pillars into a repeatable organic social and search-discovery practice. No auto-posting, bots, mass following or paid API dependency is required.</p>
        </section>

        <div className="growth-grid">
          <section className="panel span-7">
            <h2>1 · Optimized social profiles</h2>
            <div className="tabs">{(["LinkedIn","X","Instagram"] as Platform[]).map((p)=><button className={`tab ${platform===p?"active":""}`} onClick={()=>setPlatform(p)} key={p}>{p}</button>)}</div>
            <div className="profile-copy">{profileCopy[platform]}</div>
            <div className="action-row"><button className="copy-btn" onClick={()=>copy(profileCopy[platform])}>Copy profile</button></div>
          </section>

          <section className="panel span-5">
            <h2>2 · Search & discovery map</h2>
            <p>Use natural language consistently across profiles, posts, website pages and partner mentions. Avoid keyword stuffing.</p>
            {keywordClusters.map((cluster,i)=><div key={i}>{cluster.map(k=><span className="pill" key={k}>{k}</span>)}</div>)}
          </section>

          <section className="panel span-8">
            <h2>3 · Launch content bank</h2>
            {launchPosts[platform].map((post,i)=><div className="post-card" key={post}><strong>Post {i+1}</strong><br/>{post}<div className="action-row"><button className="copy-btn" onClick={()=>copy(post)}>Copy</button></div></div>)}
          </section>

          <section className="panel span-4">
            <h2>4 · UTM campaign builder</h2>
            <div className="field"><label>Campaign</label><input value={campaign} onChange={e=>setCampaign(e.target.value)}/></div>
            <div className="field"><label>Pillar</label><select value={pillar} onChange={e=>setPillar(e.target.value)}>{pillars.map(p=><option key={p}>{p}</option>)}</select></div>
            <div className="field"><label>Destination URL</label><input value={baseUrl} onChange={e=>setBaseUrl(e.target.value)}/></div>
            <div className="utm">{utm}</div>
            <div className="action-row"><button className="copy-btn" onClick={()=>copy(utm)}>Copy tracking URL</button></div>
          </section>

          <section className="panel span-12">
            <h2>5 · Weekly publishing rhythm</h2>
            <div className="week">
              <div className="day"><strong>Mon</strong><small>Insight / point of view<br/>LinkedIn + X</small></div>
              <div className="day"><strong>Tue</strong><small>Education / career opportunity<br/>LinkedIn + Instagram</small></div>
              <div className="day"><strong>Wed</strong><small>Founder or expert perspective<br/>LinkedIn + X</small></div>
              <div className="day"><strong>Thu</strong><small>Tool, framework or carousel<br/>LinkedIn + Instagram</small></div>
              <div className="day"><strong>Fri</strong><small>Partner / ecosystem story<br/>All platforms</small></div>
              <div className="day"><strong>Sat</strong><small>Human well-being / values<br/>Instagram + X</small></div>
              <div className="day"><strong>Sun</strong><small>Review metrics; repurpose winner</small></div>
            </div>
          </section>

          <section className="panel span-8">
            <h2>6 · Learning loop</h2>
            <p>Enter native platform analytics once a week. Data stays in this browser via localStorage in this MVP.</p>
            <div className="metric-grid metric-head"><span>Platform</span><span>Impressions</span><span>Engagements</span><span>Clicks</span><span>Leads</span></div>
            {metrics.map((m,idx)=><div className="metric-grid" key={m.platform}><strong>{m.platform}</strong>{(["impressions","engagements","clicks","leads"] as const).map(key=><input aria-label={`${m.platform} ${key}`} type="number" min="0" value={m[key]} onChange={e=>setMetrics(prev=>prev.map((row,i)=>i===idx?{...row,[key]:Number(e.target.value)}:row))} key={key}/>)}</div>)}
          </section>

          <section className="panel span-4">
            <h2>7 · Self-evolving recommendation</h2>
            <div className="score">{best.platform}</div>
            <p className="insight">Current winner by weighted lead, click and engagement signal. Next week, allocate roughly 40% of high-effort content to the best-performing platform, 35% to the second, and 25% to experiments.</p>
            <p>Engagement rate: <strong>{best.engagementRate.toFixed(2)}%</strong><br/>Click rate: <strong>{best.clickRate.toFixed(2)}%</strong><br/>Lead conversion: <strong>{best.leadRate.toFixed(2)}%</strong></p>
          </section>

          <section className="panel span-6">
            <h2>8 · Connection practice</h2>
            <p><strong>Daily, human-reviewed:</strong></p>
            <p>• Comment meaningfully on 5–10 posts from educators, employers, regulators, sustainability leaders, AI builders and ecosystem partners.<br/>• Send only contextual connection requests where there is a credible common interest.<br/>• Turn repeated questions into public explainers.<br/>• Invite genuine partners to contribute viewpoints and co-create content.</p>
            <p className="note">Do not use automated follows, mass DMs or engagement bots. They can damage trust and may violate platform rules.</p>
          </section>

          <section className="panel span-6">
            <h2>9 · Cost control</h2>
            <p><strong>Phase 1 — $0 incremental:</strong> this browser workspace + native platform scheduling/analytics + existing OMNeXa website.</p>
            <p><strong>Phase 2 — optional:</strong> connect official APIs or approved scheduling tools only after organic workflow produces enough volume to justify them.</p>
            <p><strong>Phase 3 — selective paid growth:</strong> sponsor only posts and lead magnets already proven organically.</p>
          </section>
        </div>
        <p className="footer-note note">MVP scope: content operations and measurement. It does not authenticate to LinkedIn, X or Instagram and therefore cannot create or modify those accounts directly.</p>
      </div>
    </main>
  );
}
