"use client";

import { useState } from "react";
import styles from "./admin.module.css";
import { Employee, Tab } from "./types";
import { api, displayDate, escapeHtml, openLetter } from "./admin-utils";

export default function DocumentPanel({
  tab,
  employee,
  onEmployeeUpdate
}: {
  tab: Exclude<Tab, "employees" | "card">;
  employee: Employee;
  onEmployeeUpdate: (employee: Employee) => void;
}) {
  const [lastWorkingDate, setLastWorkingDate] = useState(employee.last_working_date || "");
  const [promotionRole, setPromotionRole] = useState("");
  const [promotionDate, setPromotionDate] = useState("");
  const [promotionComp, setPromotionComp] = useState("");
  const [promotionCurrency, setPromotionCurrency] = useState(employee.compensation_currency || "SGD");
  const [message, setMessage] = useState("");
  const [correctionReason, setCorrectionReason] = useState("");

  async function logDocument(type: "nda" | "offer" | "exit" | "service_certificate" | "promotion", data: Record<string, unknown>) {
    await api("/api/admin/documents", {
      method: "POST",
      body: JSON.stringify({ employee_ref: employee.id, document_type: type, document_data: data })
    }).catch(() => undefined);
  }

  async function patchEmployee(patch: Record<string, unknown>) {
    const data = await api<{ employee: Employee }>("/api/admin/employees", {
      method: "PATCH",
      body: JSON.stringify({ id: employee.id, ...patch })
    });
    onEmployeeUpdate(data.employee);
    return data.employee;
  }

  function nda() {
    const issued = new Intl.DateTimeFormat("en-SG", { day: "2-digit", month: "long", year: "numeric" }).format(new Date());
    openLetter("OMNeXa Confidentiality and Non-Disclosure Agreement", `
      <h1>Confidentiality and Non-Disclosure Agreement</h1>
      <div class="meta"><strong>Individual:</strong> ${escapeHtml(employee.full_name)} (${escapeHtml(employee.employee_id)})<br><strong>Role:</strong> ${escapeHtml(employee.role)}<br><strong>Date:</strong> ${escapeHtml(issued)}</div>
      <p>This agreement applies to non-public information received or created through work for OMNeXa Pte. Ltd. and, where relevant, its clients and partners.</p>
      <ol>
        <li>Confidential information includes OMNeXa or client ideas, plans, product concepts, designs, research, business information, personal data, credentials, prompts, models, algorithms, source code, repositories, datasets, documents and other non-public assets.</li>
        <li>Confidential information may be used only for authorised OMNeXa duties and must not be shared with any unauthorised person, organisation, personal account, external system or public AI/service.</li>
        <li>Code, data, files, credentials, designs and other assets must not be copied, removed, retained, reused or uploaded outside approved OMNeXa/client systems unless expressly authorised.</li>
        <li>Access credentials must remain private. Suspected loss, unauthorised access or disclosure must be reported promptly.</li>
        <li>On request or when the engagement ends, OMNeXa/client information and assets must be returned or securely deleted, subject to applicable retention requirements.</li>
        <li>Confidentiality obligations continue after the engagement ends for as long as the relevant information remains confidential or as required by contract or law.</li>
      </ol>
      <p class="muted">This standard OMNeXa template should be reviewed for the applicable jurisdiction before signature.</p>
      <div class="sign"><div><div class="line">For OMNeXa Pte. Ltd.<br>Authorised Signatory / Date</div></div><div><div class="line">${escapeHtml(employee.full_name)}<br>Signature / Date</div></div></div>
    `);
    void logDocument("nda", { issued, role: employee.role });
  }

  function offer() {
    const isIntern = employee.engagement_type === "intern";
    let pay = "Compensation is subject to the final signed terms.";
    if (isIntern && !employee.internship_paid) pay = "This internship is offered on an unpaid basis, subject to applicable law.";
    if (employee.compensation_amount) pay = `Compensation/stipend recorded: ${escapeHtml(employee.compensation_currency || "SGD")} ${escapeHtml(employee.compensation_amount)}.`;
    openLetter(`${isIntern ? "Internship" : "Employment"} Offer - ${employee.full_name}`, `
      <h1>${isIntern ? "Internship Offer Letter" : "Employment Offer Letter"}</h1>
      <p>Dear ${escapeHtml(employee.full_name)},</p>
      <p>We are pleased to offer you the role of <strong>${escapeHtml(employee.role)}</strong> with OMNeXa Pte. Ltd.</p>
      <div class="meta"><strong>ID:</strong> ${escapeHtml(employee.employee_id)}<br><strong>Start date:</strong> ${escapeHtml(displayDate(employee.start_date))}<br><strong>OMNeXa email:</strong> ${escapeHtml(employee.work_email)}</div>
      <p>${pay}</p>
      <p>Your work will be aligned with the role above and OMNeXa initiatives. You are expected to follow OMNeXa confidentiality, information-security, client-data and conduct requirements.</p>
      <p>Any statutory employment or internship terms, benefits, leave, notice, working-time requirements, probation and intellectual-property provisions remain subject to the final signed agreement and applicable law.</p>
      <div class="sign"><div><div class="line">For OMNeXa Pte. Ltd.<br>Authorised Signatory / Date</div></div><div><div class="line">Accepted by ${escapeHtml(employee.full_name)}<br>Signature / Date</div></div></div>
    `);
    void logDocument("offer", { role: employee.role, start_date: employee.start_date, engagement_type: employee.engagement_type, internship_paid: employee.internship_paid, compensation_amount: employee.compensation_amount });
  }

  async function exitLetter() {
    if (employee.status === "active") {
      if (!lastWorkingDate) {
        setMessage("Enter the proposed last working date first.");
        return;
      }
      try {
        const result = await api<{ employee: Employee }>("/api/admin/exits", {
          method: "POST",
          body: JSON.stringify({ id: employee.id, last_working_date: lastWorkingDate })
        });
        onEmployeeUpdate(result.employee);
        setMessage("Exit request submitted. The employee remains active until a different HR approver approves it.");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to submit the exit request.");
      }
      return;
    }

    if (employee.status !== "exited" || employee.exit_request_status !== "approved") {
      setMessage("An approved exit record is required before generating an exit letter.");
      return;
    }
    const effectiveDate = employee.last_working_date || lastWorkingDate;
    openLetter(`Exit Letter - ${employee.full_name}`, `
      <h1>Resignation Acceptance / Exit Confirmation</h1>
      <p>Dear ${escapeHtml(employee.full_name)},</p>
      <p>This confirms acceptance of your resignation from the role of <strong>${escapeHtml(employee.role)}</strong> with OMNeXa Pte. Ltd.</p>
      <div class="meta"><strong>ID:</strong> ${escapeHtml(employee.employee_id)}<br><strong>Joining date:</strong> ${escapeHtml(displayDate(employee.start_date))}<br><strong>Last working date:</strong> ${escapeHtml(displayDate(effectiveDate))}</div>
      <p>Please complete the agreed handover and return or securely delete OMNeXa/client assets, credentials, data and confidential material. Continuing confidentiality and information-security obligations remain applicable after exit.</p>
      <p>We thank you for your contribution and wish you well.</p>
      <div class="sign"><div><div class="line">For OMNeXa Pte. Ltd.<br>Authorised Signatory / Date</div></div><div></div></div>
    `);
    await logDocument("exit", { last_working_date: effectiveDate, role: employee.role });
    setMessage("Approved exit letter generated.");
  }

  async function requestStatusCorrection() {
    if (!correctionReason.trim()) {
      setMessage("Enter why this exited status should be corrected.");
      return;
    }
    try {
      const result = await api<{ employee: Employee }>("/api/admin/status-corrections", {
        method: "POST",
        body: JSON.stringify({ id: employee.id, reason: correctionReason.trim() })
      });
      onEmployeeUpdate(result.employee);
      setMessage("Status correction submitted. A different HR approver must confirm it before the record becomes active.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to submit the status correction.");
    }
  }

  function serviceCertificate() {
    openLetter(`Service Certificate - ${employee.full_name}`, `
      <h1>Service Certificate</h1>
      <p>To Whom It May Concern,</p>
      <p>This is to certify that <strong>${escapeHtml(employee.full_name)}</strong> (${escapeHtml(employee.employee_id)}) was associated with OMNeXa Pte. Ltd. as <strong>${escapeHtml(employee.role)}</strong>.</p>
      <div class="meta"><strong>Start date:</strong> ${escapeHtml(displayDate(employee.start_date))}<br><strong>Last working date:</strong> ${escapeHtml(displayDate(employee.last_working_date || lastWorkingDate))}</div>
      <p>This certificate is issued as a factual confirmation of service.</p>
      <div class="sign"><div><div class="line">For OMNeXa Pte. Ltd.<br>Authorised Signatory / Date</div></div><div></div></div>
    `);
    void logDocument("service_certificate", { start_date: employee.start_date, last_working_date: employee.last_working_date || lastWorkingDate, role: employee.role });
  }

  async function promotion() {
    if (!promotionRole || !promotionDate) {
      setMessage("Enter the new role and effective date.");
      return;
    }
    openLetter(`Promotion Letter - ${employee.full_name}`, `
      <h1>Promotion Letter</h1>
      <p>Dear ${escapeHtml(employee.full_name)},</p>
      <p>We are pleased to confirm your promotion from <strong>${escapeHtml(employee.role)}</strong> to <strong>${escapeHtml(promotionRole)}</strong>, effective <strong>${escapeHtml(displayDate(promotionDate))}</strong>.</p>
      <div class="meta"><strong>Employee ID:</strong> ${escapeHtml(employee.employee_id)}${promotionComp ? `<br><strong>Revised compensation:</strong> ${escapeHtml(promotionCurrency)} ${escapeHtml(promotionComp)}` : ""}</div>
      <p>All other applicable terms remain unchanged unless separately confirmed in writing.</p>
      <p>Congratulations, and thank you for your continued contribution to OMNeXa.</p>
      <div class="sign"><div><div class="line">For OMNeXa Pte. Ltd.<br>Authorised Signatory / Date</div></div><div><div class="line">Acknowledged by ${escapeHtml(employee.full_name)}<br>Signature / Date</div></div></div>
    `);
    const patch: Record<string, unknown> = { role: promotionRole };
    if (promotionComp) {
      patch.compensation_amount = Number(promotionComp);
      patch.compensation_currency = promotionCurrency;
    }
    await patchEmployee(patch);
    await logDocument("promotion", { previous_role: employee.role, new_role: promotionRole, effective_date: promotionDate, compensation_amount: promotionComp || null, compensation_currency: promotionCurrency });
    setMessage("Promotion letter generated and master role updated.");
  }

  if (tab === "nda") return <section className={styles.documentPanel}><p className={styles.eyebrow}>Confidentiality</p><h1>OMNeXa NDA</h1><p>Standard NDA covering OMNeXa ideas, code, data, assets, client information and sensitive information.</p><div className={styles.warning}>Legal template: review jurisdiction-specific requirements before signature.</div><button className={styles.primaryButton} onClick={nda}>Generate NDA / Save as PDF</button></section>;

  if (tab === "offer") return <section className={styles.documentPanel}><p className={styles.eyebrow}>Onboarding</p><h1>{employee.engagement_type === "intern" ? "Internship offer letter" : "Employment offer letter"}</h1><div className={styles.summaryGrid}><div><span>Role</span><strong>{employee.role}</strong></div><div><span>Start</span><strong>{displayDate(employee.start_date)}</strong></div><div><span>Type</span><strong>{employee.engagement_type === "intern" ? employee.internship_paid ? "Paid internship" : "Unpaid internship" : "Employment"}</strong></div><div><span>Compensation</span><strong>{employee.compensation_amount ? `${employee.compensation_currency || "SGD"} ${employee.compensation_amount}` : "Not entered"}</strong></div></div><div className={styles.warning}>Review statutory terms for the employee/intern's jurisdiction before issue.</div><button className={styles.primaryButton} onClick={offer}>Generate offer / Save as PDF</button></section>;

  if (tab === "exit") return <section className={styles.documentPanel}>
    <p className={styles.eyebrow}>Offboarding · maker-checker</p>
    <h1>{employee.status === "exited" ? "Exit record" : "Submit exit request"}</h1>
    {employee.status === "active" && <>
      {employee.exit_request_status === "pending" ? <div className={styles.notice}>Exit request is awaiting approval from a different HR reviewer. The employee remains active until approval.</div> : <>
        <label className={styles.singleField}>Proposed last working date<input type="date" value={lastWorkingDate} onChange={(e) => setLastWorkingDate(e.target.value)} /></label>
        {employee.exit_request_status === "returned" && <div className={styles.notice}>The previous request was returned. Review the dates and resubmit if needed.</div>}
        <button className={styles.primaryButton} onClick={() => void exitLetter()}>Submit exit request for approval</button>
      </>}
    </>}
    {employee.status === "exited" && employee.exit_request_status === "approved" && <>
      <div className={styles.notice}>Exit approved by {employee.exit_reviewed_by || "HR reviewer"} on {displayDate(employee.exit_reviewed_at)}.</div>
      {message && <div className={styles.banner}>{message}</div>}
      <div className={styles.buttonRow}><button className={styles.primaryButton} onClick={() => void exitLetter()}>Generate approved exit letter</button><button className={styles.secondaryButton} onClick={serviceCertificate}>Generate service certificate</button></div>
    </>}
    {employee.status === "exited" && employee.exit_request_status !== "approved" && <>
      <div className={styles.notice}>This employee is marked exited without an approved exit request. Submit a status correction for a different HR approver to review.</div>
      {employee.status_correction_status === "pending" ? <p>Status correction is awaiting a different HR approver.</p> : <>
        <label className={styles.singleField}>Correction reason<input value={correctionReason} onChange={(e) => setCorrectionReason(e.target.value)} placeholder="Explain why the exited status is incorrect" /></label>
        <button className={styles.primaryButton} onClick={() => void requestStatusCorrection()}>Request correction to active</button>
      </>}
    </>}
    {message && employee.status !== "exited" && <div className={styles.banner}>{message}</div>}
  </section>;

  return <section className={styles.documentPanel}><p className={styles.eyebrow}>Role change</p><h1>Promotion letter</h1><div className={styles.formGrid}><label>Current role<input value={employee.role} readOnly /></label><label>New role<input value={promotionRole} onChange={(e) => setPromotionRole(e.target.value)} /></label><label>Effective date<input type="date" value={promotionDate} onChange={(e) => setPromotionDate(e.target.value)} /></label><label>Revised compensation <span className={styles.muted}>(optional)</span><input type="number" min="0" step="0.01" value={promotionComp} onChange={(e) => setPromotionComp(e.target.value)} /></label><label>Currency<input value={promotionCurrency} onChange={(e) => setPromotionCurrency(e.target.value.toUpperCase())} /></label></div>{message && <div className={styles.banner}>{message}</div>}<button className={styles.primaryButton} onClick={() => void promotion()}>Generate promotion letter & update role</button></section>;
}
