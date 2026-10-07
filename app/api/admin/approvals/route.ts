import { NextResponse } from "next/server";
import { getHrApproverEmail } from "@/lib/admin-session";
import { listEmployees, recordHrAuditEvent, updateEmployee } from "@/lib/hr-store";

function clean(value: unknown, max = 300): string {
  return String(value ?? "").trim().slice(0, max);
}

export async function GET() {
  const reviewer = await getHrApproverEmail();
  if (!reviewer) return NextResponse.json({ error: "HR reviewer access required." }, { status: 401 });
  try {
    const employees = (await listEmployees())
      .filter((row) => row.approval_status === "pending" && row.screening_status === "clear")
      .map((row) => ({
        id: row.id,
        employee_id: row.employee_id,
        full_name: row.full_name,
        role: row.role,
        work_location: row.work_location || "",
        screening_checks: row.screening_checks || [],
        screening_status: row.screening_status,
        approval_status: row.approval_status
      }));
    return NextResponse.json({ employees });
  } catch (error) {
    console.error("HR approval queue error", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Unable to load the HR approval queue." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const reviewer = await getHrApproverEmail();
  if (!reviewer) return NextResponse.json({ error: "HR reviewer access required." }, { status: 401 });
  try {
    const body = (await request.json()) as { id?: string; decision?: string; note?: string };
    const id = clean(body.id, 100);
    const decision = clean(body.decision, 20);
    const note = clean(body.note, 500);
    if (!id || !["approve", "reject"].includes(decision)) return NextResponse.json({ error: "Employee and approval decision are required." }, { status: 400 });
    const employee = (await listEmployees()).find((row) => row.id === id);
    if (!employee) return NextResponse.json({ error: "Employee record was not found." }, { status: 404 });
    if (employee.screening_status !== "clear" || employee.approval_status !== "pending") return NextResponse.json({ error: "This profile is not ready for HR approval." }, { status: 409 });
    if ([employee.work_email, employee.personal_email].some((value) => String(value || "").toLowerCase() === reviewer.toLowerCase()) || (employee.full_name.trim().toLowerCase() === "dhiraj kumar" && reviewer.toLowerCase() === "dhiraj.kums@gmail.com")) {
      return NextResponse.json({ error: "A reviewer cannot approve their own employee record. Another authorised reviewer is required." }, { status: 403 });
    }
    if (decision === "reject" && !note) return NextResponse.json({ error: "Add a reason before returning the profile for follow-up." }, { status: 400 });

    const approved = decision === "approve";
    const updated = await updateEmployee(id, {
      approval_status: approved ? "approved" : "rejected",
      approval_by: reviewer,
      approval_at: new Date().toISOString(),
      workflow_stage: approved ? "approved" : "review_required",
      status: approved ? "active" : employee.status
    });
    await recordHrAuditEvent(id, approved ? "hr_approved" : "hr_returned_for_follow_up", reviewer, ["approval_status", "approval_by", "workflow_stage", "status"]);
    return NextResponse.json({ ok: true, employee: { id: updated.id, workflow_stage: updated.workflow_stage, approval_status: updated.approval_status } });
  } catch (error) {
    console.error("HR approval action error", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Unable to record the HR approval decision." }, { status: 500 });
  }
}
