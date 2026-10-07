import { NextResponse } from "next/server";
import { getAdminEmail } from "@/lib/admin-session";
import { listEmployees, recordHrAuditEvent, updateEmployee } from "@/lib/hr-store";

function clean(value: unknown, max = 100): string {
  return String(value ?? "").trim().slice(0, max);
}

export async function POST(request: Request) {
  const maker = await getAdminEmail();
  if (!maker) return NextResponse.json({ error: "Unauthorised." }, { status: 401 });

  try {
    const body = (await request.json()) as { id?: string; last_working_date?: string };
    const id = clean(body.id, 100);
    const lastWorkingDate = clean(body.last_working_date, 10);
    if (!id || !/^\d{4}-\d{2}-\d{2}$/.test(lastWorkingDate)) {
      return NextResponse.json({ error: "Employee and valid last working date are required." }, { status: 400 });
    }

    const employee = (await listEmployees()).find((row) => row.id === id);
    if (!employee) return NextResponse.json({ error: "Employee record was not found." }, { status: 404 });
    if (employee.status !== "active") return NextResponse.json({ error: "Only an active employee can have an exit request." }, { status: 409 });
    if (employee.exit_request_status === "pending") return NextResponse.json({ error: "An exit request is already awaiting approval." }, { status: 409 });

    const updated = await updateEmployee(id, {
      exit_request_status: "pending",
      exit_requested_by: maker,
      exit_requested_at: new Date().toISOString(),
      exit_reviewed_by: null,
      exit_reviewed_at: null,
      exit_review_note: null,
      exit_request_last_working_date: lastWorkingDate
    });
    await recordHrAuditEvent(id, "exit_request_submitted", maker, ["exit_request_status", "exit_request_last_working_date"]);
    return NextResponse.json({ employee: updated });
  } catch (error) {
    console.error("HR exit request error", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Unable to submit the exit request." }, { status: 500 });
  }
}
