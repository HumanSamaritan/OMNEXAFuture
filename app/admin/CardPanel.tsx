"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import styles from "./admin.module.css";
import { Employee } from "./types";
import { cleanPhone, downloadDataUrl } from "./admin-utils";

export default function CardPanel({ employee }: { employee: Employee }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const linkedinQr = employee.linkedin_url ? `/api/admin/qr?data=${encodeURIComponent(employee.linkedin_url)}` : "";
  const whatsappQr = employee.whatsapp_number ? `/api/admin/qr?data=${encodeURIComponent(`https://wa.me/${cleanPhone(employee.whatsapp_number)}`)}` : "";

  async function downloadCard(side: "front" | "back") {
    const target = side === "front" ? frontRef.current : backRef.current;
    if (!target) return;
    setBusy(true);
    setMessage("");
    try {
      const dataUrl = await toPng(target, { cacheBust: true, pixelRatio: 3 });
      const safeName = employee.full_name.replace(/\s+/g, "-").toLowerCase();
      downloadDataUrl(dataUrl, `${safeName}-omnexa-card-${side}.png`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to export visiting card.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className={styles.panel}>
      <div className={styles.panelTitle}>
        <div><p className={styles.eyebrow}>Standard OMNeXa identity</p><h1>Visiting card</h1></div>
        <div className={styles.buttonRow}>
          <button className={styles.secondaryButton} disabled={busy} onClick={() => void downloadCard("front")}>Download front PNG</button>
          <button className={styles.secondaryButton} disabled={busy} onClick={() => void downloadCard("back")}>Download back PNG</button>
        </div>
      </div>
      <p className={styles.helper}>The same OMNeXa design is used for everyone. LinkedIn and WhatsApp QR codes are generated directly from the employee record.</p>
      {message && <div className={styles.banner}>{message}</div>}
      <div className={styles.cardGallery}>
        <div ref={frontRef} className={`${styles.businessCard} ${styles.cardFront}`}>
          <div className={styles.cardLogoArea}><img src="/omnexa-logo.png" alt="OMNeXa official logo" /></div>
          <div className={styles.cardIdentity}>
            <h2>{employee.full_name}</h2>
            <h3>{employee.role}</h3>
            <p>OMNeXa Pte. Ltd.</p>
            <div className={styles.cardRule} />
            <div className={styles.cardContacts}>
              <span>☎ {employee.phone_number || "—"}</span>
              <span>◉ {employee.whatsapp_number || "—"}</span>
              <span>◎ www.omnexagoc.com</span>
              <span>in {employee.linkedin_url ? employee.linkedin_url.replace(/^https?:\/\/(www\.)?/, "") : "—"}</span>
            </div>
          </div>
        </div>

        <div ref={backRef} className={`${styles.businessCard} ${styles.cardBack}`}>
          <div className={styles.backBrand}>
            <img src="/omnexa-logo.png" alt="OMNeXa official logo" />
            <strong>Where Consciousness Meets Intelligence</strong>
          </div>
          <div className={styles.qrGrid}>
            <div>
              {linkedinQr ? <img src={linkedinQr} alt="LinkedIn QR code" /> : <div className={styles.qrPlaceholder}>Add LinkedIn</div>}
              <strong>LinkedIn</strong><span>Scan to connect</span>
            </div>
            <div>
              {whatsappQr ? <img src={whatsappQr} alt="WhatsApp QR code" /> : <div className={styles.qrPlaceholder}>Add WhatsApp</div>}
              <strong>WhatsApp</strong><span>Scan to message</span>
            </div>
          </div>
          <p className={styles.cardWebsite}>www.omnexagoc.com</p>
        </div>
      </div>
    </section>
  );
}
