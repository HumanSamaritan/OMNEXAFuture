"use client";

import { FormEvent, useState } from "react";

type FormState = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Unable to send enquiry");
      }

      setState("success");
      setMessage(result?.warning || "Thank you. Your enquiry has been sent to OMNeXa.");
      form.reset();
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please email dhiraj.kumar@omnexagoc.com directly."
      );
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <input type="text" name="companyWebsite" tabIndex={-1} autoComplete="off" className="honeypot" />

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
          <input name="phone" type="tel" placeholder="+65 / +91 / country code" />
        </label>

        <label>
          Organisation
          <input name="organisation" type="text" placeholder="Company / institution" />
        </label>
      </div>

      <label>
        Area of interest
        <select name="interest" defaultValue="" required>
          <option value="" disabled>
            Select one
          </option>
          <option>Career & Education Pathways</option>
          <option>Risk, Governance, AML/KYC & Sanctions</option>
          <option>Sustainability & ESG Alignment</option>
          <option>AI, Robotics & Responsible Innovation</option>
          <option>Well-being & Conscious Leadership</option>
          <option>Integrated ecosystem collaboration</option>
        </select>
      </label>

      <label>
        Message
        <textarea
          name="message"
          placeholder="Share what you would like to discuss, your audience, preferred timing, and expected outcome."
          rows={5}
          required
          minLength={10}
        />
      </label>

      <button type="submit" disabled={state === "loading"}>
        {state === "loading" ? "Sending..." : "Send enquiry"}
      </button>

      {message ? <p className={`form-message ${state}`}>{message}</p> : null}
    </form>
  );
}
