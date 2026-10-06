export type EmployeeRecord = {
  id: string;
  employee_id: string;
  full_name: string;
  work_email: string;
  personal_email?: string | null;
  linkedin_url?: string | null;
  whatsapp_number?: string | null;
  phone_number?: string | null;
  role: string;
  engagement_type: "employee" | "intern";
  internship_paid: boolean;
  compensation_amount?: number | null;
  compensation_currency?: string | null;
  start_date?: string | null;
  last_working_date?: string | null;
  status: "active" | "exited";
  workspace_account_status: "pending" | "created" | "manual";
  created_at: string;
  updated_at: string;
};

function config() {
  const url = process.env.HR_SUPABASE_URL;
  const key = process.env.HR_SUPABASE_PUBLISHABLE_KEY;
  const adminSecret = process.env.HR_DB_SECRET;
  if (!url || !key || !adminSecret) {
    throw new Error("HR data store is not configured.");
  }
  return { url: url.replace(/\/$/, ""), key, adminSecret };
}

async function dbRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { url, key, adminSecret } = config();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "x-omnexa-admin-secret": adminSecret,
      ...(init.headers || {})
    }
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`HR store error ${response.status}: ${detail.slice(0, 400)}`);
  }

  if (response.status === 204) return undefined as T;
  const text = await response.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

export async function listEmployees(): Promise<EmployeeRecord[]> {
  return dbRequest<EmployeeRecord[]>(
    "omnexa_hr_employees?select=*&order=created_at.desc",
    { method: "GET" }
  );
}

export async function createEmployee(input: Partial<EmployeeRecord>): Promise<EmployeeRecord> {
  const rows = await dbRequest<EmployeeRecord[]>("omnexa_hr_employees", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(input)
  });
  if (!rows?.[0]) throw new Error("Employee record was not created.");
  return rows[0];
}

export async function updateEmployee(id: string, input: Partial<EmployeeRecord>): Promise<EmployeeRecord> {
  const rows = await dbRequest<EmployeeRecord[]>(`omnexa_hr_employees?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(input)
  });
  if (!rows?.[0]) throw new Error("Employee record was not updated.");
  return rows[0];
}

export async function logDocument(
  employeeRef: string,
  documentType: "nda" | "offer" | "exit" | "service_certificate" | "promotion",
  documentData: Record<string, unknown>,
  generatedBy: string
): Promise<void> {
  await dbRequest("omnexa_hr_documents", {
    method: "POST",
    body: JSON.stringify({
      employee_ref: employeeRef,
      document_type: documentType,
      document_data: documentData,
      generated_by: generatedBy
    })
  });
}
