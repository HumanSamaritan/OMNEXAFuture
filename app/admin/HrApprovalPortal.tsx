"use client";

import { useEffect, useState } from "react";
import { api } from "./admin-utils";
import styles from "./admin.module.css";

type ReviewPerson = {
  id: string;
  employee_id: string;
  full_name: string;
  role: string;
  work_location: string;
  screening_status: string;
  approval_status: string;
  screening_checks: Array<{ check_type: string; source_name: string; source_url: string; checked_at: string; checked_by?: string; outcome: string; note?: string }>;
};
type ExitRequest = {
  id: string;
  employee_id: string;
  full_name: string;
  role: string;
  exit_requested_by: string;
  exit_requested_at: string;
  last_working_date: string;
};
type StatusCorrection = {
  id: string;
  employee_id: string;
  full_name: string;
  role: string;
  requested_by: string;
  requested_at: string;
  reason: string;
};

export default function HrApprovalPortal({ reviewer, onLogout }: { reviewer: string; onLogout: () => void }) {
  const [employees, setEmployees] = useState<ReviewPerson[]>([]);
  const [exits, setExits] = useState<ExitRequest[]>([]);
  const [corrections, setCorrections] = useState<StatusCorrection[]>([]);
  const [busyId, setBusyId] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    try {
      const data = await api<{ employees: ReviewPerson[]; exits: ExitRequest[]; corrections: StatusCorrection[] }>("/api/admin/approvals", { method: "GET" });
      setEmployees(data.employees || []);
      setExits(data.exits || []);
      setCorrections(data.corrections || []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load approvals.");
    }
  }

  useEffect(() => { void load(); }, []);

  async function decide(id: string, name: string, decision: "approve" | "reject", kind: "employee" | "exit" | "correction") {
    const note = decision === "reject" ? window.prompt("Reason to return this request for follow-up?") : "";
    if (decision === "reject" && !note?.trim()) return;
    setBusyId(id);
    setMessage("");
    try {
      await api("/api/admin/approvals", { method: "POST", body: JSON.stringify({ id, decision, note, kind }) });
      if (kind === "exit") setExits((current) => current.filter((item) => item.id !== id));
      else if (kind === "correction") setCorrections((current) => current.filter((item) => item.id !== id));
      else setEmployees((current) => current.filter((item) => item.id !== id));
      const label = kind === "exit" ? " exit" : kind === "correction" ? " status correction" : " screening and onboarding";
      setMessage(name + (decision === "approve" ? label + " approved." : label + " returned for follow-up."));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save the decision.");
    } finally {
      setBusyId("");
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.adminHeader}>
        <div className={styles.headerBrand}><img src="/omnexa-logo.png" alt="OMNeXa" /><div><strong>OMNeXa HR review</strong><span>Maker-checker decisions</span></div></div>
        <div className={styles.headerActions}><span>{reviewer}</span><button className={styles.secondaryButton} onClick={onLogout}>Sign out</button></div>
      </header>
      <section className={styles.shell}>
        <div className={styles.privateNotice}>Reviewer-only access. The reviewer must be different from the screening or exit-request maker.</div>
        {message && <div className={styles.banner}>{message}</div>}

        <section className={styles.panel}>
          <div className={styles.panelTitle}><div><p className={styles.eyebrow}>Screening result checker</p><h1>Pending screening approvals</h1></div><span className={styles.count}>{employees.length}</span></div>
          {employees.map((person) => <article className={styles.panel} key={person.id} style={{ marginTop: 16 }}>
            <h2>{person.full_name}</h2><p>{person.employee_id} · {person.role} · {person.work_location}</p>
            <h3>Maker-recorded screening checks</h3>
            <div className={styles.employeeList}>{person.screening_checks.map((check) => <div className={styles.employeeRow} key={check.check_type}>
              <div><strong>{check.source_name}</strong><span>{check.outcome.replaceAll("_", " ")}</span><small>Maker: {check.checked_by || "not recorded"} · {new Date(check.checked_at).toLocaleDateString()}</small>{check.source_url && <a href={check.source_url} target="_blank" rel="noreferrer">View source ↗</a>}{check.note && <small>{check.note}</small>}</div>
            </div>)}</div>
            <div className={styles.headerActions} style={{ marginTop: 14 }}>
              <button className={styles.primaryButton} disabled={busyId === person.id} onClick={() => void decide(person.id, person.full_name, "approve", "employee")}>{busyId === person.id ? "Saving…" : "Confirm checks & approve"}</button>
              <button className={styles.secondaryButton} disabled={busyId === person.id} onClick={() => void decide(person.id, person.full_name, "reject", "employee")}>Return for follow-up</button>
            </div>
          </article>)}
          {!employees.length && <p className={styles.empty}>No completed screening results await approval.</p>}
        </section>

        <section className={styles.panel} style={{ marginTop: 20 }}>
          <div className={styles.panelTitle}><div><p className={styles.eyebrow}>Exit maker-checker</p><h1>Pending exit requests</h1></div><span className={styles.count}>{exits.length}</span></div>
          {exits.map((item) => <article className={styles.employeeRow} key={item.id} style={{ marginTop: 12, cursor: "default" }}>
            <div><strong>{item.full_name}</strong><span>{item.employee_id} · {item.role}</span><small>Last working date: {item.last_working_date || "not set"}</small><small>Requested by: {item.exit_requested_by} · {item.exit_requested_at ? new Date(item.exit_requested_at).toLocaleString() : ""}</small></div>
            <div className={styles.headerActions}>
              <button className={styles.primaryButton} disabled={busyId === item.id} onClick={() => void decide(item.id, item.full_name, "approve", "exit")}>{busyId === item.id ? "Saving…" : "Approve exit"}</button>
              <button className={styles.secondaryButton} disabled={busyId === item.id} onClick={() => void decide(item.id, item.full_name, "reject", "exit")}>Return</button>
            </div>
          </article>)}
          {!exits.length && <p className={styles.empty}>No exit requests await approval.</p>}
        </section>
        <section className={styles.panel} style={{ marginTop: 20 }}>
          <div className={styles.panelTitle}><div><p className={styles.eyebrow}>Employment record correction</p><h1>Pending status corrections</h1></div><span className={styles.count}>{corrections.length}</span></div>
          {corrections.map((item) => <article className={styles.employeeRow} key={item.id} style={{ marginTop: 12, cursor: "default" }}>
            <div><strong>{item.full_name}</strong><span>{item.employee_id} · {item.role}</span><small>Requested by: {item.requested_by} · {item.requested_at ? new Date(item.requested_at).toLocaleString() : ""}</small><small>Reason: {item.reason}</small></div>
            <div className={styles.headerActions}>
              <button className={styles.primaryButton} disabled={busyId === item.id} onClick={() => void decide(item.id, item.full_name, "approve", "correction")}>{busyId === item.id ? "Saving…" : "Restore active status"}</button>
              <button className={styles.secondaryButton} disabled={busyId === item.id} onClick={() => void decide(item.id, item.full_name, "reject", "correction")}>Return</button>
            </div>
          </article>)}
          {!corrections.length && <p className={styles.empty}>No status corrections await approval.</p>}
        </section>
      </section>
    </main>
  );
}
