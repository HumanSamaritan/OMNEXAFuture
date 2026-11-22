"use client";

import Script from "next/script";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { PilotProduct } from "@/lib/pilot-catalog";
import { AVAILABILITY_OPTIONS, EXPERIENCE_LEVELS, type PilotApplication } from "@/lib/pilot-types";
import { B2C_BENEFIT, B2B_BENEFIT, PILOT_AGREEMENT_VERSION, PILOT_PRIVACY_NOTICE, PILOT_TERMS, pilotAgreementText } from "@/lib/pilot-agreement";

declare global {
  interface Window {
    omnexaPilotCaptchaSuccess?: (token: string) => void;
    omnexaPilotCaptchaExpired?: () => void;
  }
}

type Receipt = { reference: string; preview: boolean; agreementCopy: string; appUrl: string; appUrls?: { name: string; url: string }[] };
type Entitlement = {slug:string;previouslyApplied:boolean;access:boolean;status:"eligible"|"under_review"|"not_found"};
type EntitlementCheck = {source:"verified"|"unavailable";reason?:string;products:Entitlement[]};
type SignPayload = { session: string; application: PilotApplication; signature: string; signatureActionTime: string; agreementVersion: string; ndaConsent: boolean; privacyConsent: boolean; adultConsent: boolean; benefitConsent: boolean; authorityConsent: boolean; captchaToken: string };
const regionNames = new Intl.DisplayNames(["en"], {type: "region"});
const countryNames = Array.from({length:26*26},(_,i)=>String.fromCharCode(65+Math.floor(i/26),65+i%26)).map(code=>regionNames.of(code) ?? code).filter((name,i)=>name.length>2 && name !== String.fromCharCode(65+Math.floor(i/26),65+i%26)).sort();
const euEea = new Set(["Austria","Belgium","Bulgaria","Croatia","Cyprus","Czechia","Denmark","Estonia","Finland","France","Germany","Greece","Hungary","Iceland","Ireland","Italy","Latvia","Liechtenstein","Lithuania","Luxembourg","Malta","Netherlands","Norway","Poland","Portugal","Romania","Slovakia","Slovenia","Spain","Sweden"]);
function countryPrivacyNote(country: string): string {
  if (euEea.has(country)) return "EU/EEA applicants: GDPR rights and transfer protections may apply. Pilot registration only covers application administration and does not authorise HMS health or wellbeing processing. OMNeXa must assess any transfers outside the EEA."; 
  if (country === "United Kingdom") return "UK applicants: UK GDPR and the Data Protection Act may apply. Cross-border transfer safeguards and separate HMS wellbeing consent must be reviewed."; 
  if (country === "Singapore") return "Singapore applicants: OMNeXa processes this pilot request under the Singapore PDPA. You can request access, correction or withdrawal subject to applicable law."; 
  return "Local privacy requirements may apply in your country. This consent covers only pilot administration, not in-app wellbeing processing; OMNeXa will assess relevant local restrictions before product access.";
}
const steps = ["Build your pilot cart", "Your experience", "Review & sign"];

function downloadText(text: string, filename: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
  const link = document.createElement("a"); link.href = url; link.download = filename; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function post(path: string, body: unknown) {
  const response = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: AbortSignal.timeout(45000) });
  let data;
  try { data = await response.json(); } catch { throw new Error("The service could not respond. Please try again shortly."); }
  if (!response.ok) throw new Error(data.error || "Unable to complete this step. Please try again.");
  return data;
}

