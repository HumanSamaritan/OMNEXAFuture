"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  src: string;
  alt: string;
};

export default function ImageLightbox({ src, alt }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="home-hero-image-button"
        aria-label="Enlarge OMNeXa visual"
        onClick={() => setOpen(true)}
      >
        <Image
          src={src}
          alt={alt}
          width={1254}
          height={1254}
          sizes="(max-width: 1000px) 100vw, 44vw"
          priority
        />
        <span>Click to enlarge</span>
      </button>

      {open ? (
        <div
          className="image-lightbox-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setOpen(false);
          }}
        >
          <div className="image-lightbox" role="dialog" aria-modal="true" aria-label="Expanded OMNeXa visual">
            <button
              type="button"
              className="image-lightbox-close"
              aria-label="Close expanded image"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
            <Image
              src={src}
              alt={alt}
              width={1254}
              height={1254}
              sizes="96vw"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
