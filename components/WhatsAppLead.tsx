"use client";

import { FormEvent, useEffect, useState } from "react";

const WHATSAPP_NUMBER = "6590671304";

export default function WhatsAppLead() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const organisation = String(data.get("organisation") || "").trim();
    const interest = String(data.get("interest") || "").trim();
    const message = String(data.get("message") || "").trim();

    const text = [
      "Hello OMNeXa,",
      "",
      "I would like to connect regarding the following:",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Contact Number: ${phone}` : null,
      organisation ? `Organisation: ${organisation}` : null,
      `Area of Interest: ${interest}`,
      `Message: ${message}`,
      "",
      "Please let me know the next steps. Thank you."
    ]
      .filter(Boolean)
      .join("\n");

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );

    form.reset();
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        className="whatsapp-fab"
        aria-label="Contact OMNeXa on WhatsApp"
        onClick={() => setOpen(true)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.9">
          <path d="M20 11.6a8 8 0 0 1-11.8 7L4 20l1.4-4A8 8 0 1 1 20 11.6Z" />
          <path d="M8.8 8.2c.4 2.9 2.4 4.9 5.4 5.7l1.3-1.4 2 .7c-.2 1.8-1.2 2.8-2.8 2.8-4.2-.3-7.4-3.4-7.8-7.6 0-1.5.9-2.5 2.6-2.8l.8 2-1.5.6Z" />
        </svg>
        <span>WhatsApp</span>
      </button>

      {open ? (
        <div
          className="whatsapp-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setOpen(false);
          }}
        >
          <div className="whatsapp-modal" role="dialog" aria-modal="true" aria-labelledby="whatsapp-title">
            <div className="whatsapp-modal-header">
              <div>
                <h2 id="whatsapp-title">Talk to OMNeXa on WhatsApp</h2>
                <p>
                  Share a few details first so the conversation starts with the right context. Your message
                  will open in WhatsApp for you to review before sending.
                </p>
              </div>
              <button type="button" className="whatsapp-close" aria-label="Close WhatsApp form" onClick={() => setOpen(false)}>
                ×
              </button>
            </div>

            <form className="whatsapp-form" onSubmit={handleSubmit}>
              <div className="field-grid">
                <label>
                  Name
                  <input name="name" type="text" placeholder="Your full name" required minLength={2} />
                </label>
                <label>
                  Email
                  <input name="email" type="email" placeholder="you@company.com" required />
                </label>
              </div>

              <div className="field-grid">
                <label>
                  Contact number
                  <input name="phone" type="tel" placeholder="Country code + number" />
                </label>
                <label>
                  Organisation
                  <input name="organisation" type="text" placeholder="Company / institution" />
                </label>
              </div>

              <label>
                Area of interest
                <select name="interest" defaultValue="" required>
                  <option value="" disabled>Select one</option>
                  <option>AI & Responsible Transformation</option>
                  <option>Risk, Controls, AML/KYC & Governance</option>
                  <option>Technology & Banking Transformation</option>
                  <option>Leadership / Career</option>
                  <option>Education & EduCareer</option>
                  <option>Sustainability & ESG</option>
                  <option>OMNeXa Partnership / Collaboration</option>
                  <option>Other</option>
                </select>
              </label>

              <label>
                Message
                <textarea
                  name="message"
                  rows={4}
                  placeholder="What would you like to discuss?"
                  required
                  minLength={8}
                />
              </label>

              <label className="whatsapp-consent">
                <input type="checkbox" required />
                <span>
                  I agree to share the information above with OMNeXa for the purpose of responding to this enquiry.
                </span>
              </label>

              <button className="whatsapp-submit" type="submit">Continue to WhatsApp</button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
