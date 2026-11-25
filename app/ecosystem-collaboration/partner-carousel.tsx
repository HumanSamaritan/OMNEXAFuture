"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const partners = [
  { name: "AJU ED Solutions", logo: "aju-ed-solutions", href: "https://www.ajuedsolutions.com/" },
  { name: "FTS Robotics", logo: "fts-robotics", href: "https://www.ftsrobotics.com/" },
  { name: "Future Plus Education", logo: "future-plus-education", href: "https://futureplusedus.com/" },
  { name: "GRIPConnect", logo: "gripconnect", href: "https://gripconnect.co/" },
  { name: "MyStarPick", logo: "mystarpick", href: "https://mystarpick.io/?locale=en" },
  { name: "ViSZAPP", logo: "viszapp", href: "https://www.viszapp.com/" },
  { name: "Avyakti Tech", logo: "avyakti-tech", href: "https://avyaktitech.com/", status: "Onboarding under review" }
];

export default function PartnerCarousel() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setPaused(preference.matches);
    syncPreference();
    preference.addEventListener("change", syncPreference);
    return () => preference.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || paused) return;

    let previous = performance.now();
    let distance = 0;
    let frame = 0;

    function advance(now: number) {
      if (!track) return;
      const elapsed = Math.min(now - previous, 50);
      previous = now;

      if (!track.matches(":hover, :focus-within, :active")) {
        distance += elapsed * 0.045;
        if (distance >= 1) {
          const end = track.scrollWidth - track.clientWidth;
          if (end > 0) {
            const next = track.scrollLeft + Math.floor(distance);
            track.scrollLeft = next > end ? 0 : next;
          }
          distance %= 1;
        }
      }

      frame = requestAnimationFrame(advance);
    }

    frame = requestAnimationFrame(advance);
    return () => cancelAnimationFrame(frame);
  }, [paused]);

  function move(direction: number) {
    const track = trackRef.current;
    if (!track) return;
    setPaused(true);
    const gap = parseFloat(getComputedStyle(track).columnGap);
    const cardWidth = track.firstElementChild?.getBoundingClientRect().width ?? 0;
    const end = track.scrollWidth - track.clientWidth;
    const next = track.scrollLeft + (cardWidth + gap) * direction;
    const left = direction < 0 && track.scrollLeft < 1
      ? end
      : direction > 0 && track.scrollLeft >= end - 1
        ? 0
        : next;
    track.scrollTo({ left, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }

  return (
    <section className="section-shell aligned-section ecosystem-partners" aria-labelledby="ecosystem-partners-heading">
      <div className="ecosystem-partners-heading">
        <div>
          <h2 id="ecosystem-partners-heading">Organisations in our ecosystem</h2>
          <p>Relationship and programme status vary by organisation.</p>
        </div>
        <div className="ecosystem-partner-controls">
          <button type="button" onClick={() => move(-1)} aria-label="Previous partner">←</button>
          <button type="button" onClick={() => move(1)} aria-label="Next partner">→</button>
          <button type="button" onClick={() => setPaused(!paused)}>{paused ? "Play" : "Pause"}</button>
        </div>
      </div>
      <ul ref={trackRef} className="ecosystem-partner-track" onPointerDown={() => setPaused(true)}>
        {partners.map(({ name, logo, href, status }) => (
          <li key={name}>
            <a href={href} target="_blank" rel="noopener noreferrer">
              <Image src={`/partner-logos/${logo}.webp`} alt="" width={168} height={76} unoptimized />
              <span>
                {name}
                {status && <small className="ecosystem-partner-status">{status}</small>}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
