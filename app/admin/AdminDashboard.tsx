"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import CardPanel from "./CardPanel";
import DocumentPanel from "./DocumentPanel";
import styles from "./admin.module.css";
import { api, suggestEmail } from "./admin-utils";
import { blankEmployee, Employee, EmployeeForm, Tab } from "./types";

const tabs: { id: Tab; label: string }[] = [
  { id: "employees", label: "Employees & Email" },
  { id: "card", label: "Visiting Card" },
  { id: "nda", label: "NDA" },
  { id: "offer", label: "Offer Letter" },
  { id: "exit", label: "Exit & Service" },
  { id: "promotion", label: "Promotion" }
];

export default function AdminDashboard({ adminEmail, onLogout }: { adminEmail: string; onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("employees");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [form, setForm] = useState<EmployeeForm>(blankEmployee);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [workspaceResult, setWorkspaceResult] = useState<{ email: string; password: string } | null>(null);

  const selected = useMemo(
    () => employees.find((employee) => employee.id === selectedId) || null,
    [employees, selectedId]
  );

  useEffect(() => {
    void loadEmployees();
  }, []);

  async function loadEmployees() {
    try {
      const data = await api<{ employees: Employee[] }>("/api/admin/employees", { method: "GET" });
      setEmployees(data.employees || []);
      setSelectedId((current) => current || data.employees?.[0]?.id || "");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load employee records.");
    }
  }

  async function createEmployeeRecord(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setWorkspaceResult(null);
    try {
      const data = await api<{ employee: Employee }>("/api/admin/employees", {
        method: "POST",
        body: JSON.stringify(form)
      });
      setEmployees((items) => [data.employee, ...items]);
      setSelectedId(data.employee.id);
      setForm(blankEmployee);
      setMessage(`${data.employee.full_name} was added. You can now create the OMNeXa email account, visiting card and HR documents.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to create employee record.");
    } finally {
      setBusy(false);
    }
  }

  async function provisionWorkspace(employee: Employee) {
    setBusy(true);
    setMessage("");
    setWorkspaceResult(null);
    try {
      const data = await api<{ workEmail: string; temporaryPassword: string }>("/api/admin/workspace", {
        method: "POST",
        body: JSON.stringify({ id: employee.id, full_name: employee.full_name, work_email: employee.work_email })
      });
      setWorkspaceResult({ email: data.workEmail, password: data.temporaryPassword });
      setEmployees((items) => items.map((item) => item.id === employee.id ? { ...item, workspace_account_status: "created" } : item));
      setMessage("Google Workspace account created. Copy the temporary password now and share it securely with the employee.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to create Google Workspace account.");
    } finally {
      setBusy(false);
    }
  }

  function updateEmployeeInState(employee: Employee) {
    setEmployees((items) => items.map((item) => (item.id === employee.id ? employee : item)));
  }

  function updateName(value: string) {
    setForm((current) => ({
      ...current,
      full_name: value,
      work_email:
        !current.work_email || current.work_email === suggestEmail(current.full_name)
          ? suggestEmail(value)
          : current.work_email
    }));
  }

  return (
    <main className={styles.page}>
      <header className={styles.adminHeader}>
        <div className={styles.headerBrand}>
          <img src="/omnexa-logo.png" alt="OMNeXa" />
          <div><strong>OMNeXa Admin</strong><span>People · Identity · HR documents</span></div>
        </div>
        <div className={styles.headerActions}><span>{adminEmail}</span><button className={styles.secondaryButton} onClick={onLogout}>Sign out</button></div>
      </header>

      <section className={styles.shell}>
        <div className={styles.privateNotice}><strong>Internal only.</strong> This route is not displayed in the public OMNeXa navigation and is restricted to authorised admin IDs.</div>

        <nav className={styles.tabs} aria-label="OMNeXa admin sections">
          {tabs.map((item) => (
            <button key={item.id} className={tab === item.id ? styles.activeTab : ""} onClick={() => { setTab(item.id); setMessage(""); }}>
              {item.label}
            </button>
          ))}
        </nav>

        {message && <div className={styles.banner}>{message}</div>}

        {tab === "employees" && (
          <div className={styles.twoColumn}>
            <section className={styles.panel}>
              <div className={styles.panelTitle}><div><p className={styles.eyebrow}>Employee master</p><h1>Add employee or intern</h1></div></div>
              <form className={styles.formGrid} onSubmit={createEmployeeRecord}>
                <label>Full legal name<input required value={form.full_name} onChange={(e) => updateName(e.target.value)} /></label>
                <label>Employee ID <span className={styles.muted}>(optional)</span><input value={form.employee_id} onChange={(e) => setForm((current) => ({ ...current, employee_id: e.target.value }))} placeholder="Auto-generated if blank" /></label>
                <label>OMNeXa email<input required type="email" value={form.work_email} onChange={(e) => setForm((current) => ({ ...current, work_email: e.target.value }))} placeholder="firstname.lastname@omnexagoc.com" /></label>
                <label>Personal email <span className={styles.muted}>(optional)</span><input type="email" value={form.personal_email} onChange={(e) => setForm((current) => ({ ...current, personal_email: e.target.value }))} /></label>
                <label>Role in OMNeXa<input required value={form.role} onChange={(e) => setForm((current) => ({ ...current, role: e.target.value }))} placeholder="e.g. Product Intern, Director" /></label>
                <label>Start date<input type="date" value={form.start_date} onChange={(e) => setForm((current) => ({ ...current, start_date: e.target.value }))} /></label>
                <label>LinkedIn path<input value={form.linkedin_url} onChange={(e) => setForm((current) => ({ ...current, linkedin_url: e.target.value }))} placeholder="https://www.linkedin.com/in/..." /></label>
                <label>WhatsApp number<input value={form.whatsapp_number} onChange={(e) => setForm((current) => ({ ...current, whatsapp_number: e.target.value }))} placeholder="+65 ..." /></label>
                <label>Phone number<input value={form.phone_number} onChange={(e) => setForm((current) => ({ ...current, phone_number: e.target.value }))} placeholder="+65 ..." /></label>
                <label>Engagement<select value={form.engagement_type} onChange={(e) => setForm((current) => ({ ...current, engagement_type: e.target.value as "employee" | "intern" }))}><option value="employee">Employee</option><option value="intern">Intern</option></select></label>
                {form.engagement_type === "intern" && <label className={styles.checkboxLabel}><input type="checkbox" checked={form.internship_paid} onChange={(e) => setForm((current) => ({ ...current, internship_paid: e.target.checked }))} />Paid internship</label>}
                {(form.engagement_type === "employee" || form.internship_paid) && <><label>Compensation / stipend <span className={styles.muted}>(optional)</span><input type="number" min="0" step="0.01" value={form.compensation_amount} onChange={(e) => setForm((current) => ({ ...current, compensation_amount: e.target.value }))} /></label><label>Currency<input value={form.compensation_currency} onChange={(e) => setForm((current) => ({ ...current, compensation_currency: e.target.value.toUpperCase() }))} /></label></>}
                <div className={styles.fullRow}><button className={styles.primaryButton} disabled={busy}>{busy ? "Creating…" : "Create employee record"}</button></div>
              </form>
            </section>

            <section className={styles.panel}>
              <div className={styles.panelTitle}><div><p className={styles.eyebrow}>Directory</p><h2>OMNeXa people</h2></div><span className={styles.count}>{employees.length}</span></div>
              <div className={styles.employeeList}>
                {employees.map((employee) => (
                  <button type="button" key={employee.id} className={`${styles.employeeRow} ${selectedId === employee.id ? styles.selectedRow : ""}`} onClick={() => { setSelectedId(employee.id); setWorkspaceResult(null); }}>
                    <div><strong>{employee.full_name}</strong><span>{employee.role}</span><small>{employee.employee_id} · {employee.work_email}</small></div>
                    <div className={styles.statusGroup}><span className={employee.status === "active" ? styles.statusActive : styles.statusExited}>{employee.status}</span><span>{employee.workspace_account_status === "created" ? "Google ✓" : "Google pending"}</span></div>
                  </button>
                ))}
                {!employees.length && <p className={styles.empty}>No employee records yet.</p>}
              </div>

              {selected && (
                <div className={styles.workspaceBox}>
                  <h3>Google Workspace email account</h3>
                  <p>{selected.work_email}</p>
                  <button className={styles.secondaryButton} disabled={busy || selected.workspace_account_status === "created"} onClick={() => void provisionWorkspace(selected)}>{selected.workspace_account_status === "created" ? "Account created" : busy ? "Creating…" : "Create Google account"}</button>
                  <small>Requires one-time Google Workspace Admin API setup. The account is created with a temporary password that must be changed at first sign-in.</small>
                  {workspaceResult && workspaceResult.email === selected.work_email && <div className={styles.passwordBox}><strong>Temporary password — displayed once</strong><code>{workspaceResult.password}</code><small>Copy it now and share through a secure channel.</small></div>}
                </div>
              )}
            </section>
          </div>
        )}

        {tab !== "employees" && (
          <section className={styles.selectorBar}>
            <label>Employee<select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}><option value="">Select employee</option>{employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.full_name} — {employee.role}</option>)}</select></label>
            {selected && <div><strong>{selected.employee_id}</strong><span>{selected.work_email}</span></div>}
          </section>
        )}

        {tab === "card" && selected && <CardPanel employee={selected} />}
        {(tab === "nda" || tab === "offer" || tab === "exit" || tab === "promotion") && selected && <DocumentPanel tab={tab} employee={selected} onEmployeeUpdate={updateEmployeeInState} />}
        {tab !== "employees" && !selected && <section className={styles.emptyPanel}>Create or select an employee first.</section>}
      </section>
    </main>
  );
}
