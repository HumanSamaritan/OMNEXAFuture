"use client";
import Script from "next/script";
import { preparationQuestions } from "@/lib/consultancy-preparation";
import { FormEvent, useEffect, useState } from "react";

export default function ConsultancyCheckout({ serviceId, recaptchaSiteKey, termsUrl, available }: { serviceId: string; recaptchaSiteKey: string; termsUrl: string; available: boolean }) {
  const [captchaToken, setCaptchaToken] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    window.omnexaRecaptchaSuccess = setCaptchaToken;
    window.omnexaRecaptchaExpired = () => setCaptchaToken("");
    return () => { delete window.omnexaRecaptchaSuccess; delete window.omnexaRecaptchaExpired; };
  }, []);
  async function checkout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const fields = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      const response = await fetch("/api/consultancy/checkout", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...fields, preparation: Object.fromEntries((preparationQuestions[serviceId] || []).map(q => [q.id, fields[`prep_${q.id}`]])), serviceId, captchaToken, acceptTerms: fields.acceptTerms === "on" }) });
      const data = await response.json();
      if (!response.ok || !data.url) throw new Error(data.error || "Unable to open checkout.");
      const destination = new URL(data.url);
      if (destination.protocol !== "https:" || destination.hostname !== "checkout.stripe.com") throw new Error("Invalid checkout destination.");
      window.location.assign(destination.href);
    } catch (error) { setError(error instanceof Error ? error.message : "Checkout unavailable."); setCaptchaToken(""); window.grecaptcha?.enterprise?.reset(); setBusy(false); }
  }
  return <form className="consultancy-form" onSubmit={checkout}>
    {available ? <Script src="https://www.google.com/recaptcha/enterprise.js" strategy="afterInteractive" /> : null}
    <h2>Pay securely, then choose a time</h2>
    <p>Payment purchases one session. Select your calendar slot after payment is verified. Use this browser to return to scheduling. If no suitable time is available, contact OMNeXa under the payment terms before making another payment.</p>
    <label>Full name<input name="name" required minLength={2} maxLength={100} autoComplete="name" /></label>
    <label>Email<input name="email" type="email" required maxLength={254} autoComplete="email" /></label>
    <label>Company or organisation (optional)<input name="company" maxLength={160} /></label>
    <label>Role (optional)<input name="jobTitle" maxLength={120} /></label>
    <h3>Make the session useful from the start</h3>
    {(preparationQuestions[serviceId] || []).map(question => <label key={question.id}>{question.label}<textarea name={`prep_${question.id}`} required minLength={3} maxLength={180} rows={3} /><small>{question.hint}</small></label>)}
    <label>What is the main outcome you want from this session?<textarea name="focus" required minLength={10} maxLength={400} rows={3} /></label>
    <p>Use anonymised examples. Do not share customer records, passwords or medical information.</p>
    <label><span><input type="checkbox" name="acceptTerms" required disabled={!available} /> I have read and accept the {termsUrl ? <a href={termsUrl} target="_blank" rel="noopener noreferrer">payment, cancellation and refund terms</a> : "payment, cancellation and refund terms (available before checkout opens)"}.</span></label>
    {available && recaptchaSiteKey ? <div className="g-recaptcha" data-sitekey={recaptchaSiteKey} data-callback="omnexaRecaptchaSuccess" data-expired-callback="omnexaRecaptchaExpired" /> : null}
    {error ? <p className="consultancy-error" role="alert">{error}</p> : null}
    <button className="button primary" disabled={!available || busy || !captchaToken || !termsUrl}>{busy ? "Opening checkout…" : (available ? "Continue to Stripe payment" : "Secure payment setup in progress")}</button>
    {!available ? <p role="status">Paid checkout is not open yet. Your answers stay in this page until you can continue; no payment or appointment has been created. Please keep this page open or return when checkout is available.</p> : null}
    <a href="/consultancy/book?service=discovery">Prefer to discuss fit first? Book a free 15-minute introduction.</a>
  </form>;
}
