"use client";

import { useState } from "react";
import { api } from "./admin-utils";
import { Employee } from "./types";
import styles from "./admin.module.css";

const sources = [
  { id: "sg_un_sanctions", label: "Singapore / UN designated lists", url: "https://www.mas.gov.sg/regulation/anti-money-laundering/targeted-financial-sanctions/lists-of-designated-individuals-and-entities" },
  { id: "ofac", label: "US OFAC sanctions lists", url: "https://sanctionssearch.ofac.treas.gov/" },
  { id: "uk", label: "UK Sanctions List", url: "https://search-uk-sanctions-list.service.gov.uk/" },
  { id: "eu", label: "EU financial sanctions", url: "https://webgate.ec.europa.eu/fsd/fsf" },
  { id: "au", label: "Australia DFAT consolidated list", url: "https://www.dfat.gov.au/international-relations/security/sanctions/consolidated-list" },
  { id: "pep_media", label: "PEP / adverse media (record the source searched)", url: "" },
  { id: "criminal_fraud", label: "Criminal / fraud / conviction check (where lawful)", url: "" }
] as const;

type Outcome = "no_match" | "potential_match" | "unable_to_check" | "not_applicable";
type DraftCheck = { outcome: Outcome; note: string; sourceUrl: string };

export default function HrWorkflowPanel({ employees, onEmployeeUpdate }: { employees: Employee[]; onEmployeeUpdate: (employee: Employee) => void }) {
  const [drafts, setDrafts] = useState<Record<string, Record<string, DraftCheck>>>({});
  const [busyId, setBusyId] = useState("");
  const [message, setMessage] = useState("");

  const people = employees.filter((person) => person.status !== "exited");
  function valueFor(person: Employee, source: typeof sources[number]): DraftCheck {
    const saved = (person.screening_checks || []).find((check) => check.check_type === source.id);
    return drafts[person.id]?.[source.id] || {
      outcome: saved?.outcome || "unable_to_check",
      note: saved?.note || "",
      sourceUrl: saved?.source_url || source.url
    };
  }

  async function save(person: Employee) {
    if (!person.screening_consent) {
      setMessage("Record the employee screening consent for " + person.full_name + " before checks are entered.");
      return;
    }
    const checks = sources.map((source) => ({
      check_type: source.id,
      source_name: source.label,
      source_url: valueFor(person, source).sourceUrl,
      checked_at: new Date().toISOString(),
      outcome: valueFor(person, source).outcome,
      note: valueFor(person, source).note.trim()
    }));
    setBusyId(person.id);
    setMessage("");
    try {
      const result = await api<{ employee: Employee }>("/api/admin/screenings", {
        method: "POST",
        body: JSON.stringify({ id: person.id, checks })
      });
      onEmployeeUpdate(result.employee);
      setMessage(person.full_name + ": screening record saved as " + (result.employee.screening_status || "").replaceAll("_", " ") + ".");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save screening record.");
    } finally {
      setBusyId("");
    }
  }

  return (
    <section className={styles.panel}>
      <div className={styles.panelTitle}><div><p className={styles.eyebrow}>Manual checks · human decision</p><h1>Screening &amp; approval</h1></div><span className={styles.count}>{people.length}</span></div>
      <p className={styles.helper}>Open the official source, search the employee name and relevant identifiers there, then record the result here. Do not paste government ID numbers, identity documents, or sensitive case details into this HRMS. A possible match requires documented human review; it is not an automatic rejection.</p>
      {message && <div className={styles.banner}>{message}</div>}
      {people.map((person) => (
        <article key={person.id} className={styles.panel} style={{ marginTop: 18 }}>
          <div className={styles.panelTitle}><div><h2>{person.full_name}</h2><p>{person.employee_id} · {person.role} · {person.work_location || "Location not set"}</p></div><span>{person.workflow_stage?.replaceAll("_", " ") || (person.status === "active" ? "current employee · review due" : person.status)}</span></div>
          {!person.screening_consent && <p className={styles.notice}>Consent is not recorded. Update the employee profile after obtaining consent, then enter the checks.</p>}
          <div className={styles.formGrid}>
            {sources.map((source) => {
              const value = valueFor(person, source);
              return (
                <div key={source.id} className={styles.fullRow} style={{ borderTop: "1px solid #e2e7ef", paddingTop: 12 }}>
                  <strong>{source.label}</strong>
                  {source.url && <a href={source.url} target="_blank" rel="noreferrer">Open official search ↗</a>}
                  <label>Result
                    <select value={value.outcome} onChange={(e) => setDrafts((current) => ({ ...current, [person.id]: { ...current[person.id], [source.id]: { ...value, outcome: e.target.value as Outcome } } }))}>
                      <option value="no_match">Checked — no potential match</option>
                      <option value="potential_match">Potential match — hold for review</option>
                      <option value="unable_to_check">Unable to complete check</option>
                      <option value="not_applicable">Not applicable (explain why)</option>
                    </select>
                  </label>
                  <label>Source URL or reference<input value={value.sourceUrl} onChange={(e) => setDrafts((current) => ({ ...current, [person.id]: { ...current[person.id], [source.id]: { ...value, sourceUrl: e.target.value } } }))} placeholder="Official site / record reference" /></label>
                  <label>Reviewer note (no ID numbers or copies)<input value={value.note} onChange={(e) => setDrafts((current) => ({ ...current, [person.id]: { ...current[person.id], [source.id]: { ...value, note: e.target.value } } }))} placeholder="Short factual note; required for potential match / not applicable" /></label>
                </div>
              );
            })}
          </div>
          <div className={styles.fullRow} style={{ marginTop: 14 }}>
            <button className={styles.primaryButton} disabled={busyId === person.id || !person.screening_consent} onClick={() => void save(person)}>{busyId === person.id ? "Saving…" : "Save screening checks"}</button>
            <small>Approval becomes available only when every check is completed or marked not applicable with a reason, and no potential matches remain.</small>
          </div>
        </article>
      ))}
      {!people.length && <p className={styles.empty}>No current employees or pending hires.</p>}
    </section>
  );
}
