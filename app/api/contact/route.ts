import { NextResponse } from "next/server";
import { Resend } from "resend";

const toEmail = process.env.CONTACT_TO_EMAIL || "dhiraj.kumar@omnexagoc.com";
const fromEmail = process.env.CONTACT_FROM_EMAIL || "OMNeXa Website <onboarding@resend.dev>";
const replyEmail = process.env.CONTACT_REPLY_EMAIL || toEmail;
const sendConfirmationEmail = process.env.CONTACT_SEND_CONFIRMATION === "true";

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

function plainText(value: string): string {
  return value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function getErrorMessage(error: unknown): string {
  if (!error) {
    return "Unknown email provider error.";
  }

  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && "message" in error) {
    return String((error as { message?: unknown }).message || "Unknown email provider error.");
  }

  return "Unknown email provider error.";
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
    const safeMessage = escapeHtml(plainText(message)).replace(/\n/g, "<br />");

    const ownerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 680px; line-height: 1.6; color: #172033;">
        <h2 style="color:#0f172a;">New OMNeXa Website Enquiry</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}</p>
        <p><strong>Organisation:</strong> ${escapeHtml(organisation || "Not provided")}</p>
        <p><strong>Area of interest:</strong> ${escapeHtml(interest)}</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
      </div>
    `;

    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 680px; line-height: 1.6; color: #172033;">
        <h2 style="color:#0f172a;">Thank you for contacting OMNeXa</h2>
        <p>Dear ${escapeHtml(name)},</p>
        <p>Thank you for reaching out to OMNeXa. We have received your enquiry and will review it shortly.</p>
        <p><strong>Area of interest:</strong> ${escapeHtml(interest)}</p>
        <p><strong>Your message:</strong></p>
        <p>${safeMessage}</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
        <p>If you need to add anything, you can reply to this email or write to ${escapeHtml(replyEmail)}.</p>
        <p>Regards,<br />OMNeXa</p>
      </div>
    `;

    const ownerResult = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: email,
      subject: `OMNeXa enquiry: ${interest}`,
      html: ownerHtml
    });

    if (ownerResult.error) {
      const providerMessage = getErrorMessage(ownerResult.error);
      console.error("Resend owner email error", {
        error: ownerResult.error,
        fromEmail,
        toEmail
      });
      return NextResponse.json(
        {
          error: `Email provider rejected the enquiry email: ${providerMessage}. Please check RESEND_API_KEY, CONTACT_FROM_EMAIL, and Resend domain verification in Vercel.`
        },
        { status: 502 }
      );
    }

    if (sendConfirmationEmail) {
      const confirmationResult = await resend.emails.send({
        from: fromEmail,
        to: [email],
        replyTo: replyEmail,
        subject: "We received your OMNeXa enquiry",
        html: confirmationHtml
      });

      if (confirmationResult.error) {
        console.error("Resend confirmation email error", {
          error: confirmationResult.error,
          fromEmail,
          confirmationTo: email
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form error", error);
    return NextResponse.json(
      { error: "Unable to send enquiry right now. Please email dhiraj.kumar@omnexagoc.com directly." },
      { status: 500 }
    );
  }
}
