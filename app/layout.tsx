import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "OMNeXa Pte. Ltd. | Where Consciousness Meets Intelligence",
  description:
    "OMNeXa is a Singapore-based consultancy preparing people and organizations for an AI-enabled, sustainability-aligned and human-centered future.",
  openGraph: {
    title: "OMNeXa Pte. Ltd.",
    description:
      "Career pathways, risk and compliance, sustainability, responsible AI, ecosystem collaboration, and conscious leadership.",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
