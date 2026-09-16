"use client";

import { useState } from "react";
import styles from "./BookingGate.module.css";

type BookingGateProps = {
  bookingUrl: string;
};

export default function BookingGate({ bookingUrl }: BookingGateProps) {
  const [humanConfirmed, setHumanConfirmed] = useState(false);
  const bookingReady = /^https:\/\//i.test(bookingUrl);

  return (
    <div className={styles.card} aria-labelledby="booking-gate-title">
      <p className={styles.kicker}>Introductory conversation</p>
      <h2 id="booking-gate-title">Find a time that works.</h2>
      <p className={styles.copy}>
        Only available slots are shown. Google Calendar creates the Meet link and sends the invitation.
      </p>

      <div className={styles.metaRow} aria-label="Meeting details">
        <span>30 minutes</span>
        <span>Google Meet</span>
        <span>Singapore Time</span>
      </div>

      <div className={styles.divider} />

      <p className={styles.confirmTitle}>Quick confirmation</p>
      <label className={styles.confirmRow}>
        <input
          type="checkbox"
          checked={humanConfirmed}
          onChange={(event) => setHumanConfirmed(event.target.checked)}
        />
        <span>I&apos;m booking a genuine conversation with OMNeXa.</span>
      </label>

      {bookingReady ? (
        <a
          className={`button primary ${styles.primaryAction} ${!humanConfirmed ? styles.disabled : ""}`}
          href={humanConfirmed ? bookingUrl : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!humanConfirmed}
          onClick={(event) => {
            if (!humanConfirmed) event.preventDefault();
          }}
        >
          View available times →
        </a>
      ) : (
        <div className={styles.fallback}>
          <strong>Online booking is temporarily unavailable.</strong>
          <a href="mailto:dhiraj.kumar@omnexagoc.com">Email Dhiraj instead →</a>
        </div>
      )}

      <p className={styles.privacyNote}>
        Your private calendar details are never displayed on this page.
      </p>
    </div>
  );
}
