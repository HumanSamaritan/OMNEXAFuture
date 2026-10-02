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

type Receipt = { reference: string; preview: boolean; agreementCopy: string };
type SignPayload = { application: PilotApplication; signature: string; signatureActionTime: string; agreementVersion: string; ndaConsent: boolean; privacyConsent: boolean; adultConsent: boolean; benefitConsent: boolean; authorityConsent: boolean; captchaToken: string };
const steps = ["Choose a pilot", "Your experience", "Review & sign"];

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
  const [application, setApplication] = useState<PilotApplication>({ productSlug: initialProduct, initiativeSlug: initial?.initiativeSlug || "", fullName: "", email: "", country: "", organisation: "", role: "", experienceLevel: "", experience: "", goals: "", availability: "" });
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
  const signedRequest = useRef<SignPayload | null>(null);
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const captchaContainer = useRef<HTMLDivElement>(null);
  const captchaWidget = useRef<number | null>(null);
  const product = products.find((item) => item.slug === application.productSlug);
  const b2b = product?.audience === "B2B";
  const initiatives = Array.from(new Map(products.filter((item) => audienceFilter === "all" || item.audience === audienceFilter).map((item) => [item.initiativeSlug, item.initiativeName])).entries());
  const choices = products.filter((item) => item.initiativeSlug === application.initiativeSlug && (audienceFilter === "all" || item.audience === audienceFilter));

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
    if (step === 1) renderCaptcha();
    return () => { captchaWidget.current = null; };
    // The widget belongs to this form step and is recreated after returning to it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  function update(key: keyof PilotApplication, value: string) { setApplication((old) => ({ ...old, [key]: value })); }
  function changeStep(next: number) { setError(""); setCaptchaToken(""); setStep(next); }
  function editDetails() {
    setSignature(""); setNdaConsent(false); setBenefitConsent(false); setAuthorityConsent(false); signedRequest.current = null; changeStep(1);
  }

  async function submit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault(); setError(""); setBusy(true);
    if (!signedRequest.current) signedRequest.current = { application, signature, signatureActionTime: new Date().toISOString(), agreementVersion: PILOT_AGREEMENT_VERSION, ndaConsent, privacyConsent, adultConsent, benefitConsent, authorityConsent, captchaToken };
    try {
      const data: Receipt = await post("/api/pilot/apply", signedRequest.current);
      setReceipt(data); changeStep(3);
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to submit. Your details are still available for retry."); }
    finally { setBusy(false); }
  }

  return (
    <>
      {recaptchaSiteKey ? <Script id="omnexa-pilot-recaptcha" src="https://www.google.com/recaptcha/enterprise.js?render=explicit" strategy="afterInteractive" onReady={renderCaptcha} /> : null}
      {preview ? <div className="pilot-preview" role="note"><strong>Preview · Test applications only</strong><span>One support notification is sent for each submitted interest. No binding contract, pilot enrolment or subscription is activated in this preview.</span></div> : null}
      <ol className="pilot-steps" aria-label="Application progress">
        {steps.map((label, index) => <li key={label} className={step === index ? "is-current" : step > index ? "is-complete" : ""} aria-current={step === index ? "step" : undefined}><span>{step > index ? "✓" : index + 1}</span>{label}</li>)}
      </ol>
      <div className="pilot-layout">
        <section className="pilot-form-panel" aria-labelledby="pilot-step-title">
          {!ready ? <p className="pilot-error" role="status">Pilot registration email is temporarily unavailable. You can still review the application; please contact <a href="mailto:support@omnexagoc.com">support@omnexagoc.com</a> to register your interest.</p> : null}
          {error ? <p className="pilot-error" role="alert">{error}</p> : null}
          {step === 0 ? <form onSubmit={(event) => { event.preventDefault(); if (product) changeStep(1); }}>
            <p className="pilot-step-label">Step 01 / 03</p>
            <h2 id="pilot-step-title" ref={stepHeading} tabIndex={-1}>Find the right pilot for you.</h2>
            <p className="pilot-lead">Choose one product per application. You can apply separately for another product.</p>
            <fieldset className="pilot-route-choice"><legend>I want to explore</legend>
              {[["all", "All pilots"], ["B2C", "Individual / B2C"], ["B2B", "Organisation / B2B"]].map(([value, label]) => <label key={value}><input type="radio" name="audience" value={value} checked={audienceFilter === value} onChange={() => { setAudienceFilter(value); setApplication((old) => ({ ...old, initiativeSlug: "", productSlug: "" })); }} /><span>{label}</span></label>)}
            </fieldset>
            <label className="pilot-field">Initiative / service area<select value={application.initiativeSlug} onChange={(event) => setApplication((old) => ({ ...old, initiativeSlug: event.target.value, productSlug: "" }))} required><option value="">Choose an initiative</option>{initiatives.map(([slug, name]) => <option key={slug} value={slug}>{name}</option>)}</select></label>
            <fieldset className="pilot-product-choice"><legend>Product to test</legend>
              {choices.length ? choices.map((item) => <label key={item.slug} className={product?.slug === item.slug ? "is-selected" : ""}><input type="radio" name="product" value={item.slug} checked={application.productSlug === item.slug} onChange={() => update("productSlug", item.slug)} required /><span><strong>{item.name}</strong><small>{item.audience === "B2C" ? "Individual pilot · 1-year subscription benefit" : "Organisation pilot · separate terms"}</small></span><span className={`pilot-type ${item.audience.toLowerCase()}`}>{item.audience}</span></label>) : <p className="pilot-empty">Select an initiative to see its products.</p>}
            </fieldset>
            {product ? <p className="pilot-benefit-note">{b2b ? B2B_BENEFIT : B2C_BENEFIT}</p> : null}
            <div className="pilot-actions"><button className="pilot-primary" type="submit" disabled={!product}>Continue to your experience <span aria-hidden="true">→</span></button></div>
          </form> : null}

          {step === 1 ? <form onSubmit={(event) => { event.preventDefault(); if (captchaToken) changeStep(2); }}>
            <p className="pilot-step-label">Step 02 / 03</p>
            <h2 id="pilot-step-title" ref={stepHeading} tabIndex={-1}>Tell us what you bring.</h2>
            <p className="pilot-lead">Personal experience matters as much as professional experience. All fields are required unless marked optional.</p>
            <div className="pilot-field-grid">
              <label className="pilot-field">Full legal name<input value={application.fullName} onChange={(e) => update("fullName", e.target.value)} autoComplete="name" minLength={2} maxLength={100} required /></label>
              <label className="pilot-field">Email address<input type="email" value={application.email} onChange={(e) => update("email", e.target.value)} autoComplete="email" maxLength={254} required /></label>
              <label className="pilot-field">Country / region<input value={application.country} onChange={(e) => update("country", e.target.value)} autoComplete="country-name" minLength={2} maxLength={80} required /></label>
              <label className="pilot-field">{b2b ? "Job title / role" : "Your role or perspective"}<input value={application.role} onChange={(e) => update("role", e.target.value)} placeholder={b2b ? "e.g. Product lead" : "e.g. Parent, learner, caregiver"} minLength={2} maxLength={120} required /></label>
            </div>
            <label className="pilot-field">Organisation {b2b ? "" : "(optional)"}<input value={application.organisation} onChange={(e) => update("organisation", e.target.value)} autoComplete="organization" maxLength={160} minLength={b2b ? 2 : undefined} required={b2b} /></label>
            <label className="pilot-field">Experience in this area<select value={application.experienceLevel} onChange={(e) => update("experienceLevel", e.target.value)} required><option value="">Choose your experience level</option>{EXPERIENCE_LEVELS.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="pilot-field">Tell us about your relevant experience<textarea value={application.experience} onChange={(e) => update("experience", e.target.value)} rows={4} minLength={20} maxLength={2000} placeholder="Share the situations, skills or everyday experience that relate to this product." required /><small>20–2,000 characters. Please leave out medical, financial, identity and confidential employer/client details.</small></label>
            <label className="pilot-field">What would you like to test or help improve?<textarea value={application.goals} onChange={(e) => update("goals", e.target.value)} rows={3} minLength={20} maxLength={1600} required /></label>
            <label className="pilot-field">Time you could contribute<select value={application.availability} onChange={(e) => update("availability", e.target.value)} required><option value="">Choose your availability</option>{AVAILABILITY_OPTIONS.map((item) => <option key={item}>{item}</option>)}</select></label>
            <details className="pilot-disclosure"><summary>How we use your application details</summary><p>{PILOT_PRIVACY_NOTICE}</p><a href="/privacy" target="_blank" rel="noreferrer">Read the privacy notice ↗</a></details>
            <label className="pilot-check"><input type="checkbox" checked={adultConsent} onChange={(e) => setAdultConsent(e.target.checked)} required /><span>I am at least 18 and legally able to enter this agreement. For a child-related pilot, I am applying as an adult parent or guardian.</span></label>
            <label className="pilot-check"><input type="checkbox" checked={privacyConsent} onChange={(e) => setPrivacyConsent(e.target.checked)} required /><span>I consent to OMNeXa processing these details and emailing me about this application as described above.</span></label>
            {recaptchaSiteKey ? <div className="pilot-captcha" ref={captchaContainer} /> : null}
            <div className="pilot-actions"><button type="button" className="pilot-secondary" onClick={() => changeStep(0)} disabled={busy}>Back</button><button className="pilot-primary" type="submit" disabled={busy || !ready || !captchaToken}>Continue to review & sign →</button></div>
            <p className="pilot-fine">Your email is collected so the support team can reply if your pilot is selected. This flow sends one message to support only.</p>
          </form> : null}

          {step === 2 && product ? <form onSubmit={submit}>
            <p className="pilot-step-label">Step 03 / 03</p>
            <h2 id="pilot-step-title" ref={stepHeading} tabIndex={-1}>Review the agreement and sign.</h2>
            <p className="pilot-lead">{preview ? "Try the NDA acceptance flow below. This preview acceptance is non-binding." : "Read the product-specific agreement before signing. Your request will be reviewed before any pilot access is granted."}</p>
            <dl className="pilot-review"><div><dt>Applicant</dt><dd>{application.fullName}</dd></div><div><dt>Email</dt><dd>{application.email}</dd></div><div><dt>Product</dt><dd>{product.name} · {product.audience}</dd></div>{b2b ? <div><dt>Organisation</dt><dd>{application.organisation}</dd></div> : null}</dl>
            <details className="pilot-disclosure"><summary>Review your experience and testing interests</summary><p><strong>{application.experienceLevel}</strong></p><p>{application.experience}</p><p>{application.goals}</p><p>Availability: {application.availability}</p><button className="pilot-text-button" type="button" disabled={busy} onClick={editDetails}>Edit details and verify again</button></details>
            <p className="pilot-benefit-note">{b2b ? B2B_BENEFIT : B2C_BENEFIT}</p>
            <details className="pilot-nda" open>
              <summary>Pilot Participation & Non-Disclosure Agreement <small>Version {PILOT_AGREEMENT_VERSION} · {product.name}</small></summary>
              <div className="pilot-agreement-copy"><p><strong>Selected product:</strong> {product.name} ({product.audience})</p>{preview ? <p className="pilot-fine">Preview draft for testing; no binding contract is created.</p> : null}{PILOT_TERMS.map((term) => <section key={term.title}><h3>{term.title}</h3><p>{term.text}</p></section>)}</div>
            </details>
            <button className="pilot-text-button" type="button" onClick={() => downloadText(pilotAgreementText(product.name, product.audience), `${product.slug}-pilot-agreement-${PILOT_AGREEMENT_VERSION}.txt`)}>Download this agreement before signing ↓</button>
            <fieldset className="pilot-signature" disabled={busy || !!signedRequest.current}><legend>Your electronic signature</legend>
              <label className="pilot-field">Type your full legal name<input value={signature} onChange={(e) => setSignature(e.target.value)} autoComplete="name" maxLength={100} required /><small>Enter {application.fullName}. Your typed name records your intention to sign.</small></label>
              <label className="pilot-check"><input type="checkbox" checked={ndaConsent} onChange={(e) => setNdaConsent(e.target.checked)} required /><span>{preview ? "I have reviewed the NDA and agree to test the electronic acceptance flow. I understand this preview is non-binding." : "I have read and agree to the Pilot Participation and Non-Disclosure Agreement, and intend my typed name and final submission to be my electronic signature."}</span></label>
              <label className="pilot-check"><input type="checkbox" checked={benefitConsent} onChange={(e) => setBenefitConsent(e.target.checked)} required /><span>{b2b ? "I understand this B2B pilot does not include the one-year free individual subscription offer." : "I understand the one-year free subscription is for participants who take part in this B2C product pilot and provide the agreed feedback; registration alone does not qualify."}</span></label>
              {b2b ? <label className="pilot-check"><input type="checkbox" checked={authorityConsent} onChange={(e) => setAuthorityConsent(e.target.checked)} required /><span>I am authorised to represent the organisation named above for this pilot application and agreement.</span></label> : null}
            </fieldset>
            <div className="pilot-actions"><button className="pilot-secondary" type="button" onClick={editDetails} disabled={busy}>Edit application</button><button className="pilot-primary" type="submit" disabled={busy || !ndaConsent || !benefitConsent || (b2b && !authorityConsent) || signature.trim().replace(/\s+/g, " ").toLowerCase() !== application.fullName.trim().replace(/\s+/g, " ").toLowerCase()}>{busy ? "Submitting…" : signedRequest.current ? "Retry this submission" : preview ? "Submit test acceptance & request" : "Sign agreement & submit request"}</button></div>
            <p className="pilot-fine">Your application and agreement copy go to support@omnexagoc.com. This flow sends one support message only; no confirmation email is sent to you.</p>
          </form> : null}

          {step === 3 && receipt ? <div className="pilot-success">
            <span className="pilot-success-icon" aria-hidden="true">✓</span><p className="pilot-step-label">{receipt.preview ? "Preview test complete" : "Application received"}</p>
            <h2 id="pilot-step-title" ref={stepHeading} tabIndex={-1}>{receipt.preview ? "Your test request is with us." : "Thank you for helping shape the product."}</h2>
            <p>Your {product?.name} application has been sent to <strong>support@omnexagoc.com</strong>.</p>
            <p>No email is sent to the applicant in this lower-cost flow. OMNeXa support will contact you if the pilot team needs more information.</p>
            <div className="pilot-reference"><span>Application reference</span><strong>{receipt.reference}</strong></div>
            <p>{receipt.preview ? "This test has not created a binding contract, enrolled you in a pilot or activated a subscription." : "OMNeXa will review your experience and contact you about suitability, timing and next steps. Please wait for an invitation before testing."}</p>
            <div className="pilot-actions"><button className="pilot-primary" type="button" onClick={() => downloadText(receipt.agreementCopy, `${receipt.reference}-agreement.txt`)}>Download your agreement copy ↓</button><a className="pilot-text-button" href="/work">Back to Our Work →</a></div>
          </div> : null}
        </section>

        <aside className="pilot-aside">
          <p className="pilot-step-label">Your pilot journey</p>
          <h2>{product?.name || "Choose where you can make a difference."}</h2>
          {product ? <><span className={`pilot-type ${product.audience.toLowerCase()}`}>{b2b ? "Organisation / B2B" : "Individual / B2C"}</span><p>{product.initiativeName}</p></> : <p>Explore individual products and organisational pilots across the OMNeXa ecosystem.</p>}
          <div className="pilot-aside-benefit"><strong>{b2b ? "A pilot built around your organisation" : "1 year of free subscription"}</strong><p>{b2b ? "Scope, access and commercial terms are agreed separately. The individual subscription offer does not apply." : "For users who participate in a B2C product pilot and provide the agreed feedback. Applies to the product tested, once its subscription service becomes available."}</p></div>
          <ul className="pilot-journey"><li><span>01</span>Tell us about your experience</li><li><span>02</span>Review and sign the NDA</li><li><span>03</span>Send one support notification</li><li><span>04</span>Wait for a pilot invitation</li></ul>
          <p className="pilot-fine">All products remain Coming Soon. Registration does not provide access to unfinished applications.</p>
          <a href="mailto:support@omnexagoc.com">Questions? Contact support →</a>
        </aside>
      </div>
    </>
  );
}
