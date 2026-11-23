"use client";

import { useMemo, useState } from "react";

type Mode = "lead" | "setu";
type Scenario = { id: string; sector: string; name: string; kid: string; event: string; mandate: string; response: string[]; evidence: string[]; recovery: string; };
const scenarios: Scenario[] = [
  {id:"payments",sector:"Banking",name:"Payment-operations agent",kid:"An AI helper prepares payments, but five new people appear on the list.",event:"Five first-seen beneficiaries detected in a reconciliation batch",mandate:"Prepare payment instructions only. Independent gateway controls release.",response:["Level 1: ask payment analyst to examine the batch","Level 2: block gateway execution and hold the queue","Level 3: suspend the agent, revoke scoped tool rights and inspect in-flight requests"],evidence:["Policy and risk threshold version","Gateway's confirmed block acknowledgement","Queue and in-flight status","IAM permission revocation confirmation","Actor/timestamp and on-call notifications","Reconciliation, RCA and independent restart approval"],recovery:"Verify beneficiaries and transfers, investigate, test gateway denial, sign independent restart and restore only minimum rights."},
  {id:"factory",sector:"Manufacturing",name:"Smart quality inspection",kid:"A smart camera says a cracked toy is fine. A person needs to check.",event:"Defective items repeatedly classified as PASS",mandate:"Recommend quality classification; AI cannot operate the physical safety system.",response:["Level 1: quality inspector examines flagged samples","Level 2: quarantine affected batch and use manual inspection","Level 3: trained plant team enacts certified safety response if needed; suspend affected AI"],evidence:["Sample images and lot identifiers","Inspector and supervisor approvals","Quarantine and line state","Safety controller status, where applicable","Maintenance and quality test results","Independent safe-restart signoff"],recovery:"Inspect equipment and product lots, recalibrate and validate, then obtain plant safety/QA restart approval."},
  {id:"hms",sector:"Everyday AI",name:"HMS • Wellness reflection",kid:"An AI helper gives advice too confidently. Ask a trusted person.",event:"Overconfident personalised wellbeing recommendation",mandate:"Support reflection; no diagnosis or unapproved clinical claims.",response:["Level 1: request human review of the message","Level 2: disable personalised suggestions, keep safe reflection tools","Level 3: suspend affected AI suggestion feature"],evidence:["Consent and age appropriateness","Content and safety-rule version","Moderation decision","Feature-disable verification","Privacy-safe incident record","Approved correction"],recovery:"Review wording and safeguards; test the affected feature; restore after accountable approval."},
  {id:"kriya",sector:"Everyday AI",name:"NeXaKriya • Family planning",kid:"An AI helper tries to change someone else's tasks without asking.",event:"Proposed edit to another person's calendar/task list without consent",mandate:"Read only by default; write only for scoped, authorised users.",response:["Level 1: ask the task owner to approve","Level 2: keep read-only access; disable write tools","Level 3: suspend the automation and revoke access"],evidence:["Owner/assignee roles","Consent and calendar scope","Attempted change audit","Blocked write acknowledgement","Revoked permission status","Approval before any restoration"],recovery:"Check affected tasks, correct any unintended edits, retest write boundaries and get user approval."},
  {id:"virama",sector:"Everyday AI",name:"NeXaVirama • Pause companion",kid:"A helper says something unsuitable for a child. Stop and ask a grown-up.",event:"Age-inappropriate or potentially harmful coaching response",mandate:"Offer age-appropriate pause support; protect minors' privacy.",response:["Level 1: moderator or trusted adult reviews","Level 2: disable generated coaching; keep approved static prompts","Level 3: suspend AI coaching and preserve privacy-safe evidence"],evidence:["Age/consent route","Moderation rule and output category","Feature disable result","No unwanted data disclosure","Incident response record","Independent review and test"],recovery:"Remediate coaching safeguards and permissions; test child safety and obtain human sign-off."}
];
const colors={navy:"#10263a",gold:"#aa7c2e",light:"#edf3f4",teal:"#126a6a"};
export default function HumanDefinedAIDemoPage() {
  const [selected,setSelected]=useState("payments");
  const [mode,setMode]=useState<Mode>("lead");
  const [step,setStep]=useState(0);
  const [level,setLevel]=useState("2");
  const [checked,setChecked]=useState<string[]>([]);
  const [audience,setAudience]=useState("professional");
  const current=useMemo(()=>scenarios.find(s=>s.id===selected)!,[selected]);
  const reset=(id:string)=>{setSelected(id);setStep(0);setChecked([]);setLevel("2");};
  const timeline=["Risk signal detected","Compare against human-approved mandate","Independent gate holds unsafe action","Notify responsible humans and check all downstream tools","Preserve evidence and confirm effective containment","Investigate, remediate and independently approve restart"];
  const label=(s:string)=>audience==="young" ? s.replace("beneficiaries","people receiving money").replace("mandate","allowed job") : s;
  return <main style={{fontFamily:"Arial, sans-serif",color:colors.navy,maxWidth:1120,margin:"0 auto",padding:"2rem 1rem 5rem"}}>
    <p style={{fontSize:13,letterSpacing:2,color:colors.gold,fontWeight:700}}>OMNeXa • HUMAN-DEFINED AI</p>
    <h1 style={{fontSize:"clamp(2rem,4vw,3rem)",lineHeight:1.12,margin:".7rem 0"}}>NeXaLead × NeXaSetu scenario laboratory</h1>
    <p>Choose a situation, learn when to intervene and assess whether the safety controls would work.</p>
    <p style={{padding:12,background:"#fff4df",borderRadius:8,fontWeight:700}}>Illustrative learning prototype only • Not NeXaLead or NeXaSetu production • No real payments, machines, app accounts, or incident records are connected.</p>
    <div style={{display:"flex",gap:12,flexWrap:"wrap",margin:"1.4rem 0"}}>
      <label>Scenario<br/><select aria-label="Scenario" value={selected} onChange={e=>reset(e.target.value)} style={{padding:12,minWidth:260}}>{scenarios.map(s=><option key={s.id} value={s.id}>{s.sector} — {s.name}</option>)}</select></label>
      <label>Audience<br/><select aria-label="Audience" value={audience} onChange={e=>setAudience(e.target.value)} style={{padding:12}}><option value="professional">Professionals</option><option value="young">Kids and beginners</option></select></label>
    </div>
    <div role="tablist" aria-label="Learning mode" style={{display:"flex",gap:8}}>
      {(["lead","setu"] as const).map(m=><button key={m} role="tab" aria-selected={mode===m} onClick={()=>setMode(m)} style={{padding:13,borderRadius:8,cursor:"pointer",border:"1px solid #889",background:mode===m?colors.navy:"white",color:mode===m?"white":colors.navy,fontWeight:700}}>{m==="lead"?"NeXaLead • Decide":"NeXaSetu • Verify"}</button>)}
    </div>
    <section style={{border:"1px solid #cfdae0",borderRadius:14,padding:24,marginTop:12}}>
      <p style={{color:colors.gold,fontWeight:700}}>{current.sector.toUpperCase()} / SIMULATION</p>
      <h2>{current.name}</h2>
      <p style={{fontSize:19}}>{audience==="young"?current.kid:label(current.event)}</p>
      <p><strong>Approved boundary:</strong> {label(current.mandate)}</p>
      {mode==="lead"?<>
        <h3>Which response would you choose?</h3>
        {current.response.map((r,i)=><label key={r} style={{display:"block",padding:12,background:level===String(i+1)?colors.light:"white",borderRadius:7,marginBottom:6}}><input name="intervention" type="radio" value={i+1} checked={level===String(i+1)} onChange={()=>setLevel(String(i+1))}/> {label(r)}</label>)}
        <p><strong>Important:</strong> High-risk situations may go directly to Level 3. A Level 3 decision needs independent technical enforcement and human recovery authority.</p>
        <h3>Step-by-step response</h3>
        <ol>{timeline.slice(0,step+1).map(t=><li key={t} style={{marginBottom:8}}>{label(t)}</li>)}</ol>
        <button onClick={()=>setStep(s=>Math.min(timeline.length-1,s+1))} disabled={step===timeline.length-1} style={{padding:12,background:colors.teal,color:"white",border:0,borderRadius:8}}>Next simulated control</button>
        <button onClick={()=>setStep(0)} style={{padding:12,marginLeft:8,borderRadius:8}}>Reset</button>
      </>:<>
        <h3>NeXaSetu assurance: which evidence has actually been checked?</h3>
        {current.evidence.map(e=><label key={e} style={{display:"block",padding:10,background:colors.light,borderRadius:8,marginBottom:6}}><input type="checkbox" checked={checked.includes(e)} onChange={ev=>setChecked(a=>ev.target.checked?[...a,e]:a.filter(x=>x!==e))}/> {e}</label>)}
        <p><strong>Training checklist:</strong> {checked.length}/{current.evidence.length} selected. Learner selections do not establish real-world control effectiveness.</p>
        <p><strong>Recovery gate:</strong> {current.recovery}</p>
        <p><strong>Status:</strong> PROPOSED / DESIGNED — implementation and effective containment require separately verified evidence.</p>
      </>}
    </section>
    <p style={{fontSize:13,color:"#506473",marginTop:22}}>Do not use this training page to trigger real banking transfers, operate machinery, make health decisions or administer children's accounts. OMNeXa scenario design, 23 November 2026.</p>
  </main>
}
