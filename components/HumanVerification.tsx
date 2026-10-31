"use client";
import Script from "next/script";
import { useCallback, useRef } from "react";
// Explicit rendering also works when visitors return from the calendar to edit
// their details: Next.js does not reload a previously loaded script.
export default function HumanVerification({ siteKey, onToken }: { siteKey: string; onToken: (token: string) => void }) {
  const container = useRef<HTMLDivElement>(null);
  const widget = useRef<number | null>(null);
  const callback = useRef(onToken); callback.current = onToken;
  const render = useCallback(() => {
    window.grecaptcha?.enterprise?.ready?.(() => {
      if (!container.current || widget.current !== null) return;
      const id = window.grecaptcha?.enterprise?.render?.(container.current, {
        sitekey: siteKey, callback: (token: string) => callback.current(token),
        "expired-callback": () => callback.current(""), "error-callback": () => callback.current(""), theme: "light"
      });
      if (id !== undefined) widget.current = id;
    });
  }, [siteKey]);
  return <><Script src="https://www.google.com/recaptcha/enterprise.js" strategy="afterInteractive" onReady={render} /><div ref={container} /></>;
}
