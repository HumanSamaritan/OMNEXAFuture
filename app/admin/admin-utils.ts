export function cleanPhone(value?: string | null): string {
  return String(value || "").replace(/[^\d]/g, "");
}

export function displayDate(value?: string | null): string {
  if (!value) return "Not specified";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-SG", { day: "2-digit", month: "long", year: "numeric" }).format(date);
}

export function suggestEmail(name: string): string {
  const parts = name.toLowerCase().normalize("NFKD").replace(/[^a-z0-9\s.-]/g, "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "";
  return `${parts.length === 1 ? parts[0] : `${parts[0]}.${parts[parts.length - 1]}`}@omnexagoc.com`;
}

export async function api<T = Record<string, unknown>>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers || {}) } });
  const data = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) throw new Error(data.error || `Request failed (${response.status}).`);
  return data;
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const anchor = document.createElement("a");
  anchor.href = dataUrl;
  anchor.download = filename;
  anchor.click();
}

function esc(value: unknown): string {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function printPreparedDocument(frame: HTMLIFrameElement) {
  const doc = frame.contentDocument;
  const target = frame.contentWindow;
  if (!doc || !target) {
    frame.remove();
    alert("Unable to prepare the document. Please refresh and try again.");
    return;
  }

  let printed = false;
  const launchPrint = () => {
    if (printed) return;
    printed = true;
    try {
      target.focus();
      target.print();
    } finally {
      window.setTimeout(() => frame.remove(), 5000);
    }
  };

  const images = Array.from(doc.images);
  const pending = images.filter((image) => !image.complete);
  if (!pending.length) {
    window.setTimeout(launchPrint, 150);
  } else {
    let remaining = pending.length;
    const done = () => {
      remaining -= 1;
      if (remaining <= 0) window.setTimeout(launchPrint, 150);
    };
    pending.forEach((image) => {
      image.addEventListener("load", done, { once: true });
      image.addEventListener("error", done, { once: true });
    });
  }

  // Failsafe in case a browser never emits an image load/error event.
  window.setTimeout(launchPrint, 4000);
}

export function openLetter(title: string, body: string) {
  const frame = document.createElement("iframe");
  frame.setAttribute("title", `${title} PDF`);
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
    alert("Unable to prepare the document. Please refresh and try again.");
    return;
  }

  doc.open();
  doc.write(`<!doctype html><html><head><meta charset="utf-8"><title>${esc(title)}</title><style>
    @page{size:A4;margin:20mm}*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}html,body{margin:0;background:#fff}body{font-family:Arial,Helvetica,sans-serif;color:#152238;line-height:1.55;font-size:11pt}.head{display:flex;align-items:center;justify-content:space-between;border-bottom:2px solid #d8a53b;padding-bottom:14px;margin-bottom:26px}.head img{width:74px;height:74px;object-fit:cover;object-position:50% 16%;border-radius:16px}.brand{text-align:right}.brand strong{font-size:19px;color:#0d1f3c}.brand span{display:block;color:#667085;font-size:9pt}h1{font-size:18pt;color:#0d1f3c;margin:0 0 18px}p{margin:0 0 11px}ol{padding-left:22px}li{margin-bottom:8px}.sign{margin-top:42px;display:grid;grid-template-columns:1fr 1fr;gap:50px;break-inside:avoid}.line{border-top:1px solid #27364f;padding-top:7px;margin-top:44px}.foot{margin-top:40px;border-top:1px solid #ddd;padding-top:10px;color:#7b8493;font-size:8.5pt}.muted{color:#667085}.meta{background:#f7f8fa;padding:12px 14px;border-radius:8px;margin-bottom:20px;break-inside:avoid}
  </style></head><body><div class="head"><img src="${window.location.origin}/omnexa-logo.png" alt="OMNeXa"><div class="brand"><strong>OMNeXa Pte. Ltd.</strong><span>Where Consciousness Meets Intelligence</span><span>www.omnexagoc.com</span></div></div>${body}<div class="foot">OMNeXa Pte. Ltd. · Internal HR document. Final issue should be reviewed and signed as required.</div></body></html>`);
  doc.close();

  window.setTimeout(() => printPreparedDocument(frame), 50);
}

export function escapeHtml(value: unknown): string {
  return esc(value);
}
