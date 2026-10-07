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
    const rows = await listEmployees();
    const employees = rows
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
    const exits = rows
      .filter((row) => row.exit_request_status === "pending")
      .map((row) => ({
        id: row.id,
        employee_id: row.employee_id,
        full_name: row.full_name,
        role: row.role,
        exit_requested_by: row.exit_requested_by || "",
        exit_requested_at: row.exit_requested_at || "",
        last_working_date: row.exit_request_last_working_date || ""
      }));
    return NextResponse.json({ employees, exits });
  } catch (error) {
    console.error("HR approval queue error", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Unable to load the HR approval queue." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const reviewer = await getHrApproverEmail();
  if (!reviewer) return NextResponse.json({ error: "HR reviewer access required." }, { status: 401 });
  try {
    const body = (await request.json()) as { id?: string; decision?: string; note?: string; kind?: string };
    const id = clean(body.id, 100);
    const decision = clean(body.decision, 20);
    const kind = clean(body.kind, 20) || "employee";
    const note = clean(body.note, 500);
    if (!id || !["approve", "reject"].includes(decision)) {
      return NextResponse.json({ error: "Employee and approval decision are required." }, { status: 400 });
    }
    const employee = (await listEmployees()).find((row) => row.id === id);
    if (!employee) return NextResponse.json({ error: "Employee record was not found." }, { status: 404 });
    if (decision === "reject" && !note) return NextResponse.json({ error: "Add a reason before returning the request." }, { status: 400 });

    if (kind === "exit") {
      if (employee.exit_request_status !== "pending" || employee.status !== "active") {
        return NextResponse.json({ error: "This exit request is no longer awaiting approval." }, { status: 409 });
      }
      if ((employee.exit_requested_by || "").toLowerCase() === reviewer.toLowerCase()) {
        return NextResponse.json({ error: "The exit requester cannot approve their own request. A different HR approver is required." }, { status: 403 });
      }
      const approved = decision === "approve";
      const updated = await updateEmployee(id, {
        exit_request_status: approved ? "approved" : "returned",
        exit_reviewed_by: reviewer,
        exit_reviewed_at: new Date().toISOString(),
        exit_review_note: note || null,
        status: approved ? "exited" : "active",
        last_working_date: approved ? employee.exit_request_last_working_date || null : employee.last_working_date
      });
      await recordHrAuditEvent(id, approved ? "exit_approved" : "exit_returned", reviewer, ["exit_request_status", "status", "last_working_date"]);
      return NextResponse.json({ ok: true, kind: "exit", employee: { id: updated.id, status: updated.status, exit_request_status: updated.exit_request_status } });
    }

    if (kind !== "employee") return NextResponse.json({ error: "Unsupported approval type." }, { status: 400 });
    if (employee.screening_status !== "clear" || employee.approval_status !== "pending") {
      return NextResponse.json({ error: "This profile is not ready for HR approval." }, { status: 409 });
    }
    const screeningMakers = new Set((employee.screening_checks || []).map((check) => String(check.checked_by || "").toLowerCase()).filter(Boolean));
    if (screeningMakers.has(reviewer.toLowerCase())) {
      return NextResponse.json({ error: "The screening maker cannot approve their own screening result. A different HR approver is required." }, { status: 403 });
    }
    if ([employee.work_email, employee.personal_email].some((value) => String(value || "").toLowerCase() === reviewer.toLowerCase()) || (employee.full_name.trim().toLowerCase() === "dhiraj kumar" && reviewer.toLowerCase() === "dhiraj.kums@gmail.com")) {
      return NextResponse.json({ error: "A reviewer cannot approve their own employee record. Another authorised reviewer is required." }, { status: 403 });
    }

    const approved = decision === "approve";
    const updated = await updateEmployee(id, {
      approval_status: approved ? "approved" : "rejected",
      approval_by: reviewer,
      approval_at: new Date().toISOString(),
      workflow_stage: approved ? "approved" : "review_required",
      status: approved ? "active" : employee.status
    });
    await recordHrAuditEvent(id, approved ? "hr_approved" : "hr_returned_for_follow_up", reviewer, ["approval_status", "approval_by", "workflow_stage", "status"]);
    return NextResponse.json({ ok: true, kind: "employee", employee: { id: updated.id, workflow_stage: updated.workflow_stage, approval_status: updated.approval_status } });
  } catch (error) {
    console.error("HR approval action error", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Unable to record the HR approval decision." }, { status: 500 });
  }
}
