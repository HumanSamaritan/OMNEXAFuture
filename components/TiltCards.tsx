"use client";

import { useEffect } from "react";

export default function TiltCards() {
  useEffect(() => {
    const cards = Array.from(
      document.querySelectorAll<HTMLElement>(
        [
          ".tilt-card",
          ".pillar-card",
          ".service-card",
          ".principle-card",
          ".contact-card",
          ".contact-form",
          ".track-record-grid article",
          ".competency-grid span",
          ".recommendation-grid figure",
          ".format-grid article",
          ".timeline div",
          ".proof-grid li",
          ".stats-strip div",
          ".route-list span",
          ".market-list span",
          ".education-focus-grid article",
          ".service-visual-card"
        ].join(",")
      )
    );

    cards.forEach((card) => card.classList.add("tilt-card"));

    function handlePointerMove(event: PointerEvent) {
      const card = event.currentTarget as HTMLElement;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      card.style.setProperty("--tilt-x", `${(-y * 7).toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${(x * 7).toFixed(2)}deg`);
      card.style.setProperty("--glow-x", `${event.clientX - rect.left}px`);
      card.style.setProperty("--glow-y", `${event.clientY - rect.top}px`);
    }

    function handlePointerLeave(event: PointerEvent) {
      const card = event.currentTarget as HTMLElement;
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    }

    cards.forEach((card) => {
      card.addEventListener("pointermove", handlePointerMove);
      card.addEventListener("pointerleave", handlePointerLeave);
    });

    return () => {
      cards.forEach((card) => {
        card.removeEventListener("pointermove", handlePointerMove);
        card.removeEventListener("pointerleave", handlePointerLeave);
      });
    };
  }, []);

  return null;
}
