import { NextResponse } from "next/server";
import { getAdminEmail } from "@/lib/admin-session";
import { createEmployee, listEmployees, updateEmployee } from "@/lib/hr-store";
import { makeEmployeeId, suggestWorkEmail } from "@/lib/admin-auth";

function clean(value: unknown, max = 300): string {
  return String(value || "").trim().slice(0, max);
}

function numberOrNull(value: unknown): number | null {
  if (value === "" || value === null || value === undefined) return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

export async function GET() {
  const admin = await getAdminEmail();
  if (!admin) return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  try {
    return NextResponse.json({ employees: await listEmployees() });
  } catch (error) {
    console.error("Admin employee list error", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Unable to load employee records." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getAdminEmail();
  if (!admin) return NextResponse.json({ error: "Unauthorised." }, { status: 401 });

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const fullName = clean(body.full_name, 120);
    const role = clean(body.role, 160);
    const engagementType = body.engagement_type === "intern" ? "intern" : "employee";
    const workEmail = clean(body.work_email, 254).toLowerCase() || suggestWorkEmail(fullName);

    if (!fullName || !role || !workEmail.endsWith("@omnexagoc.com")) {
      return NextResponse.json({ error: "Name, role and a valid @omnexagoc.com work email are required." }, { status: 400 });
    }

    const employee = await createEmployee({
      employee_id: clean(body.employee_id, 60) || makeEmployeeId(fullName),
      full_name: fullName,
      work_email: workEmail,
      personal_email: clean(body.personal_email, 254) || null,
      linkedin_url: clean(body.linkedin_url, 500) || null,
      whatsapp_number: clean(body.whatsapp_number, 40) || null,
      phone_number: clean(body.phone_number, 40) || null,
      role,
      engagement_type: engagementType,
      internship_paid: engagementType === "intern" && Boolean(body.internship_paid),
      compensation_amount: numberOrNull(body.compensation_amount),
      compensation_currency: clean(body.compensation_currency, 8) || "SGD",
      start_date: clean(body.start_date, 10) || null,
      status: "active",
      workspace_account_status: "pending"
    });

    return NextResponse.json({ employee });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Admin employee create error", message);
    if (/duplicate key|unique constraint/i.test(message)) {
      return NextResponse.json({ error: "Employee ID or work email already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: "Unable to create employee record." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const admin = await getAdminEmail();
  if (!admin) return NextResponse.json({ error: "Unauthorised." }, { status: 401 });

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const id = clean(body.id, 80);
    if (!id) return NextResponse.json({ error: "Employee record is required." }, { status: 400 });

    const allowed: Record<string, unknown> = {};
    const textFields = [
      "full_name", "work_email", "personal_email", "linkedin_url", "whatsapp_number",
      "phone_number", "role", "compensation_currency", "start_date", "last_working_date",
      "workspace_account_status", "status"
    ];
    for (const field of textFields) {
      if (field in body) allowed[field] = clean(body[field], field.includes("url") ? 500 : 254) || null;
    }
    if ("engagement_type" in body) allowed.engagement_type = body.engagement_type === "intern" ? "intern" : "employee";
    if ("internship_paid" in body) allowed.internship_paid = Boolean(body.internship_paid);
    if ("compensation_amount" in body) allowed.compensation_amount = numberOrNull(body.compensation_amount);

    const employee = await updateEmployee(id, allowed);
    return NextResponse.json({ employee });
  } catch (error) {
    console.error("Admin employee update error", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Unable to update employee record." }, { status: 500 });
  }
}