export default function PilotForm({ products, initialProduct, preview, ready, recaptchaSiteKey }: { products: PilotProduct[]; initialProduct: string; preview: boolean; ready: boolean; recaptchaSiteKey: string }) {
  const initial = products.find((item) => item.slug === initialProduct);
  const [step, setStep] = useState(0);
  const [audienceFilter, setAudienceFilter] = useState("all");
  const [application, setApplication] = useState<PilotApplication>({ productSlug: initialProduct, productSlugs: initialProduct ? [initialProduct] : [], initiativeSlug: initial?.initiativeSlug || "", fullName: "", email: "", country: "", organisation: "", role: "", experienceLevel: "", experience: "", goals: "", availability: "" });
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [adultConsent, setAdultConsent] = useState(false);
  const [ndaConsent, setNdaConsent] = useState(false);
  const [benefitConsent, setBenefitConsent] = useState(false);
  const [authorityConsent, setAuthorityConsent] = useState(false);
  const [signature, setSignature] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [challenge, setChallenge] = useState("");
  const [verifiedSession, setVerifiedSession] = useState("");
  const [enrolment, setEnrolment] = useState<EntitlementCheck | null>(null);
  const signedRequest = useRef<SignPayload | null>(null);
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const captchaContainer = useRef<HTMLDivElement>(null);
  const captchaWidget = useRef<number | null>(null);
  const product = products.find((item) => item.slug === application.productSlug);
  const selectedProducts = products.filter((item) => (application.productSlugs || [application.productSlug]).includes(item.slug));
  const b2b = selectedProducts.some((item) => item.audience === "B2B");
  const b2c = selectedProducts.some((item) => item.audience === "B2C");
  const mixed = b2b && b2c;
  const agreementAudience = mixed ? "MIXED" : b2b ? "B2B" : "B2C";
  const categoryGroups = Array.from(new Set(selectedProducts.map((item) => item.initiativeSlug))).map((slug) => ({ slug, name: selectedProducts.find((item) => item.initiativeSlug === slug)!.initiativeName, items: selectedProducts.filter((item) => item.initiativeSlug === slug) }));
  const captchaRequired = !preview;
  const choices = products.filter((item) => item.initiativeSlug === application.initiativeSlug && (audienceFilter === "all" || item.audience === audienceFilter));
  const initiatives = Array.from(new Map(products.filter((item) => audienceFilter === "all" || item.audience === audienceFilter).map((item) => [item.initiativeSlug, item.initiativeName])).entries());

  useEffect(() => {
    window.omnexaPilotCaptchaSuccess = (token) => { setCaptchaToken(token); setError(""); };
    window.omnexaPilotCaptchaExpired = () => setCaptchaToken("");
    return () => { delete window.omnexaPilotCaptchaSuccess; delete window.omnexaPilotCaptchaExpired; };
  }, []);
  useEffect(() => { if (step > 0) stepHeading.current?.focus(); }, [step]);

  function renderCaptcha() {
    const api = window.grecaptcha?.enterprise as unknown as { render?: (container: HTMLElement, options: Record<string, unknown>) => number } | undefined;
    if (!api?.render || !captchaContainer.current || captchaWidget.current !== null) return;
    captchaWidget.current = api.render(captchaContainer.current, {
      sitekey: recaptchaSiteKey, size: "compact",
      callback: (token: string) => { setCaptchaToken(token); setError(""); },
      "expired-callback": () => setCaptchaToken(""), "error-callback": () => setCaptchaToken("")
    });
  }
  useEffect(() => {
    if (step === 1 && captchaRequired) renderCaptcha();
    return () => { captchaWidget.current = null; };
    // The widget belongs to this form step and is recreated after returning to it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, captchaRequired]);

  function update(key: keyof PilotApplication, value: string) { setEnrolment(null); setVerifiedSession(""); setChallenge(""); setApplication((old) => ({ ...old, [key]: value })); }
  function toggleProduct(item: PilotProduct) {
    setEnrolment(null); setVerifiedSession(""); setChallenge("");
    setApplication((old) => {
      const current = old.productSlugs || (old.productSlug ? [old.productSlug] : []);
      const next = current.includes(item.slug) ? current.filter((slug) => slug !== item.slug) : [...current, item.slug];
      const valid = next;
      const first = products.find((candidate) => candidate.slug === valid[0]);
      return { ...old, productSlugs: valid, productSlug: first?.slug || "", initiativeSlug: old.initiativeSlug || item.initiativeSlug };
    });
  }
  function changeStep(next: number) { setError(""); setCaptchaToken(""); setStep(next); }
  function editDetails() {
    setSignature(""); setNdaConsent(false); setBenefitConsent(false); setAuthorityConsent(false); signedRequest.current = null; changeStep(1);
  }

  async function sendCode() {
    setError(""); setBusy(true);
    try {
      const result = await post("/api/pilot/send", { application, privacyConsent, adultConsent, captchaToken });
      setChallenge(result.challenge);
      setVerifiedSession("");
      setVerificationCode("");
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to send code."); }
    finally { setBusy(false); }
  }
  async function verifyCode() {
    setError(""); setBusy(true);
    try {
      const result = await post("/api/pilot/verify", { challenge, code: verificationCode });
      setVerifiedSession(result.session);
      let status: EntitlementCheck = {source:"unavailable",reason:"Current enrolment could not be verified.",products:[]};
      try { status = await post("/api/pilot/entitlements", {session:result.session}); } catch { /* Do not mistake unavailable eligibility for a new applicant. */ }
      setEnrolment(status);
      const allExisting = status.source === "verified" && status.products.length === selectedProducts.length && status.products.length > 0 && status.products.every((item)=>item.previouslyApplied);
      changeStep(allExisting ? 4 : 2);
    } catch (e) { setError(e instanceof Error ? e.message : "Verification failed."); }
    finally { setBusy(false); }
  }
  async function submit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    if(enrolment?.source === "verified" && enrolment.products.some((item)=>item.previouslyApplied)) { setError("You already have an enrolment for one or more selected products. Remove those products, then verify your email again before submitting new interests."); return; }
    setError(""); setBusy(true);
    if (!signedRequest.current) signedRequest.current = { session: verifiedSession, application, signature, signatureActionTime: new Date().toISOString(), agreementVersion: PILOT_AGREEMENT_VERSION, ndaConsent, privacyConsent, adultConsent, benefitConsent, authorityConsent, captchaToken };
    try {
      const data: Receipt = await post("/api/pilot/apply", signedRequest.current);
      setReceipt(data); changeStep(3);
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to submit. Your details are still available for retry."); }
    finally { setBusy(false); }
  }

  return (
    <>
      {captchaRequired && recaptchaSiteKey ? <Script id="omnexa-pilot-recaptcha" src="https://www.google.com/recaptcha/enterprise.js?render=explicit" strategy="afterInteractive" onReady={renderCaptcha} /> : null}
      {preview ? <div className="pilot-preview" role="note"><strong>Preview · Test applications only</strong><span>Preview tests email verification and confirmation without storing a pilot application. No binding contract, enrolment or subscription is activated.</span></div> : null}
      <ol className="pilot-steps" aria-label="Application progress">
        {steps.map((label, index) => <li key={label} className={step === index ? "is-current" : step > index ? "is-complete" : ""} aria-current={step === index ? "step" : undefined}><span>{step > index ? "✓" : index + 1}</span>{label}</li>)}
      </ol>
      <div className="pilot-layout">
        <section className="pilot-form-panel" aria-labelledby="pilot-step-title">
          {!ready ? <p className="pilot-error" role="status">Pilot registration email is temporarily unavailable. You can still review the application; please contact <a href="mailto:support@omnexagoc.com">support@omnexagoc.com</a> to register your interest.</p> : null}
          {error ? <p className="pilot-error" role="alert">{error}</p> : null}
          {step === 0 ? <form onSubmit={(event) => { event.preventDefault(); if (selectedProducts.length) changeStep(1); }}>
            <p className="pilot-step-label">Step 01 / 03</p>
            <h2 id="pilot-step-title" ref={stepHeading} tabIndex={-1}>Find the right pilot for you.</h2>
            <p className="pilot-lead">Browse categories and select any number of available pilot interests. Your selections remain in the cart as you switch categories. Individual and organisational pilots have separate eligibility requirements.</p>
            <fieldset className="pilot-route-choice"><legend>I want to explore</legend>
              {[["all", "All pilots"], ["B2C", "Individual / B2C"], ["B2B", "Organisation / B2B"]].map(([value, label]) => <label key={value}><input type="radio" name="audience" value={value} checked={audienceFilter === value} onChange={() => { setAudienceFilter(value); setApplication((old) => ({ ...old, initiativeSlug: old.initiativeSlug, productSlug: old.productSlug, productSlugs: old.productSlugs })); }} /><span>{label}</span></label>)}
            </fieldset>
            
            <div className="pilot-section-heading"><span className="pilot-section-index">01</span><div><h3>Explore service categories</h3><p>Choose a category, select the products that interest you, then continue browsing. Your cart is saved as you switch categories.</p></div></div>
            <label className="pilot-field">Initiative / service area<select value={application.initiativeSlug} onChange={(event) => { setVerifiedSession(""); setChallenge(""); setApplication((old) => ({ ...old, initiativeSlug: event.target.value })); }} required><option value="">Choose an initiative</option>{initiatives.map(([slug, name]) => <option key={slug} value={slug}>{name}</option>)}</select></label>
            <div className="pilot-section-heading"><span className="pilot-section-index">02</span><div><h3>Choose pilot products</h3><p>Select one or more products from this category. A single consolidated application will cover your final selection.</p></div></div>
            <fieldset className="pilot-product-choice"><legend>Available products</legend>
              {choices.length ? choices.map((item) => <label key={item.slug} className={selectedProducts.some((p) => p.slug === item.slug) ? "is-selected" : ""}><input type="checkbox" name="products" value={item.slug} checked={selectedProducts.some((p) => p.slug === item.slug)} onChange={() => toggleProduct(item)} /><span><strong>{item.name}</strong><small>{item.description} · {item.audience === "B2C" ? "Individual / B2C" : "Organisation / B2B"}{item.readiness === "review" ? " · Pilot readiness under review" : ""}</small></span><span className={`pilot-type ${item.audience.toLowerCase()}`}>{item.audience}</span></label>) : <p className="pilot-empty">Select an initiative to see its products.</p>}
            </fieldset>
            <section className="pilot-cart" aria-label="Selected pilot cart">
              <header className="pilot-cart-header"><div><span className="pilot-cart-eyebrow">YOUR SELECTION</span><h3>Selected pilot cart</h3><p>All service areas, one application and one confirmation.</p></div><strong className="pilot-count">{selectedProducts.length} selected</strong></header>
              {selectedProducts.length ? categoryGroups.map((group) => <div className="pilot-category" key={group.slug}><div className="pilot-category-heading"><h4>{group.name}</h4><span>{group.items.length} product{group.items.length !== 1 ? "s" : ""}</span></div><div className="pilot-product-table" role="table" aria-label={group.name}><div className="pilot-table-header" role="row"><span role="columnheader">Product</span><span role="columnheader">Purpose / availability</span><span role="columnheader">Action</span></div>{group.items.map((item) => <div className="pilot-table-row" role="row" key={item.slug}><div role="cell"><strong>{item.name}</strong><span className={`pilot-type ${item.audience.toLowerCase()}`}>{item.audience}</span></div><div role="cell"><p>{item.description}</p>{item.readiness === "review" ? <small>Readiness subject to review</small> : null}</div><div role="cell"><button className="pilot-remove" type="button" onClick={() => toggleProduct(item)}>Remove</button></div></div>)}</div></div>) : <p className="pilot-cart-empty">No products selected. Explore a category above to add your first pilot.</p>}
              {selectedProducts.length ? <p className="pilot-cart-note">B2C and B2B interests will be reviewed under their respective participation terms. Selection does not guarantee access.</p> : null}
            </section>
            <div className="pilot-actions"><button className="pilot-primary" type="submit" disabled={!selectedProducts.length}>Continue to your experience <span aria-hidden="true">→</span></button></div>
          </form> : null}

          {step === 1 && challenge ? <div className="pilot-verify">
            <p>Enter the six-digit code sent to {application.email}.</p>
            <label className="pilot-field">Verification code<input inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} /></label>
            <button className="pilot-primary" type="button" disabled={busy || !(/^[0-9]{6}$/).test(verificationCode)} onClick={() => void verifyCode()}>Verify email and continue</button>
            <p className="pilot-fine">If the code has not arrived, check Spam/Junk and the email address above. Codes expire after 10 minutes.</p>
            <button className="pilot-text-button" type="button" disabled={busy} onClick={() => void sendCode()}>Send a new verification code</button>
          </div> : null}
          {step === 1 && !challenge ? <form onSubmit={(event) => { event.preventDefault(); if (!captchaRequired || captchaToken) void sendCode(); }}>
            <p className="pilot-step-label">Step 02 / 03</p>
            <h2 id="pilot-step-title" ref={stepHeading} tabIndex={-1}>Tell us what you bring.</h2>
            <p className="pilot-lead">Personal experience matters as much as professional experience. All fields are required unless marked optional.</p>
            <div className="pilot-field-grid">
              <label className="pilot-field">Full legal name<input value={application.fullName} onChange={(e) => update("fullName", e.target.value)} autoComplete="name" minLength={2} maxLength={100} required /></label>
              <label className="pilot-field">Email address<input type="email" value={application.email} onChange={(e) => update("email", e.target.value)} autoComplete="email" maxLength={254} required /></label>
              <label className="pilot-field">Country / region<select value={application.country} onChange={(e) => update("country", e.target.value)} required><option value="">Select your country</option>{countryNames.map(name=><option key={name} value={name}>{name}</option>)}</select></label>
              <label className="pilot-field">{b2b ? "Job title / role" : "Your role or perspective"}<input value={application.role} onChange={(e) => update("role", e.target.value)} placeholder={b2b ? "e.g. Product lead" : "e.g. Parent, learner, caregiver"} minLength={2} maxLength={120} required /></label>
            </div>
            <label className="pilot-field">Organisation {b2b ? "" : "(optional)"}<input value={application.organisation} onChange={(e) => update("organisation", e.target.value)} autoComplete="organization" maxLength={160} minLength={b2b ? 2 : undefined} required={b2b} /></label>
            <label className="pilot-field">Experience in this area<select value={application.experienceLevel} onChange={(e) => update("experienceLevel", e.target.value)} required><option value="">Choose your experience level</option>{EXPERIENCE_LEVELS.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="pilot-field">Tell us about your relevant experience<textarea value={application.experience} onChange={(e) => update("experience", e.target.value)} rows={4} minLength={20} maxLength={2000} placeholder="Share the situations, skills or everyday experience that relate to this product." required /><small>20–2,000 characters. Please leave out medical, financial, identity and confidential employer/client details.</small></label>
            <label className="pilot-field">What would you like to test or help improve?<textarea value={application.goals} onChange={(e) => update("goals", e.target.value)} rows={3} minLength={20} maxLength={1600} required /></label>
            <label className="pilot-field">Time you could contribute<select value={application.availability} onChange={(e) => update("availability", e.target.value)} required><option value="">Choose your availability</option>{AVAILABILITY_OPTIONS.map((item) => <option key={item}>{item}</option>)}</select></label>
            {application.country ? <p className="pilot-benefit-note" role="note"><strong>Privacy for {application.country}:</strong> {countryPrivacyNote(application.country)}</p> : null}
            <details className="pilot-disclosure"><summary>How we use your application details</summary><p>{PILOT_PRIVACY_NOTICE}</p><a href="/privacy" target="_blank" rel="noreferrer">Read the privacy notice ↗</a></details>
            <label className="pilot-check"><input type="checkbox" checked={adultConsent} onChange={(e) => setAdultConsent(e.target.checked)} required /><span>I am at least 18 and legally able to enter this agreement. For a child-related pilot, I am applying as an adult parent or guardian.</span></label>
            <label className="pilot-check"><input type="checkbox" checked={privacyConsent} onChange={(e) => setPrivacyConsent(e.target.checked)} required /><span>I have reviewed the pilot privacy notice for my selected country, including possible processing outside that country. I consent to processing my application and receiving related email; I understand this is separate from HMS wellbeing-data consent.</span></label>
            {captchaRequired && recaptchaSiteKey ? <div className="pilot-captcha" ref={captchaContainer} /> : preview ? <p className="pilot-note">Human verification is skipped in this private preview; it is required for live applications.</p> : null}
            <div className="pilot-actions"><button type="button" className="pilot-secondary" onClick={() => changeStep(0)} disabled={busy}>Back</button><button className="pilot-primary" type="submit" disabled={busy || !ready || (captchaRequired && !captchaToken)}>Continue to review & sign →</button></div>
            <p className="pilot-fine">Your email is collected so the support team can reply if your pilot is selected. This flow sends one message to support only.</p>
          </form> : null}

          {step === 2 && product ? <form onSubmit={submit}>
            <p className="pilot-step-label">Step 03 / 03</p>
            <h2 id="pilot-step-title" ref={stepHeading} tabIndex={-1}>Review the agreement and sign.</h2>
            <p className="pilot-lead">{preview ? "Try the NDA acceptance flow below. This preview acceptance is non-binding." : "Read the product-specific agreement before signing. Your request will be reviewed before any pilot access is granted."}</p>
            {enrolment?.source === "unavailable" ? <div className="pilot-benefit-note" role="status">Existing pilot enrolments could not be checked at this time. This does not mean you are not enrolled. {enrolment.reason}</div> : null}
            {enrolment?.source === "verified" && enrolment.products.some((item)=>item.previouslyApplied) ? <div className="pilot-benefit-note" role="status"><strong>Existing enrolment recognised</strong><p>One or more selected products already have a pilot record. You do not need to register again for these products. Edit your selection to remove them and verify your email again before applying for additional products.</p>{enrolment.products.filter((item)=>item.previouslyApplied).map((item)=><p key={item.slug}>{products.find((p)=>p.slug===item.slug)?.name || item.slug}: {item.access?"Access eligible":"Under review — no access yet"}</p>)}<button type="button" className="pilot-secondary" onClick={()=>{setEnrolment(null); setVerifiedSession(""); setChallenge("");changeStep(0);}}>Edit selected products</button></div> : null}
            <div className="pilot-review-overview"><div><span>Applicant</span><strong>{application.fullName}</strong></div><div><span>Verified email</span><strong>{application.email}</strong></div>{b2b ? <div><span>Organisation</span><strong>{application.organisation}</strong></div> : null}<div><span>Selected pilots</span><strong>{selectedProducts.length} across {categoryGroups.length} categor{categoryGroups.length === 1 ? "y" : "ies"}</strong></div></div>
            <section className="pilot-cart pilot-review-cart" aria-label="Final selected products">
              <header className="pilot-cart-header"><div><span className="pilot-cart-eyebrow">APPLICATION SUMMARY</span><h3>Confirm your selected products</h3><p>This is how your products will be grouped in your confirmation email.</p></div><strong className="pilot-count">{selectedProducts.length} selected</strong></header>
              {categoryGroups.map((group) => <div className="pilot-category" key={group.slug}><div className="pilot-category-heading"><h4>{group.name}</h4><span>{group.items.length} product{group.items.length !== 1 ? "s" : ""}</span></div><div className="pilot-product-table" role="table" aria-label={group.name}><div className="pilot-table-header" role="row"><span role="columnheader">Product</span><span role="columnheader">Description</span><span role="columnheader">Explore</span></div>{group.items.map((item) => <div className="pilot-table-row" role="row" key={item.slug}><div role="cell"><strong>{item.name}</strong><span className={`pilot-type ${item.audience.toLowerCase()}`}>{item.audience}</span></div><div role="cell"><p>{item.description}</p>{item.readiness === "review" ? <small>Pilot readiness under review</small> : null}</div><div role="cell"><a href={item.browseUrl} target="_blank" rel="noopener noreferrer">Browse product ↗</a></div></div>)}</div></div>)}
              <p className="pilot-cart-note">One consolidated submission, subject to product-specific eligibility and access requirements.</p>
            </section>
            <details className="pilot-disclosure"><summary>Review your experience and testing interests</summary><p><strong>{application.experienceLevel}</strong></p><p>{application.experience}</p><p>{application.goals}</p><p>Availability: {application.availability}</p><button className="pilot-text-button" type="button" disabled={busy} onClick={editDetails}>Edit details and verify again</button></details>
            <p className="pilot-benefit-note">{b2c ? B2C_BENEFIT : ""} {b2b ? B2B_BENEFIT : ""} Each selected product is assessed separately; selection does not imply approval, activation or availability.</p>
            <details className="pilot-nda" open>
              <summary>Pilot Participation & Non-Disclosure Agreement <small>Version {PILOT_AGREEMENT_VERSION} · {selectedProducts.length} products</small></summary>
              <div className="pilot-agreement-copy"><p><strong>Selected products:</strong> {selectedProducts.map((p) => p.name).join(", ")} ({mixed ? "B2C + B2B" : product.audience})</p>{preview ? <p className="pilot-fine">Preview draft for testing; no binding contract is created.</p> : null}{PILOT_TERMS.map((term) => <section key={term.title}><h3>{term.title}</h3><p>{term.text}</p></section>)}</div>
            </details>
            <button className="pilot-text-button" type="button" onClick={() => downloadText(pilotAgreementText(selectedProducts.map((p) => `${p.initiativeName}: ${p.name} (${p.audience})`).join("; "), agreementAudience), `omnexa-selected-pilots-agreement-${PILOT_AGREEMENT_VERSION}.txt`)}>Download this agreement before signing ↓</button>
            <fieldset className="pilot-signature" disabled={busy || !!signedRequest.current}><legend>Your electronic signature</legend>
              <label className="pilot-field">Type your full legal name<input value={signature} onChange={(e) => setSignature(e.target.value)} autoComplete="name" maxLength={100} required /><small>Enter {application.fullName}. Your typed name records your intention to sign.</small></label>
              <label className="pilot-check"><input type="checkbox" checked={ndaConsent} onChange={(e) => setNdaConsent(e.target.checked)} required /><span>{preview ? "I have reviewed the NDA and agree to test the electronic acceptance flow. I understand this preview is non-binding." : "I have read and agree to the Pilot Participation and Non-Disclosure Agreement, and intend my typed name and final submission to be my electronic signature."}</span></label>
              <label className="pilot-check"><input type="checkbox" checked={benefitConsent} onChange={(e) => setBenefitConsent(e.target.checked)} required /><span>{mixed ? "I understand the B2C benefit is per eligible product actually tested, while B2B pilots have separate organisational terms; registration does not grant access." : b2b ? "I understand B2B products have separate organisational terms and no individual six-month benefit." : "I understand the six-month benefit applies only to B2C products actually tested with the agreed feedback."}</span></label>
              {b2b ? <label className="pilot-check"><input type="checkbox" checked={authorityConsent} onChange={(e) => setAuthorityConsent(e.target.checked)} required /><span>I am authorised to represent the organisation named above for this pilot application and agreement.</span></label> : null}
            </fieldset>
            <div className="pilot-actions"><button className="pilot-secondary" type="button" onClick={editDetails} disabled={busy}>Edit application</button><button className="pilot-primary" type="submit" disabled={busy || (enrolment?.source === "verified" && enrolment.products.some((item)=>item.previouslyApplied)) || !ndaConsent || !benefitConsent || (b2b && !authorityConsent) || signature.trim().replace(/\s+/g, " ").toLowerCase() !== application.fullName.trim().replace(/\s+/g, " ").toLowerCase()}>{busy ? "Submitting…" : signedRequest.current ? "Retry this submission" : preview ? "Submit test acceptance & request" : "Sign agreement & submit request"}</button></div>
            <p className="pilot-fine">In preview, a test confirmation email goes to your verified address without storing a pilot registration. In production, the application and agreement record are processed for pilot onboarding.</p>
          </form> : null}

          {step === 4 && enrolment?.source === "verified" ? <div className="pilot-success">
            <span className="pilot-success-icon" aria-hidden="true">✓</span>
            <p className="pilot-step-label">Existing pilot enrolment found</p>
            <h2 id="pilot-step-title" ref={stepHeading} tabIndex={-1}>You're already registered for these products.</h2>
            <p>We recognised your verified email in the pilot records. There is no need to register again. Access depends on each product's current eligibility status.</p>
            <div className="pilot-cart">{categoryGroups.map((group)=><div className="pilot-category" key={group.slug}><div className="pilot-category-heading"><h4>{group.name}</h4></div>{group.items.map((item)=>{const status=enrolment.products.find((p)=>p.slug===item.slug);return <div className="pilot-table-row" key={item.slug}><div><strong>{item.name}</strong><span className={`pilot-type ${item.audience.toLowerCase()}`}>{item.audience}</span></div><div><p>{status?.access?"Eligible to use this product after sign-in":"Registration exists — access under review"}</p></div><div>{status?.access?<a href={item.browseUrl} target="_blank" rel="noopener noreferrer">Open product ↗</a>:<span>Await approval</span>}</div></div>})}</div>)}</div>
            <div className="pilot-actions"><button type="button" className="pilot-secondary" onClick={()=>{setEnrolment(null);setVerifiedSession("");setChallenge("");changeStep(0);}}>Explore additional products</button></div>
          </div> : null}
          {step === 3 && receipt ? <div className="pilot-success">
            <span className="pilot-success-icon" aria-hidden="true">✓</span><p className="pilot-step-label">{receipt.preview ? "Preview test complete" : "Application received"}</p>
            <h2 id="pilot-step-title" ref={stepHeading} tabIndex={-1}>{receipt.preview ? "Your email-flow test is complete." : "Thank you for helping shape the product."}</h2>
            <p>{receipt.preview ? "This was a preview-only email test. No application has been stored or sent to the pilot intake queue." : <>Your {selectedProducts.map((p) => p.name).join(", ")} application has been sent to <strong>support@omnexagoc.com</strong>.</>}</p>
            <p>A confirmation email with your reference and agreement copy will be sent to your verified address.</p>
            {!receipt.preview && (receipt.appUrls?.length ? receipt.appUrls : receipt.appUrl ? [{ name: product?.name || "Product", url: receipt.appUrl }] : []).map((item) => <p key={item.url}><a href={item.url} target="_blank" rel="noopener noreferrer">Visit {item.name} →</a></p>)}
            <div className="pilot-reference"><span>Application reference</span><strong>{receipt.reference}</strong></div>
            <p>{receipt.preview ? "This preview test has not stored an application, created a binding contract, enrolled you in a pilot or activated a subscription." : "OMNeXa will review your experience and contact you about suitability, timing and next steps. Please wait for an invitation before testing."}</p>
            <div className="pilot-actions"><button className="pilot-primary" type="button" onClick={() => downloadText(receipt.agreementCopy, `${receipt.reference}-agreement.txt`)}>Download your agreement copy ↓</button><a className="pilot-text-button" href="/work">Back to Our Work →</a></div>
          </div> : null}
        </section>

        <aside className="pilot-aside">
          <p className="pilot-step-label">Your pilot journey</p>
          <h2>{selectedProducts.length ? selectedProducts.map((p) => p.name).join(", ") : "Choose where you can make a difference."}</h2>
          {product ? <><span className={`pilot-type ${product.audience.toLowerCase()}`}>{b2b ? "Organisation / B2B" : "Individual / B2C"}</span><p>{product.initiativeName}</p></> : <p>Explore individual products and organisational pilots across the OMNeXa ecosystem.</p>}
          <div className="pilot-aside-benefit"><strong>{mixed ? "B2C and B2B pilot terms" : b2b ? "A pilot built around your organisation" : "6 months of free subscription"}</strong><p>{mixed ? "Individual and organisational pilot interests are reviewed separately. The six-month benefit can only apply to eligible B2C products actually tested." : b2b ? "Organisational pilot scope, access and terms are agreed separately." : "For users who take part in a B2C pilot and provide agreed feedback. Applies only to the eligible product actually tested."}</p></div>
          <ul className="pilot-journey"><li><span>01</span>Tell us about your experience</li><li><span>02</span>Review and sign the NDA</li><li><span>03</span>Send one support notification</li><li><span>04</span>Wait for a pilot invitation</li></ul>
          <p className="pilot-fine">{product?.slug === "human-machine-sadhana"
            ? "Human Machine Sadhana is live. This application is for pilot participation; submitting it does not enrol you or activate a subscription. We’ll review your application and send product-specific next steps."
            : "Availability and pilot access vary by product. Submitting an application records your interest; it does not by itself grant pilot access or activate a subscription. We’ll contact you with product-specific next steps."}</p>
          <a href="mailto:support@omnexagoc.com">Questions? Contact support →</a>
        </aside>
      </div>
    </>
  );
}
