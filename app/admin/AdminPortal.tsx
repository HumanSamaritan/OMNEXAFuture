"use client";

import { FormEvent, useState } from "react";
import AdminDashboard from "./AdminDashboard";
import HrApprovalPortal from "./HrApprovalPortal";
import styles from "./admin.module.css";
import { api } from "./admin-utils";

export default function AdminPortal({ initialAdminEmail, initialRole }: { initialAdminEmail: string | null; initialRole: "admin" | "hr_approver" | null }) {
  const [adminEmail, setAdminEmail] = useState(initialAdminEmail);
  const [role, setRole] = useState(initialRole);
  const [loginEmail, setLoginEmail] = useState(initialAdminEmail || "");
  const [loginCode, setLoginCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function requestCode(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      await api("/api/admin/auth", {
        method: "POST",
        body: JSON.stringify({ action: "request", email: loginEmail })
      });
      setCodeSent(true);
      setMessage("A one-time login code was sent to your authorised email.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to send login code.");
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const result = await api<{ role: "admin" | "hr_approver" }>("/api/admin/auth", {
        method: "POST",
        body: JSON.stringify({ action: "verify", code: loginCode })
      });
      setAdminEmail(loginEmail.trim().toLowerCase());
      setRole(result.role);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to verify login code.");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await api("/api/admin/auth", { method: "POST", body: JSON.stringify({ action: "logout" }) }).catch(() => undefined);
    setAdminEmail(null);
    setRole(null);
    setCodeSent(false);
    setLoginCode("");
  }

  if (adminEmail && role === "hr_approver") return <HrApprovalPortal reviewer={adminEmail} onLogout={logout} />;
  if (adminEmail && role === "admin") return <AdminDashboard adminEmail={adminEmail} onLogout={logout} />;

  return (
    <main className={styles.loginPage}>
      <section className={styles.loginCard}>
        <div className={styles.loginBrand}>
          <img src="/omnexa-logo.png" alt="OMNeXa" />
          <div><strong>OMNeXa People &amp; HR</strong><span>Private employee lifecycle workspace</span></div>
        </div>
        <h1>Authorised HR access only</h1>
        <p>Employee records and HR documents are restricted to authorised administrators. The HR reviewer sees only the approval queue. This workspace is not part of the public website.</p>
        {!codeSent ? (
          <form onSubmit={requestCode} className={styles.stack}>
            <label>Authorised administrator or HR reviewer email<input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="name@omnexagoc.com" required /></label>
            <button className={styles.primaryButton} disabled={busy}>{busy ? "Sending…" : "Send one-time code"}</button>
          </form>
        ) : (
          <form onSubmit={verifyCode} className={styles.stack}>
            <label>6-digit login code<input inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={loginCode} onChange={(e) => setLoginCode(e.target.value.replace(/\D/g, ""))} placeholder="000000" required /></label>
            <button className={styles.primaryButton} disabled={busy}>{busy ? "Checking…" : "Sign in"}</button>
            <button type="button" className={styles.textButton} onClick={() => setCodeSent(false)}>Use a different email</button>
          </form>
        )}
        {message && <p className={styles.notice}>{message}</p>}
      </section>
    </main>
  );
}
