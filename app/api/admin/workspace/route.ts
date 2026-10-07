import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getAdminEmail } from "@/lib/admin-session";
import { listEmployees, updateEmployee } from "@/lib/hr-store";

function base64url(input: string | Buffer): string {
  return Buffer.from(input).toString("base64url");
}

function clean(value: unknown, max = 254): string {
  return String(value || "").trim().slice(0, max);
}

async function getGoogleAccessToken(): Promise<string> {
  const clientEmail = process.env.GOOGLE_WORKSPACE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_WORKSPACE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const subject = process.env.GOOGLE_WORKSPACE_ADMIN_SUBJECT;
  if (!clientEmail || !privateKey || !subject) {
    throw new Error("Google Workspace Admin API is not configured.");
  }

  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64url(JSON.stringify({
    iss: clientEmail,
    sub: subject,
    scope: "https://www.googleapis.com/auth/admin.directory.user",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600
  }));
  const signingInput = `${header}.${payload}`;
  const signature = crypto.sign("RSA-SHA256", Buffer.from(signingInput), privateKey).toString("base64url");
  const assertion = `${signingInput}.${signature}`;

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion
    })
  });
  const data = (await response.json()) as { access_token?: string; error_description?: string };
  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || "Unable to authorise Google Workspace Admin API.");
  }
  return data.access_token;
}

export async function POST(request: Request) {
  const admin = await getAdminEmail();
  if (!admin) return NextResponse.json({ error: "Unauthorised." }, { status: 401 });

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const id = clean(body.id, 80);
    const fullName = clean(body.full_name, 120);
    const workEmail = clean(body.work_email).toLowerCase();
    if (!id || !fullName || !workEmail.endsWith("@omnexagoc.com")) {
      return NextResponse.json({ error: "Employee, name and OMNeXa email are required." }, { status: 400 });
    }

    const employee = (await listEmployees()).find((row) => row.id === id);
    if (!employee) return NextResponse.json({ error: "Employee record was not found." }, { status: 404 });
    if (employee.workflow_stage !== "approved") return NextResponse.json({ error: "Google Workspace provisioning is available after screening and HR approval." }, { status: 409 });

    const accessToken = await getGoogleAccessToken();
    const parts = fullName.split(/\s+/).filter(Boolean);
    const givenName = parts[0] || fullName;
    const familyName = parts.slice(1).join(" ") || ".";
    const temporaryPassword = `${crypto.randomBytes(9).toString("base64url")}A9!`;

    const response = await fetch("https://admin.googleapis.com/admin/directory/v1/users", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        primaryEmail: workEmail,
        name: { givenName, familyName },
        password: temporaryPassword,
        changePasswordAtNextLogin: true
      })
    });

    const data = (await response.json()) as { id?: string; error?: { message?: string } };
    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || "Unable to create Google Workspace user." }, { status: response.status });
    }

    await updateEmployee(id, { workspace_account_status: "created" });
    return NextResponse.json({
      ok: true,
      googleUserId: data.id,
      workEmail,
      temporaryPassword,
      note: "Share this temporary password securely. The user must change it at first sign-in."
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create Google Workspace account.";
    console.error("Workspace account creation error", message);
    const status = message.includes("not configured") ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
