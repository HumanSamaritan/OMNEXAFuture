"use client";

import styles from "./admin.module.css";
import { Employee } from "./types";
import { cleanPhone, escapeHtml } from "./admin-utils";

function qrUrl(value: string): string {
  return `https://quickchart.io/qr?text=${encodeURIComponent(value)}&size=300&margin=1&ecLevel=M&dark=07152b&light=ffffff`;
}

export default function CardPanel({ employee }: { employee: Employee }) {
  const linkedinQr = employee.linkedin_url ? qrUrl(employee.linkedin_url) : "";
  const whatsappLink = employee.whatsapp_number ? `https://wa.me/${cleanPhone(employee.whatsapp_number)}` : "";
  const whatsappQr = whatsappLink ? qrUrl(whatsappLink) : "";

  function printCard() {
    const popup = window.open("", "_blank", "noopener,noreferrer");
    if (!popup) {
      alert("Allow pop-ups for this site, then try again.");
      return;
    }

    const linkedInText = employee.linkedin_url
      ? employee.linkedin_url.replace(/^https?:\/\/(www\.)?/, "")
      : "Not provided";

    popup.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(employee.full_name)} - OMNeXa Visiting Card</title><style>
      @page{size:91mm 55mm;margin:0}*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}html,body{margin:0;background:#fff;font-family:Arial,Helvetica,sans-serif}.card{width:91mm;height:55mm;overflow:hidden;position:relative;background:radial-gradient(circle at 42% 15%,#163e75 0,#071b38 38%,#031126 72%,#020b18 100%);color:#fff;page-break-after:always}.card:last-child{page-break-after:auto}.card:before{content:"";position:absolute;inset:0;background:linear-gradient(130deg,transparent 0 45%,rgba(235,173,63,.12) 60%,transparent 75%);pointer-events:none}.front{display:grid;grid-template-columns:43% 57%;align-items:center;padding:5mm}.brand{height:100%;display:flex;align-items:center;justify-content:center;border-right:.35mm solid rgba(232,176,67,.75);padding-right:4mm}.brand img{width:100%;max-height:42mm;object-fit:cover;object-position:50% 16%;border-radius:4mm}.identity{padding-left:5mm;min-width:0}.identity h1{font-family:Georgia,serif;color:#f4cf7b;font-size:17pt;margin:0 0 1mm;line-height:1.05}.identity h2{font-size:9.5pt;color:#efb44b;margin:0 0 1mm}.identity .company{font-size:8.5pt;margin:0 0 3mm}.rule{height:.35mm;background:linear-gradient(90deg,#f0bf56,transparent);margin-bottom:2.4mm}.contact{font-size:6.7pt;line-height:1.55;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.contact b{display:inline-block;width:8mm;color:#efb44b}.back{display:grid;grid-template-columns:44% 56%;padding:4.5mm}.backbrand{display:flex;flex-direction:column;justify-content:center;align-items:center;padding-right:4mm;border-right:.35mm solid rgba(232,176,67,.75);text-align:center}.backbrand img{width:95%;max-height:35mm;object-fit:cover;object-position:50% 16%;border-radius:4mm}.backbrand strong{margin-top:2mm;font-size:7.5pt;letter-spacing:.12em;text-transform:uppercase;color:#f2d995}.connect{padding-left:4.5mm;display:flex;flex-direction:column;justify-content:center}.connect h3{font-family:Georgia,serif;color:#f2ce78;font-size:12pt;margin:0 0 3mm;text-align:center}.qrs{display:grid;grid-template-columns:1fr 1fr;gap:4mm;text-align:center}.qrs img,.placeholder{width:25mm;height:25mm;background:#fff;border-radius:2mm;padding:1mm}.placeholder{display:flex;align-items:center;justify-content:center;color:#0b1a32;font-size:7pt}.qrs b{display:block;color:#efb44b;font-size:6.5pt;margin-top:1mm}.qrs span{display:block;font-size:5.5pt;color:#d6deec}.site{text-align:center;font-size:6.7pt;color:#f2ce78;margin:2.5mm 0 0;letter-spacing:.06em}
    </style></head><body>
      <section class="card front"><div class="brand"><img src="${location.origin}/omnexa-logo.png" alt="OMNeXa"></div><div class="identity"><h1>${escapeHtml(employee.full_name)}</h1><h2>${escapeHtml(employee.role)}</h2><p class="company">OMNeXa Pte. Ltd.</p><div class="rule"></div><div class="contact"><div><b>Phone</b>${escapeHtml(employee.phone_number || "—")}</div><div><b>WhatsApp</b>${escapeHtml(employee.whatsapp_number || "—")}</div><div><b>Web</b>www.omnexagoc.com</div><div><b>LinkedIn</b>${escapeHtml(linkedInText)}</div></div></div></section>
      <section class="card back"><div class="backbrand"><img src="${location.origin}/omnexa-logo.png" alt="OMNeXa"><strong>Where Consciousness Meets Intelligence</strong></div><div class="connect"><h3>Connect with ${escapeHtml(employee.full_name.split(/\s+/)[0] || employee.full_name)}</h3><div class="qrs"><div>${linkedinQr ? `<img src="${linkedinQr}" alt="LinkedIn QR">` : `<div class="placeholder">Add LinkedIn</div>`}<b>LinkedIn</b><span>Scan to connect</span></div><div>${whatsappQr ? `<img src="${whatsappQr}" alt="WhatsApp QR">` : `<div class="placeholder">Add WhatsApp</div>`}<b>WhatsApp</b><span>Scan to message</span></div></div><p class="site">www.omnexagoc.com</p></div></section>
      <script>window.onload=()=>setTimeout(()=>window.print(),700);</script></body></html>`);
    popup.document.close();
  }

  return (
    <section className={styles.panel}>
      <div className={styles.panelTitle}>
        <div><p className={styles.eyebrow}>Standard OMNeXa identity</p><h1>Visiting card</h1></div>
        <button className={styles.primaryButton} onClick={printCard}>Print / Save card PDF</button>
      </div>
      <p className={styles.helper}>This design is locked for consistency across OMNeXa. It uses the official website logo without redrawing it. QR codes link directly to the employee&apos;s LinkedIn and WhatsApp.</p>
      <div className={styles.cardGallery}>
        <div className={`${styles.businessCard} ${styles.cardFront}`}>
          <div className={styles.cardLogoArea}><img src="/omnexa-logo.png" alt="OMNeXa official logo" /></div>
          <div className={styles.cardIdentity}>
            <h2>{employee.full_name}</h2><h3>{employee.role}</h3><p>OMNeXa Pte. Ltd.</p><div className={styles.cardRule} />
            <div className={styles.cardContacts}><span>☎ {employee.phone_number || "—"}</span><span>◉ {employee.whatsapp_number || "—"}</span><span>◎ www.omnexagoc.com</span><span>in {employee.linkedin_url ? employee.linkedin_url.replace(/^https?:\/\/(www\.)?/, "") : "—"}</span></div>
          </div>
        </div>
        <div className={`${styles.businessCard} ${styles.cardBack}`}>
          <div className={styles.backBrand}><img src="/omnexa-logo.png" alt="OMNeXa official logo" /><strong>Where Consciousness Meets Intelligence</strong></div>
          <div className={styles.qrGrid}>
            <div>{linkedinQr ? <img src={linkedinQr} alt="LinkedIn QR code" /> : <div className={styles.qrPlaceholder}>Add LinkedIn</div>}<strong>LinkedIn</strong><span>Scan to connect</span></div>
            <div>{whatsappQr ? <img src={whatsappQr} alt="WhatsApp QR code" /> : <div className={styles.qrPlaceholder}>Add WhatsApp</div>}<strong>WhatsApp</strong><span>Scan to message</span></div>
          </div>
          <p className={styles.cardWebsite}>www.omnexagoc.com</p>
        </div>
      </div>
    </section>
  );
}
