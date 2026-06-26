import { NextResponse } from "next/server";
import { Resend } from "resend";

const toEmail = process.env.CONTACT_TO_EMAIL || "dhiraj.kumar@omnexagoc.com";
const fromEmail = process.env.CONTACT_FROM_EMAIL || "OMNeXa Website <onboarding@resend.dev>";

function clean(value: unknown): string {
  return String(value || "").trim();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Basic honeypot spam check. Real users will never see or fill this field.
    if (clean(body.companyWebsite)) {
      return NextResponse.json({ ok: true });
    }

    const name = clean(body.name);
    const email = clean(body.email);
    const phone = clean(body.phone);
    const organisation = clean(body.organisation);
    const interest = clean(body.interest);
    const message = clean(body.message);

    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (!interest) {
      return NextResponse.json({ error: "Please select an area of interest." }, { status: 400 });
    }

    if (!message || message.length < 10) {
      return NextResponse.json({ error: "Please enter a short message." }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        {
          error:
            "Email service is not configured yet. Please add RESEND_API_KEY in Vercel Environment Variables or email dhiraj.kumar@omnexagoc.com directly."
        },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 680px; line-height: 1.6; color: #172033;">
        <h2 style="color:#0f172a;">New OMNeXa Website Enquiry</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}</p>
        <p><strong>Organisation:</strong> ${escapeHtml(organisation || "Not provided")}</p>
        <p><strong>Area of interest:</strong> ${escapeHtml(interest)}</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
      </div>
    `;

    await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: email,
      subject: `OMNeXa enquiry: ${interest}`,
      html
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form error", error);
    return NextResponse.json(
      { error: "Unable to send enquiry right now. Please email dhiraj.kumar@omnexagoc.com directly." },
      { status: 500 }
    );
  }
}
