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
      "Human-centered transformation for compliance, sustainability, AI, education and well-being.",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Contact", href: "/contact" }
  ];

  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="section-shell" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <Link href="/" className="logo">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <text x="4" y="24" fontSize="20" fontWeight="bold" fill="currentColor" letterSpacing="1">OMX</text>
              </svg>
              <div className="logo-text">
                <div className="logo-name">OMNeXa</div>
                <div className="logo-tagline">Consciousness & Intelligence</div>
              </div>
            </Link>

            <nav className="nav-menu">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        {children}

        <footer className="site-footer">
          <div className="section-shell">
            <div className="footer-content">
              <div className="footer-section">
                <h4>OMNeXa</h4>
                <p>Where Consciousness Meets Intelligence</p>
              </div>
              <div className="footer-section">
                <h4>Services</h4>
                <Link href="/services">Our Offerings</Link>
                <Link href="/portfolio">Case Studies</Link>
              </div>
              <div className="footer-section">
                <h4>Company</h4>
                <Link href="/about">About Us</Link>
                <Link href="/contact">Contact</Link>
              </div>
              <div className="footer-section">
                <h4>Contact</h4>
                <a href="mailto:dhiraj.kumar@omnexagoc.com">dhiraj.kumar@omnexagoc.com</a>
                <p>Singapore-based, serving APAC & EMEA</p>
              </div>
            </div>
            <div className="footer-bottom">
              <p>© {new Date().getFullYear()} OMNeXa Pte. Ltd. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}