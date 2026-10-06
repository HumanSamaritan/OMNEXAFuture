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

export function openLetter(title: string, body: string) {
  const popup = window.open("", "_blank", "noopener,noreferrer");
  if (!popup) {
    alert("Allow pop-ups for this site, then try again.");
    return;
  }
  popup.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${esc(title)}</title><style>
    @page{size:A4;margin:20mm}body{font-family:Arial,Helvetica,sans-serif;color:#152238;line-height:1.55;font-size:11pt;margin:0}.head{display:flex;align-items:center;justify-content:space-between;border-bottom:2px solid #d8a53b;padding-bottom:14px;margin-bottom:26px}.head img{width:74px;height:74px;object-fit:cover;object-position:50% 16%;border-radius:16px}.brand{text-align:right}.brand strong{font-size:19px;color:#0d1f3c}.brand span{display:block;color:#667085;font-size:9pt}h1{font-size:18pt;color:#0d1f3c;margin:0 0 18px}p{margin:0 0 11px}ol{padding-left:22px}li{margin-bottom:8px}.sign{margin-top:42px;display:grid;grid-template-columns:1fr 1fr;gap:50px}.line{border-top:1px solid #27364f;padding-top:7px;margin-top:44px}.foot{margin-top:40px;border-top:1px solid #ddd;padding-top:10px;color:#7b8493;font-size:8.5pt}.muted{color:#667085}.meta{background:#f7f8fa;padding:12px 14px;border-radius:8px;margin-bottom:20px}
  </style></head><body><div class="head"><img src="/omnexa-logo.png" alt="OMNeXa"><div class="brand"><strong>OMNeXa Pte. Ltd.</strong><span>Where Consciousness Meets Intelligence</span><span>www.omnexagoc.com</span></div></div>${body}<div class="foot">OMNeXa Pte. Ltd. · Internal HR document. Final issue should be reviewed and signed as required.</div><script>window.onload=()=>setTimeout(()=>window.print(),250);</script></body></html>`);
  popup.document.close();
}

export function escapeHtml(value: unknown): string {
  return esc(value);
}
