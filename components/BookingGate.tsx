"use client";

import Script from "next/script";
import { FormEvent, useEffect, useMemo, useState } from "react";
import styles from "./BookingGate.module.css";

type BookingSlot = {
  start: string;
  end: string;
};

type BookingConfig = {
  durationMinutes: number;
  stepMinutes: number;
  timeZone: string;
  timeZoneLabel: string;
  dayStart: string;
  dayEnd: string;
  horizonDays: number;
};

type Confirmation = {
  start: string;
  end: string;
  email: string;
  meetLink?: string | null;
};

type Step = "details" | "schedule" | "confirmed";

type FormState = {
  name: string;
  email: string;
  company: string;
  jobTitle: string;
  phone: string;
  focus: string;
  companyWebsite: string;
};

declare global {
  interface Window {
    omnexaRecaptchaSuccess?: (token: string) => void;
    omnexaRecaptchaExpired?: () => void;
    grecaptcha?: { reset: () => void };
  }
}

const initialForm: FormState = {
  name: "",
  email: "",
  company: "",
  jobTitle: "",
  phone: "",
  focus: "",
  companyWebsite: ""
};

function singaporeTodayParts(): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Singapore",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day)
  };
}

function isoDateFromUtcDate(date: Date): string {
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0")
  ].join("-");
}

function upcomingDates(count = 10): string[] {
  const today = singaporeTodayParts();
  const cursor = new Date(Date.UTC(today.year, today.month - 1, today.day));
  const result: string[] = [];

  for (let index = 0; result.length < count && index < 45; index += 1) {
    const candidate = new Date(cursor.getTime() + index * 24 * 60 * 60 * 1000);
    const day = candidate.getUTCDay();
    if (day !== 0 && day !== 6) result.push(isoDateFromUtcDate(candidate));
  }

  return result;
}

function formatDate(date: string, compact = false): string {
  return new Intl.DateTimeFormat("en-SG", {
    timeZone: "Asia/Singapore",
    weekday: compact ? "short" : "long",
    day: "numeric",
    month: compact ? "short" : "long",
    year: compact ? undefined : "numeric"
  }).format(new Date(`${date}T00:00:00+08:00`));
}

function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("en-SG", {
    timeZone: "Asia/Singapore",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  }).format(new Date(iso));
}

function formatConfirmation(iso: string): string {
  return new Intl.DateTimeFormat("en-SG", {
    timeZone: "Asia/Singapore",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  }).format(new Date(iso));
}

