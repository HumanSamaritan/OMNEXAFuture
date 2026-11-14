import type { Metadata } from "next";
import PilotForm from "@/components/PilotForm";
import { pilotProducts } from "@/lib/pilot-catalog";
import { pilotIsPreview, pilotReady } from "@/lib/pilot-server";
import "./pilot.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Join a product pilot | OMNeXa",
  description: "Apply to test an OMNeXa product, share relevant experience and review the pilot participation agreement.",
  robots: { index: false, follow: false }
};

export default async function PilotPage({ searchParams }: { searchParams: Promise<{ product?: string }> }) {
  const query = await searchParams;
  const initialProduct = pilotProducts.some((item) => item.slug === query.product) ? query.product! : "";
  return (
    <main className="pilot-page section-shell">
      <a className="pilot-back" href="/work">← Our Work</a>
      <section className="pilot-hero">
        <p className="eyebrow">Build with us</p>
        <h1>Your experience can shape what comes next.</h1>
        <p>Choose an available product pilot and tell us about your experience. Live products are not listed as pilots.</p>
      </section>
      <section className="pilot-feature-callout" aria-labelledby="physical-ai-pilot-title">
        <div>
          <p className="eyebrow">Focused programme interest</p>
          <h2 id="physical-ai-pilot-title">Physical AI (Robots): Humanity at the Centre</h2>
          <p>This proposed student learning initiative is connected to the live NeXaCareer ecosystem. It is a programme interest route, not a NeXaCareer product pilot. Dates and venues are subject to confirmation.</p>
        </div>
        <a className="pilot-primary" href="https://omnexa-career.omnexagoc.com/physical-ai-robots" target="_blank" rel="noopener noreferrer">Explore the programme and register interest ↗</a>
      </section>
      <PilotForm products={pilotProducts} initialProduct={initialProduct} preview={pilotIsPreview()} ready={pilotReady()} recaptchaSiteKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""} />
    </main>
  );
}
