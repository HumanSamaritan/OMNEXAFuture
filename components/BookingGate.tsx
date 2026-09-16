"use client";

import { useState } from "react";

type BookingGateProps = {
  bookingUrl: string;
};

export default function BookingGate({ bookingUrl }: BookingGateProps) {
  const [humanConfirmed, setHumanConfirmed] = useState(false);
  const bookingReady = /^https:\/\//i.test(bookingUrl);

  return (
    <div className="contact-card" aria-labelledby="booking-gate-title">
      <p className="eyebrow">Human check</p>
      <h2 id="booking-gate-title">Continue only for a genuine introductory conversation.</h2>
      <p>
        This page does not ask for your name, email address or calendar data. The scheduling step is handled on
        Google Calendar, where only currently available appointment times are shown.
      </p>

      <label style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", marginTop: "1.25rem" }}>
        <input
          type="checkbox"
          checked={humanConfirmed}
          onChange={(event) => setHumanConfirmed(event.target.checked)}
          style={{ marginTop: "0.25rem" }}
        />
        <span>
          I confirm that I am a person requesting a genuine introductory discussion with OMNeXa and will not use
          the booking page for automated, abusive or unsolicited bulk bookings.
        </span>
      </label>

      <div className="hero-actions" style={{ marginTop: "1.25rem" }}>
        {bookingReady ? (
          <a
            className={`button primary${humanConfirmed ? "" : " booking-disabled"}`}
            href={humanConfirmed ? bookingUrl : undefined}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!humanConfirmed}
            onClick={(event) => {
              if (!humanConfirmed) event.preventDefault();
            }}
          >
            View available times
          </a>
        ) : (
          <span className="button secondary" aria-disabled="true">
            Booking link activation pending
          </span>
        )}
      </div>

      {!bookingReady && (
        <p className="fine">
          The secure booking destination has not yet been configured. Please email{" "}
          <a href="mailto:dhiraj.kumar@omnexagoc.com">dhiraj.kumar@omnexagoc.com</a> in the meantime.
        </p>
      )}

      <p className="fine">
        OMNeXa does not receive your Google password or calendar credentials through this page. When you continue,
        Google processes the booking information needed to create the appointment and invitation.
      </p>
    </div>
  );
}
