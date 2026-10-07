"use client";

import styles from "./admin.module.css";
import { Employee } from "./types";
import { cleanPhone, escapeHtml } from "./admin-utils";

function qrUrl(value: string): string {
  return `https://quickchart.io/qr?text=${encodeURIComponent(value)}&size=300&margin=1&ecLevel=M&dark=07152b&light=ffffff`;
}

function linkedInDisplay(value?: string | null): string {
  return String(value || "").replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

function linkedInMark(): string {
  return '<svg class="linkedin-icon" viewBox="0 0 16 16" role="img" aria-label="LinkedIn"><rect width="16" height="16" rx="2" fill="#0A66C2"/><text x="8" y="12" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="10" font-weight="700" fill="#fff">in</text></svg>';
}

export default function CardPanel({ employee }: { employee: Employee }) {
  const linkedinQr = employee.linkedin_url ? qrUrl(employee.linkedin_url) : "";
  const whatsappLink = employee.whatsapp_number ? `https://wa.me/${cleanPhone(employee.whatsapp_number)}` : "";
  const whatsappQr = whatsappLink ? qrUrl(whatsappLink) : "";
  const contactRows = [
    employee.phone_number ? `<div class="contact"><b>☎</b><span>${escapeHtml(employee.phone_number)}</span></div>` : "",
    employee.whatsapp_number ? `<div class="contact"><b>◉</b><span>${escapeHtml(employee.whatsapp_number)}</span></div>` : "",
    `<div class="contact"><b>◎</b><span>www.omnexagoc.com</span></div>`,
    employee.work_email ? `<div class="contact"><b>@</b><span>${escapeHtml(employee.work_email)}</span></div>` : "",
    employee.linkedin_url ? `<div class="contact linkedin">${linkedInMark()}<span>${escapeHtml(linkedInDisplay(employee.linkedin_url))}</span></div>` : ""
  ].filter(Boolean).join("");

  function printCard() {
    const frame = document.createElement("iframe");
    frame.setAttribute("title", "OMNeXa visiting card print sheet");
    Object.assign(frame.style, {
      position: "fixed",
      width: "210mm",
      height: "297mm",
      left: "-10000px",
      top: "0",
      border: "0",
      opacity: "0",
      pointerEvents: "none"
    });
    document.body.appendChild(frame);

    const doc = frame.contentDocument;
    if (!doc) {
      frame.remove();
      alert("Unable to prepare the card. Please refresh and try again.");
      return;
    }

    doc.open();
    doc.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(employee.full_name)} - OMNeXa Visiting Card</title><style>
      @page{size:A4 portrait;margin:0}
      *{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}
      html,body{width:210mm;height:280mm;margin:0;background:#fff;font-family:Arial,Helvetica,sans-serif}
      .sheet{position:relative;width:210mm;height:280mm;overflow:hidden;page-break-after:always;break-after:page}
      .sheet:last-child{page-break-after:auto;break-after:auto}
      .card{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:90mm;height:54mm;overflow:hidden;background:radial-gradient(circle at 42% 15%,#163e75 0,#071b38 38%,#031126 72%,#020b18 100%);color:#fff}
      .card:before{content:"";position:absolute;inset:0;background:linear-gradient(130deg,transparent 0 45%,rgba(235,173,63,.12) 60%,transparent 75%);pointer-events:none}
      .front{display:grid;grid-template-columns:43% 57%;align-items:center;padding:4.5mm}
      .brand{height:100%;display:flex;align-items:center;justify-content:center;border-right:.35mm solid rgba(232,176,67,.75);padding-right:3.5mm}
      .brand img{width:100%;max-height:42mm;object-fit:cover;object-position:50% 16%}
      .identity{padding-left:4mm;min-width:0}
      .identity h1{font-family:Georgia,serif;color:#f4cf7b;font-size:16pt;margin:0 0 1mm;line-height:1.02}
      .identity h2{font-size:9pt;color:#efb44b;margin:0 0 1mm}
      .identity .company{font-size:8pt;margin:0 0 2mm}
      .rule{height:.35mm;background:linear-gradient(90deg,#f0bf56,transparent);margin-bottom:1.5mm}
      .contacts{display:grid;gap:.65mm;min-width:0}
      .contact{display:flex;align-items:baseline;gap:1.2mm;min-width:0;font-size:6.3pt;line-height:1.16}
      .contact b{flex:0 0 4mm;color:#efb44b}
      .contact span{min-width:0;overflow-wrap:anywhere;word-break:break-word}
      .linkedin{font-size:5.7pt;line-height:1.1;align-items:center}.linkedin-icon{display:block;flex:0 0 3mm;width:3mm;height:3mm}
      .back{display:grid;grid-template-columns:42% 58%;padding:4mm}
      .backbrand{display:flex;flex-direction:column;justify-content:center;align-items:center;padding-right:3mm;border-right:.35mm solid rgba(232,176,67,.75);text-align:center}
      .backbrand img{width:100%;max-height:34mm;object-fit:cover;object-position:50% 16%}
      .backbrand strong{margin-top:1.5mm;font-size:6.5pt;letter-spacing:.08em;text-transform:uppercase;color:#f2d995}
      .connect{min-width:0;padding-left:3mm;display:flex;flex-direction:column;justify-content:center}
      .connect h3{font-family:Georgia,serif;color:#f2ce78;font-size:11pt;margin:0 0 2mm;text-align:center}
      .qrs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:2mm;min-width:0;text-align:center}
      .qr{min-width:0}
      .qrs img,.placeholder{display:block;width:100%;max-width:21mm;aspect-ratio:1;height:auto;margin:0 auto;background:#fff;padding:1mm}
      .placeholder{display:flex;align-items:center;justify-content:center;color:#0b1a32;font-size:6pt}
      .qrs b{display:block;color:#efb44b;font-size:6pt;margin-top:1mm}
      .qrs span{display:block;font-size:5pt;color:#d6deec}
      .site{text-align:center;font-size:6pt;color:#f2ce78;margin:2mm 0 0;letter-spacing:.03em}
    </style></head><body>
      <section class="sheet"><div class="card front"><div class="brand"><img src="${location.origin}/omnexa-logo.png" alt="OMNeXa"></div><div class="identity"><h1>${escapeHtml(employee.full_name)}</h1><h2>${escapeHtml(employee.role)}</h2><p class="company">OMNeXa Pte. Ltd.</p><div class="rule"></div><div class="contacts">${contactRows}</div></div></div></section>
      <section class="sheet"><div class="card back"><div class="backbrand"><img src="${location.origin}/omnexa-logo.png" alt="OMNeXa"><strong>Where Consciousness Meets Intelligence</strong></div><div class="connect"><h3>Connect with ${escapeHtml(employee.full_name.split(/\s+/)[0] || employee.full_name)}</h3><div class="qrs"><div class="qr">${linkedinQr ? `<img src="${linkedinQr}" alt="LinkedIn QR">` : `<div class="placeholder">Add LinkedIn</div>`}<b>LinkedIn</b><span>Scan to connect</span></div><div class="qr">${whatsappQr ? `<img src="${whatsappQr}" alt="WhatsApp QR">` : `<div class="placeholder">Add WhatsApp</div>`}<b>WhatsApp</b><span>Scan to message</span></div></div><p class="site">www.omnexagoc.com</p></div></div></section>
    </body></html>`);
    doc.close();

    let printed = false;
    const launchPrint = () => {
      if (printed) return;
      printed = true;
      try {
        frame.contentWindow?.focus();
        frame.contentWindow?.print();
      } finally {
        window.setTimeout(() => frame.remove(), 5000);
      }
    };

    const images = Array.from(doc.images);
    const pending = images.filter((image) => !image.complete);
    if (!pending.length) {
      window.setTimeout(launchPrint, 250);
      return;
    }

    let remaining = pending.length;
    const done = () => {
      remaining -= 1;
      if (remaining <= 0) window.setTimeout(launchPrint, 250);
    };
    pending.forEach((image) => {
      image.addEventListener("load", done, { once: true });
      image.addEventListener("error", done, { once: true });
    });
    window.setTimeout(launchPrint, 4000);
  }

  const previewContactStyle = {
    display: "flex",
    alignItems: "baseline",
    gap: "5px",
    minWidth: 0,
    fontSize: "clamp(6px, .78vw, 11px)",
    lineHeight: 1.2
  } as const;
  const valueStyle = {
    minWidth: 0,
    overflow: "visible",
    textOverflow: "clip",
    whiteSpace: "normal",
    overflowWrap: "anywhere"
  } as const;

  return (
    <section className={styles.panel}>
      <div className={styles.panelTitle}>
        <div><p className={styles.eyebrow}>Standard OMNeXa identity</p><h1>Visiting card</h1></div>
        <button type="button" className={styles.primaryButton} onClick={printCard}>Save / Print card PDF</button>
      </div>
      <p className={styles.helper}>The print file uses two A4 pages with front and back centred at true 90 × 54 mm card size. Print at 100% scale and use duplex, flip on the long edge, for aligned two-sided cards.</p>
      <div className={styles.cardGallery}>
        <div className={`${styles.businessCard} ${styles.cardFront}`}>
          <div className={styles.cardLogoArea}><img src="/omnexa-logo.png" alt="OMNeXa official logo" /></div>
          <div className={styles.cardIdentity}>
            <h2>{employee.full_name}</h2><h3>{employee.role}</h3><p>OMNeXa Pte. Ltd.</p><div className={styles.cardRule} />
            <div className={styles.cardContacts}>
              {employee.phone_number && <div style={previewContactStyle}><span aria-hidden="true">☎</span><span style={valueStyle}>{employee.phone_number}</span></div>}
              {employee.whatsapp_number && <div style={previewContactStyle}><span aria-hidden="true">◉</span><span style={valueStyle}>{employee.whatsapp_number}</span></div>}
              <div style={previewContactStyle}><span aria-hidden="true">◎</span><span style={valueStyle}>www.omnexagoc.com</span></div>
              {employee.work_email && <div style={previewContactStyle}><span aria-hidden="true">@</span><span style={valueStyle}>{employee.work_email}</span></div>}
              {employee.linkedin_url && <div style={{ ...previewContactStyle, fontSize: "clamp(5px, .68vw, 9px)", alignItems: "center" }}><svg width="16" height="16" viewBox="0 0 16 16" role="img" aria-label="LinkedIn"><rect width="16" height="16" rx="2" fill="#0A66C2" /><text x="8" y="12" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="10" fontWeight="700" fill="#fff">in</text></svg><span style={valueStyle}>{linkedInDisplay(employee.linkedin_url)}</span></div>}
            </div>
          </div>
        </div>
        <div className={`${styles.businessCard} ${styles.cardBack}`}>
          <div className={styles.backBrand}><img src="/omnexa-logo.png" alt="OMNeXa official logo" /><strong>Where Consciousness Meets Intelligence</strong></div>
          <div className={styles.qrGrid} style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "4%", minWidth: 0 }}>
            <div style={{ minWidth: 0 }}>{linkedinQr ? <img src={linkedinQr} alt="LinkedIn QR code" /> : <div className={styles.qrPlaceholder}>Add LinkedIn</div>}<strong>LinkedIn</strong><span>Scan to connect</span></div>
            <div style={{ minWidth: 0 }}>{whatsappQr ? <img src={whatsappQr} alt="WhatsApp QR code" /> : <div className={styles.qrPlaceholder}>Add WhatsApp</div>}<strong>WhatsApp</strong><span>Scan to message</span></div>
          </div>
          <p className={styles.cardWebsite}>www.omnexagoc.com</p>
        </div>
      </div>
    </section>
  );
}
