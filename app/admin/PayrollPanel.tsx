"use client";

import { useMemo, useState } from "react";
import { Employee } from "./types";
import styles from "./admin.module.css";

export default function PayrollPanel({ employees }: { employees: Employee[] }) {
  const [period, setPeriod] = useState(new Date().toISOString().slice(0, 7));
  const rows = employees.filter((person) => person.status === "active" && person.workflow_stage !== "screening_pending" && person.workflow_stage !== "approval_pending" && person.workflow_stage !== "review_required" && person.compensation_amount != null);
  const totals = useMemo(() => rows.reduce<Record<string, number>>((acc, person) => {
    const currency = person.compensation_currency || "SGD";
    acc[currency] = (acc[currency] || 0) + Number(person.compensation_amount || 0);
    return acc;
  }, {}), [rows]);

  function downloadCsv() {
    const lines = [
      ["Period", "Employee ID", "Employee", "Location", "Role", "Salary", "Currency", "Pay frequency"].join(","),
      ...rows.map((person) => [period, person.employee_id, person.full_name, person.work_location || "", person.role, String(person.compensation_amount ?? ""), person.compensation_currency || "SGD", person.pay_frequency || "monthly"].map((cell) => '"' + String(cell).replaceAll('"', '""') + '"').join(","))
    ];
    const blob = new Blob([lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "omnexa-payroll-register-" + period + ".csv";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return (
    <section className={styles.panel}>
      <div className={styles.panelTitle}><div><p className={styles.eyebrow}>Compensation · restricted</p><h1>Payroll register</h1></div><button className={styles.secondaryButton} onClick={downloadCsv} disabled={!rows.length}>Export CSV</button></div>
      <p className={styles.helper}>Preparation register only. It does not calculate tax, statutory contributions, overtime or bank payments. Review each employee under the applicable country rules and payroll provider before processing.</p>
      <label>Pay period<input type="month" value={period} onChange={(e) => setPeriod(e.target.value)} /></label>
      <div className={styles.employeeList}>
        {rows.map((person) => <div className={styles.employeeRow} key={person.id}>
          <div><strong>{person.full_name}</strong><span>{person.employee_id} · {person.role}</span><small>{person.work_location || "Location not set"} · {person.pay_frequency || "monthly"}</small></div>
          <strong>{person.compensation_currency || "SGD"} {Number(person.compensation_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
        </div>)}
        {!rows.length && <p className={styles.empty}>No approved employees have compensation recorded yet.</p>}
      </div>
      <div className={styles.panelTitle} style={{ marginTop: 20 }}><h2>Totals by currency</h2></div>
      <div className={styles.employeeList}>{Object.entries(totals).sort(([a],[b])=>a.localeCompare(b)).map(([currency, amount]) => <div className={styles.employeeRow} key={currency}><strong>{currency}</strong><strong>{amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></div>)}</div>
    </section>
  );
}
