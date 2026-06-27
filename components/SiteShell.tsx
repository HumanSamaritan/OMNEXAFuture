import Image from "next/image";
import type { ReactNode } from "react";
import { navItems } from "@/lib/site-data";

export default function SiteShell({ children }: { children: ReactNode }) {
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
            <strong>OMNeXa</strong>
            <small>Where Consciousness Meets Intelligence</small>
          </span>
        </a>

        <nav aria-label="Main navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      {children}

      <footer className="site-footer">
        <p>&copy; {new Date().getFullYear()} OMNeXa Pte. Ltd. All rights reserved.</p>
        <p>Where Consciousness Meets Intelligence</p>
      </footer>
    </>
  );
}
