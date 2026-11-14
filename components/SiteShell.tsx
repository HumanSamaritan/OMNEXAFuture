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
  useEffect(() => {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches === false ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const selector = ".consulting-site main .tilt-card, .consulting-site main .service-row, .consulting-site main .service-card, .consulting-site main .pillar-card, .consulting-site main .principle-card, .consulting-site main .work-card, .consulting-site main .work-segment-card, .consulting-site main .knowledge-link-card, .consulting-site main .publication-card, .consulting-site main .testimonial-grid figure, .consulting-site main .track-record-grid article, .consulting-site main .route-list span, .consulting-site main .stats-strip div, .consulting-site main .timeline > div, .consulting-site main .format-grid article, .consulting-site main .education-grid article, .consulting-site main .entity-facts-grid article, .consulting-site main .market-list span, .consulting-site main .education-focus-grid article, .consulting-site main .proof-grid li, .consulting-site main .service-lead-grid article, .consulting-site main [class*='issueCard'], .consulting-site main table tr, .consulting-site main .robotics-hero, .consulting-site main .agent-build-step, .consulting-site main .product-detail-story article, .consulting-site main .product-capability-grid article, .consulting-site main .faq-grid article, .consulting-site main .sibling-product-grid > a";
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !(event.target instanceof Element)) return;
      const card = event.target.closest<HTMLElement>(selector);
      if (!card) return;
      const rect = card.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
      card.dataset.pointerActive = "true";
      card.style.setProperty("--pointer-x", `${(x * 100).toFixed(1)}%`);
      card.style.setProperty("--pointer-y", `${(y * 100).toFixed(1)}%`);
      card.style.setProperty("--tilt-x", `${((x - .5) * 5).toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${((y - .5) * 4).toFixed(2)}deg`);
      card.style.setProperty("--pointer-hue", String(Math.round(145 + x * 38)));
    };
    const leave = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) return;
      const card = event.target.closest<HTMLElement>(selector);
      const next = event.relatedTarget instanceof Element ? event.relatedTarget.closest(selector) : null;
      if (!card || card === next) return;
      card.dataset.pointerActive = "false";
      card.style.removeProperty("--tilt-x");
      card.style.removeProperty("--tilt-y");
      card.style.removeProperty("--pointer-x");
      card.style.removeProperty("--pointer-y");
      card.style.removeProperty("--pointer-hue");
    };
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerout", leave, { passive: true });
    return () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerout", leave);
    };
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
          <div><h2>Work with us</h2><a href="/services">Services</a><a href="/consultancy">Consultancy & discovery calls</a><a href="/work">Products & initiatives</a><a href="/india/odisha/robotics">Odisha robotics learning programme</a><a href="/contact">Partnership enquiries</a></div>
          <div><h2>Explore</h2><a href="/knowledge">Knowledge</a><a href="/convergence-brief">The Convergence Brief</a><a href="/videos">Videos</a><a href="/ai-readiness">AI Readiness</a></div>
          <div><h2>Company</h2><a href="/about">About OMNeXa</a><a href="/dhiraj-kumar">Founder</a><a href="/media">Media & brand assets</a><a href="/privacy">Privacy</a></div>
        </div>
        <p className={styles.copyright}>&copy; {new Date().getFullYear()} OMNeXa Pte. Ltd. All rights reserved.</p>
      </footer>
    </div>
  );
}
