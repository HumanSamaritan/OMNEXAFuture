"use client";

import { useState } from "react";

type BookingGateProps = {
  bookingUrl: string;
};

export default function BookingGate({ bookingUrl }: BookingGateProps) {
  const [humanConfirmed, setHumanConfirmed] = useState(false);
  const bookingReady = /^https:\/\//i.test(bookingUrl);

  return (
    <div className="contact-card" aria-labelledby="booking-gate-title" style={{ maxWidth: "720px", margin: "0 auto" }}>
      <div aria-hidden="true" style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📅</div>
      <p className="eyebrow">Book a time</p>
      <h2 id="booking-gate-title">Choose an open slot.</h2>

      <label style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", marginTop: "1rem" }}>
        <input
          type="checkbox"
          checked={humanConfirmed}
          onChange={(event) => setHumanConfirmed(event.target.checked)}
          style={{ marginTop: "0.25rem" }}
        />
        <span>I&apos;m human and booking a genuine OMNeXa conversation.</span>
      </label>

      <div className="hero-actions" style={{ marginTop: "1.25rem" }}>
        {bookingReady ? (
          <a
            className="button primary"
            href={humanConfirmed ? bookingUrl : undefined}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!humanConfirmed}
            onClick={(event) => {
              if (!humanConfirmed) event.preventDefault();
            }}
            style={!humanConfirmed ? { opacity: 0.55, pointerEvents: "none" } : undefined}
          >
            See available times
          </a>
        ) : (
          <span className="button secondary" aria-disabled="true" style={{ opacity: 0.65 }}>
            Booking unavailable
          </span>
        )}
      </div>

      {bookingReady ? (
        <p className="fine">Google Calendar shows free times only and sends the Meet invitation.</p>
      ) : (
        <p className="fine">
          Please email <a href="mailto:dhiraj.kumar@omnexagoc.com">dhiraj.kumar@omnexagoc.com</a>.
        </p>
      )}
    </div>
  );
}
