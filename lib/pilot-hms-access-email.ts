/** HMS pilot access invitation. Call only after an auditable approval and access gate.
 * This module does not send mail or grant access by itself.
 */
export const HMS_DEMO_URL = "https://www.youtube.com/watch?v=ODp-WjSw5sg";
const htmlEscape = (value: string) => value.replace(/[&<>"']/g, (ch) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch] || ch));
export function buildHmsAccessInvitation(input: { firstName: string; accessUrl: string; reference: string }) {
  const url = new URL(input.accessUrl);
  if (url.protocol !== "https:" || url.hostname !== "humanmachinesadhana.omnexagoc.com") throw new Error("Unexpected HMS access destination");
  const name = htmlEscape(input.firstName);
  const reference = htmlEscape(input.reference);
  return {
    subject: "Your OMNeXa HMS pilot access is ready",
    text: `Hello ${input.firstName},\n\nYour Human + Machine Sadhana pilot application (${input.reference}) has been approved.\n\nAccess HMS: ${url.toString()}\n\nWatch the HMS demo: ${HMS_DEMO_URL}\n\nPlease complete the HMS consent and onboarding steps when you first sign in.\n\nOMNeXa Pte. Ltd.\nWhere Consciousness Meets Intelligence`,
    html: `<!doctype html><html><body style="margin:0;padding:24px;background:#f2f5f8;font-family:Arial,sans-serif;color:#15283a"><table role="presentation" align="center" style="max-width:600px;width:100%;border-collapse:collapse"><tr><td style="background:#081b2a;padding:24px;text-align:center"><img src="https://www.omnexagoc.com/omnexa-logo.png" alt="OMNeXa" width="140" style="display:block;margin:auto;max-width:100%;height:auto"/><p style="color:#e1ebf2">Where Consciousness Meets Intelligence</p></td></tr><tr><td style="background:white;padding:28px"><h1>Welcome to the HMS pilot, ${name}</h1><p>Your application ${reference} has been approved.</p><p><a href="${htmlEscape(url.toString())}">Open Human + Machine Sadhana</a></p><p><a href="${HMS_DEMO_URL}">Watch the HMS demo on YouTube</a></p><p>At your first sign-in, review the privacy information and provide HMS-specific consent.</p></td></tr></table></body></html>`
  };
}
