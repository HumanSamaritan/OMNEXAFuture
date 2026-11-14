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
          <details className={`${styles.group} ${openGroup === "knowledge" ? styles.groupOpen : ""}`} open={openGroup === "knowledge"}>
            <summary aria-expanded={openGroup === "knowledge"} onClick={(event) => { event.preventDefault(); setOpenGroup(openGroup === "knowledge" ? null : "knowledge"); }}>Knowledge <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="m3 4.5 3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></summary>
            <div className={styles.megaPanel} aria-label="Knowledge and insights">
              <div className={styles.megaIntro}><span className={styles.megaEyebrow}>Knowledge & insights</span><h2>Ideas for the decisions ahead.</h2><p>Grounded perspectives on responsible AI, human capability, work and governance.</p><a className={styles.megaExplore} href="/knowledge">Explore the knowledge guide <span aria-hidden="true">→</span></a></div>
              <div className={styles.megaLinks}>
                <a href="/knowledge" aria-current={active("/knowledge")}><span className={styles.megaIndex}>01</span><span><strong>Knowledge guide</strong><small>Company facts and practical answers</small></span><span className={styles.megaArrow} aria-hidden="true">→</span></a>
                <a href="/convergence-brief" aria-current={active("/convergence-brief")}><span className={styles.megaIndex}>02</span><span><strong>The Convergence Brief</strong><small>Perspectives on AI, work and governance</small></span><span className={styles.megaArrow} aria-hidden="true">→</span></a>
                <a href="/videos" aria-current={active("/videos")}><span className={styles.megaIndex}>03</span><span><strong>Videos</strong><small>Films and product introductions</small></span><span className={styles.megaArrow} aria-hidden="true">→</span></a>
                <a href="/ai-readiness" aria-current={active("/ai-readiness")}><span className={styles.megaIndex}>04</span><span><strong>AI readiness</strong><small>Explore a practical next step with AI</small></span><span className={styles.megaArrow} aria-hidden="true">→</span></a>
              </div>
            </div>
          </details>
          <details className={`${styles.group} ${openGroup === "about" ? styles.groupOpen : ""}`} open={openGroup === "about"}>
            <summary aria-expanded={openGroup === "about"} onClick={(event) => { event.preventDefault(); setOpenGroup(openGroup === "about" ? null : "about"); }}>About <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="m3 4.5 3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></summary>
            <div className={styles.megaPanel} aria-label="About OMNeXa">
              <div className={styles.megaIntro}><span className={styles.megaEyebrow}>About OMNeXa</span><h2>Human purpose. Practical transformation.</h2><p>Learn about the people, principles and partnerships behind OMNeXa Pte. Ltd.</p><a className={styles.megaExplore} href="/about">Discover OMNeXa <span aria-hidden="true">→</span></a></div>
              <div className={`${styles.megaLinks} ${styles.megaLinksThree}`}>
                <a href="/about" aria-current={active("/about")}><span className={styles.megaIndex}>01</span><span><strong>About OMNeXa</strong><small>Our purpose, approach and company</small></span><span className={styles.megaArrow} aria-hidden="true">→</span></a>
                <a href="/dhiraj-kumar" aria-current={active("/dhiraj-kumar")}><span className={styles.megaIndex}>02</span><span><strong>Founder</strong><small>Meet Dhiraj Kumar</small></span><span className={styles.megaArrow} aria-hidden="true">→</span></a>
                <a href="/media" aria-current={active("/media")}><span className={styles.megaIndex}>03</span><span><strong>Media & brand assets</strong><small>Approved identity and media resources</small></span><span className={styles.megaArrow} aria-hidden="true">→</span></a>
                <a href="/india" aria-current={active("/india")}><span className={styles.megaIndex}>04</span><span><strong>OMNeXa in India</strong><small>Services and initiatives for India</small></span><span className={styles.megaArrow} aria-hidden="true">→</span></a>
                <a href="/ecosystem-collaboration" aria-current={active("/ecosystem-collaboration")}><span className={styles.megaIndex}>05</span><span><strong>Ecosystem collaboration</strong><small>Build future-ready work together</small></span><span className={styles.megaArrow} aria-hidden="true">→</span></a>
                <a href="/privacy" aria-current={active("/privacy")}><span className={styles.megaIndex}>06</span><span><strong>Privacy</strong><small>How we handle information</small></span><span className={styles.megaArrow} aria-hidden="true">→</span></a>
              </div>
            </div>
          </details>
          <a href="/contact" aria-current={active("/contact")}>Contact</a>
          <a href="/consultancy" className={styles.consultancy} aria-current={active("/consultancy")}>Discuss your needs →</a>
        </nav>
      </header>

      {openGroup && !menuOpen && <button className={styles.menuBackdrop} type="button" aria-label="Close navigation menu" onClick={() => setOpenGroup(null)} />}

      {children}
      <WhatsAppLead />

      <footer className={`site-footer ${styles.footer}`}>
        <div className={styles.footerGrid}>
          <div><strong>OMNeXa Pte. Ltd.</strong><p>Where Consciousness Meets Intelligence.</p><p>Singapore · Human-centred transformation</p></div>
          <div><h2>Work with us</h2><a href="/services">Services</a><a href="/consultancy">Consultancy & discovery calls</a><a href="/work">Products & initiatives</a><a href="/india">OMNeXa in India</a><a href="/ecosystem-collaboration">Ecosystem collaboration</a><a href="https://omnexa-career.omnexagoc.com/partners" target="_blank" rel="noopener noreferrer">Partner portal</a><a href="/india/odisha/robotics">Odisha robotics learning programme</a><a href="/contact">Contact OMNeXa</a></div>
          <div><h2>Explore</h2><a href="/knowledge">Knowledge</a><a href="/convergence-brief">The Convergence Brief</a><a href="/videos">Videos</a><a href="/ai-readiness">AI Readiness</a></div>
          <div><h2>Company</h2><a href="/about">About OMNeXa</a><a href="/dhiraj-kumar">Founder</a><a href="/media">Media & brand assets</a><a href="/privacy">Privacy</a></div>
        </div>
        <p className={styles.copyright}>&copy; {new Date().getFullYear()} OMNeXa Pte. Ltd. All rights reserved.</p>
      </footer>
    </div>
  );
}
