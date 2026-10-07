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

export default function HrApprovalPortal({ reviewer, onLogout }: { reviewer: string; onLogout: () => void }) {
  const [employees, setEmployees] = useState<ReviewPerson[]>([]);
  const [busyId, setBusyId] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    try {
      const data = await api<{ employees: ReviewPerson[] }>("/api/admin/approvals", { method: "GET" });
      setEmployees(data.employees || []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load approvals.");
    }
  }

  useEffect(() => { void load(); }, []);

  async function decide(person: ReviewPerson, decision: "approve" | "reject") {
    const note = decision === "reject" ? window.prompt("Reason to return this profile for follow-up?") : "";
    if (decision === "reject" && !note?.trim()) return;
    setBusyId(person.id);
    setMessage("");
    try {
      await api("/api/admin/approvals", { method: "POST", body: JSON.stringify({ id: person.id, decision, note }) });
      setEmployees((current) => current.filter((item) => item.id !== person.id));
      setMessage(person.full_name + (decision === "approve" ? " approved. HR onboarding can now proceed." : " returned for follow-up."));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save the decision.");
    } finally {
      setBusyId("");
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.adminHeader}>
        <div className={styles.headerBrand}><img src="/omnexa-logo.png" alt="OMNeXa" /><div><strong>OMNeXa HR review</strong><span>Screening disposition and employee approval</span></div></div>
        <div className={styles.headerActions}><span>{reviewer}</span><button className={styles.secondaryButton} onClick={onLogout}>Sign out</button></div>
      </header>
      <section className={styles.shell}>
        <div className={styles.privateNotice}>Reviewer-only access. This queue shows profiles with completed manual checks and no potential matches recorded.</div>
        {message && <div className={styles.banner}>{message}</div>}
        <section className={styles.panel}>
          <div className={styles.panelTitle}><div><p className={styles.eyebrow}>Pending HR decision</p><h1>Employee approval queue</h1></div><span className={styles.count}>{employees.length}</span></div>
          {employees.map((person) => <article className={styles.panel} key={person.id} style={{ marginTop: 16 }}>
            <h2>{person.full_name}</h2><p>{person.employee_id} · {person.role} · {person.work_location}</p>
            <h3>Recorded screening checks</h3>
            <div className={styles.employeeList}>{person.screening_checks.map((check) => <div className={styles.employeeRow} key={check.check_type}>
              <div><strong>{check.source_name}</strong><span>{check.outcome.replaceAll("_", " ")}</span><small>{check.checked_by || ""} · {new Date(check.checked_at).toLocaleDateString()}</small>{check.source_url && <a href={check.source_url} target="_blank" rel="noreferrer">View source ↗</a>}{check.note && <small>{check.note}</small>}</div>
            </div>)}</div>
            <div className={styles.headerActions} style={{ marginTop: 14 }}>
              <button className={styles.primaryButton} disabled={busyId === person.id} onClick={() => void decide(person, "approve")}>{busyId === person.id ? "Saving…" : "Approve employee"}</button>
              <button className={styles.secondaryButton} disabled={busyId === person.id} onClick={() => void decide(person, "reject")}>Return for follow-up</button>
            </div>
          </article>)}
          {!employees.length && <p className={styles.empty}>No profiles await HR approval.</p>}
        </section>
      </section>
    </main>
  );
}
