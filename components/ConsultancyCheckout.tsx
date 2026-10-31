"use client";
import Script from "next/script";
import { FormEvent, useEffect, useState } from "react";

export default function ConsultancyCheckout({ serviceId, recaptchaSiteKey, termsUrl }: { serviceId: string; recaptchaSiteKey: string; termsUrl: string }) {
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
      const response = await fetch("/api/consultancy/checkout", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...fields, serviceId, captchaToken, acceptTerms: fields.acceptTerms === "on" }) });
      const data = await response.json();
      if (!response.ok || !data.url) throw new Error(data.error || "Unable to open checkout.");
      const destination = new URL(data.url);
      if (destination.protocol !== "https:" || destination.hostname !== "checkout.stripe.com") throw new Error("Invalid checkout destination.");
      window.location.assign(destination.href);
    } catch (error) { setError(error instanceof Error ? error.message : "Checkout unavailable."); setCaptchaToken(""); window.grecaptcha?.enterprise?.reset(); setBusy(false); }
  }
  return <form className="consultancy-form" onSubmit={checkout}>
    <Script src="https://www.google.com/recaptcha/enterprise.js" strategy="afterInteractive" />
    <h2>Pay securely, then choose a time</h2>
    <p>Payment purchases one session. Select your calendar slot after payment is verified. Use this browser to return to scheduling. If no suitable time is available, contact OMNeXa under the payment terms before making another payment.</p>
    <label>Full name<input name="name" required minLength={2} maxLength={100} autoComplete="name" /></label>
    <label>Email<input name="email" type="email" required maxLength={254} autoComplete="email" /></label>
    <label>Company or organisation (optional)<input name="company" maxLength={160} /></label>
    <label>Role (optional)<input name="jobTitle" maxLength={120} /></label>
    <label>Your question and intended outcome<textarea name="focus" required minLength={10} maxLength={1200} rows={4} /></label>
    <p>Use anonymised examples. Do not share customer records, passwords or medical information.</p>
    <label><span><input type="checkbox" name="acceptTerms" required /> I have read and accept the <a href={termsUrl} target="_blank" rel="noopener noreferrer">payment, cancellation and refund terms</a>.</span></label>
    {recaptchaSiteKey ? <div className="g-recaptcha" data-sitekey={recaptchaSiteKey} data-callback="omnexaRecaptchaSuccess" data-expired-callback="omnexaRecaptchaExpired" /> : <p>Human verification is temporarily unavailable.</p>}
    {error ? <p className="consultancy-error" role="alert">{error}</p> : null}
    <button className="button primary" disabled={busy || !captchaToken || !termsUrl}>{busy ? "Opening checkout…" : "Continue to Stripe payment"}</button>
    <a href="/consultancy/book?service=discovery">Prefer to discuss fit first? Book a free 15-minute introduction.</a>
  </form>;
}