export default function BookingGate({
  recaptchaSiteKey
}: {
  recaptchaSiteKey: string;
}) {
  const dates = useMemo(() => upcomingDates(10), []);
  const [step, setStep] = useState<Step>("details");
  const [form, setForm] = useState<FormState>(initialForm);
  const [captchaToken, setCaptchaToken] = useState("");
  const [sessionToken, setSessionToken] = useState("");
  const [bookingConfig, setBookingConfig] = useState<BookingConfig | null>(null);
  const [selectedDate, setSelectedDate] = useState(dates[0] || "");
  const [slots, setSlots] = useState<BookingSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<BookingSlot | null>(null);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    window.omnexaRecaptchaSuccess = (token: string) => {
      setCaptchaToken(token);
      setError("");
    };
    window.omnexaRecaptchaExpired = () => setCaptchaToken("");

    return () => {
      delete window.omnexaRecaptchaSuccess;
      delete window.omnexaRecaptchaExpired;
    };
  }, []);

  useEffect(() => {
    if (step !== "schedule" || !sessionToken || !selectedDate) return;

    let cancelled = false;
    async function loadAvailability() {
      setLoadingSlots(true);
      setSelectedSlot(null);
      setError("");

      try {
        const response = await fetch(
          `/api/booking/availability?date=${encodeURIComponent(selectedDate)}`,
          {
            headers: { authorization: `Bearer ${sessionToken}` },
            cache: "no-store"
          }
        );
        const data = (await response.json()) as {
          error?: string;
          slots?: BookingSlot[];
          booking?: BookingConfig;
        };

        if (!response.ok) throw new Error(data.error || "Unable to load available times.");
        if (cancelled) return;

        setSlots(data.slots || []);
        if (data.booking) setBookingConfig(data.booking);
      } catch (loadError) {
        if (!cancelled) {
          setSlots([]);
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load available times."
          );
        }
      } finally {
        if (!cancelled) setLoadingSlots(false);
      }
    }

    void loadAvailability();
    return () => {
      cancelled = true;
    };
  }, [step, sessionToken, selectedDate]);

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function resetCaptcha() {
    setCaptchaToken("");
    try {
      window.grecaptcha?.reset();
    } catch {
      // Google may not have initialized the widget yet.
    }
  }

  async function startScheduling(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!captchaToken) {
      setError("Please complete the reCAPTCHA verification.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/booking/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...form, captchaToken })
      });
      const data = (await response.json()) as {
        error?: string;
        token?: string;
        booking?: BookingConfig;
      };

      if (!response.ok || !data.token) {
        throw new Error(data.error || "Unable to continue to scheduling.");
      }

      setSessionToken(data.token);
      setBookingConfig(data.booking || null);
      setStep("schedule");
      setSelectedDate(dates[0] || "");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to continue to scheduling."
      );
      resetCaptcha();
    } finally {
      setLoading(false);
    }
  }

  async function confirmBooking() {
    if (!selectedSlot || !sessionToken) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/booking/create", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${sessionToken}`
        },
        body: JSON.stringify({ start: selectedSlot.start })
      });
      const data = (await response.json()) as {
        error?: string;
        booking?: Confirmation;
      };

      if (!response.ok || !data.booking) {
        throw new Error(data.error || "Unable to confirm the meeting.");
      }

      setConfirmation(data.booking);
      setStep("confirmed");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (bookingError) {
      setError(
        bookingError instanceof Error
          ? bookingError.message
          : "Unable to confirm the meeting."
      );
      setSelectedSlot(null);

      if (selectedDate) {
        try {
          const response = await fetch(
            `/api/booking/availability?date=${encodeURIComponent(selectedDate)}`,
            {
              headers: { authorization: `Bearer ${sessionToken}` },
              cache: "no-store"
            }
          );
          const data = (await response.json()) as { slots?: BookingSlot[] };
          if (response.ok) setSlots(data.slots || []);
        } catch {
          // Keep the original booking error visible.
        }
      }
    } finally {
      setLoading(false);
    }
  }

  if (step === "confirmed" && confirmation) {
    return (
      <div className={styles.card} aria-live="polite">
        <div className={styles.successMark} aria-hidden="true">✓</div>
        <p className={styles.kicker}>Booking confirmed</p>
        <h2>Your conversation is on the calendar.</h2>
        <p className={styles.copy}>
          A calendar invitation has been sent to <strong>{confirmation.email}</strong>.
        </p>

        <div className={styles.confirmationPanel}>
          <span>30-minute introductory conversation</span>
          <strong>{formatConfirmation(confirmation.start)}</strong>
          <small>Singapore Time · Google Meet</small>
        </div>

        {confirmation.meetLink ? (
          <a
            className={styles.secondaryAction}
            href={confirmation.meetLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Meet link
          </a>
        ) : null}

        <p className={styles.privacyNote}>
          Need to change the meeting? Reply to the calendar invitation or email{" "}
          <a href="mailto:dhiraj.kumar@omnexagoc.com">dhiraj.kumar@omnexagoc.com</a>.
        </p>
      </div>
    );
  }

  if (step === "schedule") {
    return (
      <div className={styles.card} aria-labelledby="booking-schedule-title">
        <div className={styles.successBanner}>
          Details verified. Choose a 30-minute time below and we&apos;ll place it on the calendar.
        </div>

        <div className={styles.scheduleHeading}>
          <div>
            <p className={styles.kicker}>Introductory conversation</p>
            <h2 id="booking-schedule-title">What time works best?</h2>
          </div>
          <button
            className={styles.textButton}
            type="button"
            onClick={() => {
              setStep("details");
              setSessionToken("");
              setSlots([]);
              setSelectedSlot(null);
              resetCaptcha();
            }}
          >
            Edit details
          </button>
        </div>

        <div className={styles.meetingFacts}>
          <span><strong>Meeting location</strong>Google Meet</span>
          <span><strong>Meeting duration</strong>{bookingConfig?.durationMinutes || 30} min</span>
          <span><strong>Time zone</strong>{bookingConfig?.timeZoneLabel || "UTC +08:00 · Singapore"}</span>
        </div>

        <div className={styles.dateRail} aria-label="Choose a date">
          {dates.map((date) => (
            <button
              key={date}
              type="button"
              className={date === selectedDate ? styles.dateActive : styles.dateButton}
              onClick={() => setSelectedDate(date)}
            >
              {formatDate(date, true)}
            </button>
          ))}
        </div>

        <p className={styles.dateTitle}>
          Showing available start times for <strong>{formatDate(selectedDate)}</strong>
        </p>

        {error ? <div className={styles.errorBox}>{error}</div> : null}

        {loadingSlots ? (
          <div className={styles.emptyState}>Checking the calendar…</div>
        ) : slots.length ? (
          <div className={styles.slotGrid}>
            {slots.map((slot) => (
              <button
                key={slot.start}
                type="button"
                className={
                  selectedSlot?.start === slot.start ? styles.slotSelected : styles.slotButton
                }
                onClick={() => setSelectedSlot(slot)}
              >
                {formatTime(slot.start)}
              </button>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            No 30-minute times are currently available on this date. Please choose another day.
          </div>
        )}

        {selectedSlot ? (
          <div className={styles.reviewPanel}>
            <div>
              <span>Selected time</span>
              <strong>
                {formatDate(selectedDate)} · {formatTime(selectedSlot.start)}
              </strong>
            </div>
            <button
              className={styles.confirmButton}
              type="button"
              disabled={loading}
              onClick={() => void confirmBooking()}
            >
              {loading ? "Confirming…" : "Confirm 30-minute meeting"}
            </button>
          </div>
        ) : null}

        <p className={styles.privacyNote}>
          Availability is checked again when you confirm, preventing a slot from being double-booked.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.card} aria-labelledby="booking-gate-title">
      <Script
        src="https://www.google.com/recaptcha/api.js"
        strategy="afterInteractive"
      />

      <p className={styles.kicker}>Introductory conversation</p>
      <h2 id="booking-gate-title">Tell us who we&apos;re meeting.</h2>
      <p className={styles.copy}>
        Share a few details first. After verification, you&apos;ll see live 30-minute availability
        without leaving OMNeXa.
      </p>

      <form className={styles.form} onSubmit={startScheduling}>
        <div className={styles.fieldGrid}>
          <label>
            Full name
            <input
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              autoComplete="name"
              maxLength={100}
              required
            />
          </label>
          <label>
            Work email
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              autoComplete="email"
              maxLength={254}
              required
            />
          </label>
          <label>
            Company / organisation
            <input
              value={form.company}
              onChange={(event) => updateField("company", event.target.value)}
              autoComplete="organization"
              maxLength={160}
              required
            />
          </label>
          <label>
            Role / job title
            <input
              value={form.jobTitle}
              onChange={(event) => updateField("jobTitle", event.target.value)}
              autoComplete="organization-title"
              maxLength={120}
              required
            />
          </label>
        </div>

        <label>
          Phone number <span className={styles.optional}>(optional)</span>
          <input
            type="tel"
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            autoComplete="tel"
            maxLength={40}
          />
        </label>

        <label>
          What should we focus on? <span className={styles.optional}>(optional)</span>
          <textarea
            value={form.focus}
            onChange={(event) => updateField("focus", event.target.value)}
            rows={4}
            maxLength={1200}
            placeholder="For example: partnership, product pilot, responsible AI, education or transformation."
          />
        </label>

        <label className={styles.honeypot} aria-hidden="true">
          Website
          <input
            tabIndex={-1}
            autoComplete="off"
            value={form.companyWebsite}
            onChange={(event) => updateField("companyWebsite", event.target.value)}
          />
        </label>

        <div className={styles.recaptchaWrap}>
          {recaptchaSiteKey ? (
            <div
              className="g-recaptcha"
              data-sitekey={recaptchaSiteKey}
              data-callback="omnexaRecaptchaSuccess"
              data-expired-callback="omnexaRecaptchaExpired"
            />
          ) : (
            <div className={styles.verificationUnavailable}>
              Human verification is not configured yet.
            </div>
          )}
        </div>

        {error ? <div className={styles.errorBox}>{error}</div> : null}

        <p className={styles.consent}>
          By continuing, you agree to OMNeXa&apos;s <a href="/privacy">privacy policy</a>. We use
          these details to arrange and follow up on this conversation.
        </p>

        <button
          className={styles.continueButton}
          type="submit"
          disabled={loading || !captchaToken || !recaptchaSiteKey}
        >
          {loading ? "Checking…" : "Continue to scheduling"}
        </button>
      </form>

      <p className={styles.privacyNote}>
        Guardrails include Google reCAPTCHA, rate limits, server-side slot validation and a final
        availability check before the meeting is created.
      </p>
    </div>
  );
}
