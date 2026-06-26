import type { Metadata } from "next";
import Link from "next/link";
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
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Contact", href: "/contact" }
  ];

  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <Link className="brand" href="/" aria-label="OMNeXa home">
            <span className="brand-mark">OMX</span>
            <span>
              <strong>OMNeXa</strong>
              <small>Where Consciousness Meets Intelligence</small>
            </span>
          </Link>

          <nav aria-label="Main navigation">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        {children}
      </body>
    </html>
  );
}