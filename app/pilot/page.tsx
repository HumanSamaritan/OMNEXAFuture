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
        <p>Choose an OMNeXa initiative, tell us about your experience and apply to join a product pilot.</p>
      </section>
      <PilotForm products={pilotProducts} initialProduct={initialProduct} preview={pilotIsPreview()} ready={pilotReady()} recaptchaSiteKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""} />
    </main>
  );
}
