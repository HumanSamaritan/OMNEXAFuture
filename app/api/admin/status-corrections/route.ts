import { NextResponse } from "next/server";
import { getAdminEmail } from "@/lib/admin-session";
import { listEmployees, recordHrAuditEvent, updateEmployee } from "@/lib/hr-store";

function clean(value: unknown, max = 500): string {
  return String(value ?? "").trim().slice(0, max);
}

export async function POST(request: Request) {
  const maker = await getAdminEmail();
  if (!maker) return NextResponse.json({ error: "Unauthorised." }, { status: 401 });

  try {
    const body = (await request.json()) as { id?: string; reason?: string };
    const id = clean(body.id, 100);
    const reason = clean(body.reason, 500);
    if (!id || !reason) return NextResponse.json({ error: "Employee and correction reason are required." }, { status: 400 });

    const employee = (await listEmployees()).find((row) => row.id === id);
    if (!employee) return NextResponse.json({ error: "Employee record was not found." }, { status: 404 });
    if (employee.status !== "exited" || employee.exit_request_status === "approved") {
      return NextResponse.json({ error: "Only an exited record without an approved exit can be submitted for correction." }, { status: 409 });
    }
    if (employee.status_correction_status === "pending") {
      return NextResponse.json({ error: "A status correction is already awaiting approval." }, { status: 409 });
    }

    const updated = await updateEmployee(id, {
      status_correction_status: "pending",
      status_correction_requested_by: maker,
      status_correction_requested_at: new Date().toISOString(),
      status_correction_reason: reason,
      status_correction_reviewed_by: null,
      status_correction_reviewed_at: null
    });
    await recordHrAuditEvent(id, "employment_status_correction_submitted", maker, ["status_correction_status", "status_correction_reason"]);
    return NextResponse.json({ employee: updated });
  } catch (error) {
    console.error("HR status correction error", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Unable to submit the status correction." }, { status: 500 });
  }
}
