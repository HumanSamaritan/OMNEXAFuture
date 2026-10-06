"use client";

import { FormEvent, useState } from "react";
import AdminDashboard from "./AdminDashboard";
import styles from "./admin.module.css";
import { api } from "./admin-utils";

export default function AdminPortal({ initialAdminEmail }: { initialAdminEmail: string | null }) {
  const [adminEmail, setAdminEmail] = useState(initialAdminEmail);
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
      setMessage("A one-time login code was sent to your authorised OMNeXa email.");
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
      await api("/api/admin/auth", {
        method: "POST",
        body: JSON.stringify({ action: "verify", code: loginCode })
      });
      setAdminEmail(loginEmail.trim().toLowerCase());
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to verify login code.");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await api("/api/admin/auth", { method: "POST", body: JSON.stringify({ action: "logout" }) }).catch(() => undefined);
    setAdminEmail(null);
    setCodeSent(false);
    setLoginCode("");
  }

  if (adminEmail) {
    return <AdminDashboard adminEmail={adminEmail} onLogout={logout} />;
  }

  return (
    <main className={styles.loginPage}>
      <section className={styles.loginCard}>
        <div className={styles.loginBrand}>
          <img src="/omnexa-logo.png" alt="OMNeXa" />
          <div><strong>OMNeXa Admin</strong><span>Internal people and HR workspace</span></div>
        </div>
        <h1>Authorised access only</h1>
        <p>This route is intentionally not listed on the public website. Access is limited to approved OMNeXa administrator accounts.</p>
        {!codeSent ? (
          <form onSubmit={requestCode} className={styles.stack}>
            <label>OMNeXa login ID<input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="name@omnexagoc.com" required /></label>
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
