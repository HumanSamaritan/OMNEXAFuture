"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./SiteShell.module.css";
import WhatsAppLead from "./WhatsAppLead";

export default function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const dismiss = (event: PointerEvent) => { if (!headerRef.current?.contains(event.target as Node)) { setOpenGroup(null); setMenuOpen(false); } };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpenGroup(null); setMenuOpen(false); } };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", dismiss); document.removeEventListener("keydown", escape); };
  }, []);
  const active = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`)) ? "page" as const : undefined;
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="consulting-site">
      <header ref={headerRef} className={`site-header ${styles.header}`}>
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

        <button className={styles.menuButton} type="button" aria-expanded={menuOpen} aria-controls="site-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? "Close menu ×" : "Menu ☰"}</button>
        <nav id="site-navigation" aria-label="Main navigation" className={`${styles.navigation} ${menuOpen ? styles.open : ""}`} onClick={(event) => { if ((event.target as HTMLElement).closest("a")) { setMenuOpen(false); setOpenGroup(null); } }}>
          <a href="/" aria-current={active("/")}>Home</a>
          <a href="/services" aria-current={active("/services")}>Services</a>
          <a href="/work" aria-current={active("/work")}>Our Work</a>
          <details className={styles.group} open={openGroup === "knowledge"}><summary onClick={(event) => { event.preventDefault(); setOpenGroup(openGroup === "knowledge" ? null : "knowledge"); }}>Knowledge <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="m3 4.5 3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></summary><div className={styles.submenu}><a href="/knowledge" aria-current={active("/knowledge")}><strong>Knowledge guide</strong><span>Company facts and practical answers</span></a><a href="/convergence-brief" aria-current={active("/convergence-brief")}><strong>The Convergence Brief</strong><span>Perspectives on AI, work and governance</span></a><a href="/videos" aria-current={active("/videos")}><strong>Videos</strong><span>Films and product introductions</span></a><a href="/ai-readiness" aria-current={active("/ai-readiness")}><strong>AI Readiness</strong><span>Explore your next step with AI</span></a></div></details>
          <details className={styles.group} open={openGroup === "about"}><summary onClick={(event) => { event.preventDefault(); setOpenGroup(openGroup === "about" ? null : "about"); }}>About <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="m3 4.5 3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></summary><div className={styles.submenu}><a href="/about" aria-current={active("/about")}><strong>About OMNeXa</strong><span>Our purpose and approach</span></a><a href="/dhiraj-kumar" aria-current={active("/dhiraj-kumar")}><strong>Founder</strong><span>Meet Dhiraj Kumar</span></a><a href="/media" aria-current={active("/media")}><strong>Media & brand assets</strong><span>Approved logo, images and media</span></a></div></details>
          <a href="/contact" aria-current={active("/contact")}>Contact</a>
          <a href="/consultancy" className={styles.consultancy} aria-current={active("/consultancy")}>Discuss your needs →</a>
        </nav>
      </header>

      {children}
      <WhatsAppLead />

      <footer className={`site-footer ${styles.footer}`}>
        <div className={styles.footerGrid}>
          <div><strong>OMNeXa Pte. Ltd.</strong><p>Where Consciousness Meets Intelligence.</p><p>Singapore · Human-centred transformation</p></div>
          <div><h2>Work with us</h2><a href="/services">Services</a><a href="/consultancy">Consultancy & discovery calls</a><a href="/work">Products & initiatives</a><a href="/contact">Partnership enquiries</a></div>
          <div><h2>Explore</h2><a href="/knowledge">Knowledge</a><a href="/convergence-brief">The Convergence Brief</a><a href="/videos">Videos</a><a href="/ai-readiness">AI Readiness</a></div>
          <div><h2>Company</h2><a href="/about">About OMNeXa</a><a href="/dhiraj-kumar">Founder</a><a href="/media">Media & brand assets</a><a href="/privacy">Privacy</a></div>
        </div>
        <p className={styles.copyright}>&copy; {new Date().getFullYear()} OMNeXa Pte. Ltd. All rights reserved.</p>
      </footer>
    </div>
  );
}
