import type { Metadata } from "next";
import ManageDiscovery from "@/components/ManageDiscovery";
import "../consultancy.css";
export const metadata: Metadata = { title: "Manage your discovery appointment | OMNeXa", robots: { index: false, follow: false }, referrer: "no-referrer" };
export default function ManagePage() { return <main className="consultancy-page"><section className="section-shell aligned-section consultancy-booking"><a href="/consultancy">← OMNeXa consultancy</a><ManageDiscovery /></section></main>; }
