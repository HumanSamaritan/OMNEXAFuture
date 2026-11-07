"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import TiltCards from "./TiltCards";
import WhatsAppLead from "./WhatsAppLead";

export default function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <header className="site-header">
        <a className="brand" href="/" aria-label="OMNeXa home">
          <span className="brand-logo-wrap">
            <Image
              src="/omnexa-logo.png"
              alt="OMNeXa"
              width={80}
              height={46}
              className="brand-logo"
              priority
            />
          </span>
          <span className="brand-text">
            <strong>OMNeXa™</strong>
            <small>Where Consciousness Meets Intelligence</small>
          </span>
        </a>

        <nav aria-label="Main navigation">
          <a href="/services">Services</a>
          <a href="/work">Our Work</a>
          <a href="/knowledge">Knowledge</a>
          <a href="/about">About OMNeXa</a>
          <a href="/contact">Contact</a>
        </nav>
      </header>

      <TiltCards />
      {children}
      <WhatsAppLead />

      <footer className="site-footer">
        <p>&copy; {new Date().getFullYear()} OMNeXa Pte. Ltd. All rights reserved.</p>
        <p>
          OMNeXa™ — Where Consciousness Meets Intelligence · <a href="/services">Services</a> · <a href="/work">Our Work</a> · <a href="/consultancy">Consultancy &amp; discovery calls</a> · <a href="/videos">Videos</a> · <a href="/media">Media & brand assets</a> · <a href="/dhiraj-kumar">Founder</a> · <a href="/ai-readiness">AI Readiness</a> · <a href="/privacy">Privacy</a>
        </p>
      </footer>
    </>
  );
}
