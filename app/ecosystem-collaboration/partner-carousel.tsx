"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const partners = [
  { name: "AJU ED Solutions", logo: "aju-ed-solutions", href: "https://www.ajuedsolutions.com/" },
  { name: "FTS Robotics", logo: "fts-robotics", href: "https://www.ftsrobotics.com/" },
  { name: "Future Plus Education", logo: "future-plus-education", href: "https://futureplusedus.com/" },
  { name: "GRIPConnect", logo: "gripconnect", href: "https://www.gripconnect.co/" },
  { name: "MyStarPick", logo: "mystarpick", href: "https://mystarpick.io/?locale=en" },
  { name: "ViSZAPP", logo: "viszapp", href: "https://www.viszapp.com/" },
  { name: "Avyakti Tech", logo: "avyakti-tech", href: "https://avyaktitech.com/" }
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
          const first = track.firstElementChild?.getBoundingClientRect().left ?? 0;
          const repeat = track.children[partners.length]?.getBoundingClientRect().left ?? 0;
          const cycle = repeat - first;
          if (cycle > 0) {
            track.scrollLeft = (track.scrollLeft + Math.floor(distance)) % cycle;
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
    const first = track.firstElementChild?.getBoundingClientRect().left ?? 0;
    const repeat = track.children[partners.length]?.getBoundingClientRect().left ?? 0;
    const end = repeat - first;
    const next = track.scrollLeft + (cardWidth + gap) * direction;
    const left = direction < 0 && track.scrollLeft < 1
      ? Math.max(0, end - cardWidth - gap)
      : direction > 0 && track.scrollLeft >= end - 1
        ? 0
        : Math.min(end, next);
    track.scrollTo({ left, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }

  return (
    <section className="section-shell aligned-section ecosystem-partners" aria-labelledby="ecosystem-partners-heading">
      <div className="ecosystem-partners-heading">
        <h2 id="ecosystem-partners-heading">Our ecosystem</h2>
        <div className="ecosystem-partner-controls">
          <button type="button" onClick={() => move(-1)} aria-label="Previous partner">←</button>
          <button type="button" onClick={() => move(1)} aria-label="Next partner">→</button>
          <button type="button" onClick={() => setPaused(!paused)}>{paused ? "Play" : "Pause"}</button>
        </div>
      </div>
      <ul ref={trackRef} className="ecosystem-partner-track" onPointerDown={() => setPaused(true)}>
        {[...partners, ...partners].map(({ name, logo, href }, index) => {
          const duplicate = index >= partners.length;
          return (
            <li key={`${logo}-${index}`} aria-hidden={duplicate || undefined}>
              <a
                data-logo={logo}
                href={href}
                tabIndex={duplicate ? -1 : undefined}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
              >
                <Image src={`/partner-logos/${logo}.webp`} alt="" width={240} height={170} unoptimized />
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
