import { NextResponse } from "next/server";
import { getAdminEmail } from "@/lib/admin-session";
import { listEmployees, recordHrAuditEvent, updateEmployee } from "@/lib/hr-store";

const CHECK_TYPES = ["sg_un_sanctions", "ofac", "uk", "eu", "au", "fatf_jurisdiction", "pep_media", "criminal_fraud"] as const;
const OUTCOMES = ["no_match", "potential_match", "unable_to_check", "not_applicable"] as const;

function clean(value: unknown, max = 400): string {
  return String(value ?? "").trim().slice(0, max);
}

export async function POST(request: Request) {
  const admin = await getAdminEmail();
  if (!admin) return NextResponse.json({ error: "Unauthorised." }, { status: 401 });

  try {
    const body = (await request.json()) as { id?: string; checks?: Array<Record<string, unknown>> };
    const id = clean(body.id, 100);
    if (!id || !Array.isArray(body.checks)) return NextResponse.json({ error: "Employee and check results are required." }, { status: 400 });
    const employee = (await listEmployees()).find((row) => row.id === id);
    if (!employee) return NextResponse.json({ error: "Employee record was not found." }, { status: 404 });
    if (!employee.screening_consent) return NextResponse.json({ error: "Record the person's screening consent before screening." }, { status: 409 });

    const checks = body.checks.map((item) => {
      const checkType = clean(item.check_type, 60);
      const outcome = clean(item.outcome, 40);
      const sourceUrl = clean(item.source_url, 500);
      const note = clean(item.note, 400);
      if (!CHECK_TYPES.includes(checkType as typeof CHECK_TYPES[number])) throw new Error("Unsupported screening check.");
      if (!OUTCOMES.includes(outcome as typeof OUTCOMES[number])) throw new Error("Unsupported screening outcome.");
      if (sourceUrl && !sourceUrl.startsWith("https://")) throw new Error("Screening references must use secure HTTPS URLs.");
      if ((outcome === "no_match" || outcome === "potential_match") && !sourceUrl) throw new Error("Add the official source URL or a precise source reference for each completed check.");
      if ((outcome === "potential_match" || outcome === "not_applicable") && !note) throw new Error("Add a brief reason for potential matches and not-applicable checks.");
      return {
        check_type: checkType,
        source_name: clean(item.source_name, 120),
        source_url: sourceUrl,
        checked_at: new Date().toISOString(),
        checked_by: admin,
        outcome: outcome as typeof OUTCOMES[number],
        note
      };
    });

    const unique = new Map(checks.map((check) => [check.check_type, check]));
    if (unique.size !== CHECK_TYPES.length) return NextResponse.json({ error: "Complete each screening category exactly once." }, { status: 400 });
    const hasPotential = checks.some((check) => check.outcome === "potential_match");
    const completed = checks.every((check) => check.outcome === "no_match" || (check.outcome === "not_applicable" && Boolean(check.note)));
    const screeningStatus = hasPotential ? "potential_match" : completed ? "clear" : checks.some((check) => check.outcome === "unable_to_check") ? "unable_to_complete" : "in_progress";
    const workflowStage = hasPotential ? "review_required" : screeningStatus === "clear" ? "approval_pending" : "screening_pending";
    const updated = await updateEmployee(id, {
      screening_checks: checks,
      screening_status: screeningStatus,
      workflow_stage: workflowStage,
      approval_status: screeningStatus === "clear" ? "pending" : "not_requested"
    });
    await recordHrAuditEvent(id, "manual_screening_saved", admin, ["screening_checks", "screening_status", "workflow_stage"]);
    return NextResponse.json({ employee: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save screening checks.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
