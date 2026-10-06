import type { EmployeeRecord, HrDocumentRecord } from "./hr-store";

function config() {
  const url = process.env.HR_SUPABASE_URL;
  const key = process.env.HR_SUPABASE_PUBLISHABLE_KEY;
  const adminSecret = process.env.HR_DB_SECRET;
  if (!url || !key || !adminSecret) return null;
  return { url: url.replace(/\/$/, ""), key, adminSecret };
}

export function hasSupabaseHrArchive(): boolean {
  return Boolean(config());
}

async function dbRequest<T>(path: string): Promise<T> {
  const settings = config();
  if (!settings) throw new Error("Supabase HR archive is not configured.");
  const response = await fetch(`${settings.url}/rest/v1/${path}`, {
    method: "GET",
    cache: "no-store",
    headers: {
      apikey: settings.key,
      "Content-Type": "application/json",
      "x-omnexa-admin-secret": settings.adminSecret
    }
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase HR archive error ${response.status}: ${detail.slice(0, 400)}`);
  }

  return (await response.json()) as T;
}

export async function listSupabaseEmployees(): Promise<EmployeeRecord[]> {
  return dbRequest<EmployeeRecord[]>("omnexa_hr_employees?select=*&order=created_at.asc");
}

export async function listSupabaseDocuments(): Promise<HrDocumentRecord[]> {
  return dbRequest<HrDocumentRecord[]>("omnexa_hr_documents?select=*&order=generated_at.asc");
}
