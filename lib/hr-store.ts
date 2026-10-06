import crypto from "node:crypto";

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

export type HrDocumentRecord = {
  id: string;
  employee_ref: string;
  document_type: "nda" | "offer" | "exit" | "service_certificate" | "promotion";
  document_data: Record<string, unknown>;
  generated_by: string;
  generated_at: string;
};

type FirestoreValue =
  | { nullValue: null }
  | { stringValue: string }
  | { booleanValue: boolean }
  | { integerValue: string }
  | { doubleValue: number }
  | { arrayValue: { values?: FirestoreValue[] } }
  | { mapValue: { fields?: Record<string, FirestoreValue> } };

type FirestoreDocument = {
  name?: string;
  fields?: Record<string, FirestoreValue>;
};

const EMPLOYEE_COLLECTION = "omnexa_hr_employees";
const DOCUMENT_COLLECTION = "omnexa_hr_documents";
const META_COLLECTION = "omnexa_hr_meta";
const MIGRATION_DOCUMENT = "supabase_to_firestore_v1";

function firebaseConfig() {
  const projectId = process.env.FIREBASE_HR_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_HR_CLIENT_EMAIL?.trim();
  const privateKey = process.env.FIREBASE_HR_PRIVATE_KEY?.replace(/\\n/g, "\n").trim();
  const databaseId = process.env.FIREBASE_HR_DATABASE_ID?.trim() || "(default)";

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "OMNeXa HR Firestore is not configured. FIREBASE_HR_PROJECT_ID, FIREBASE_HR_CLIENT_EMAIL and FIREBASE_HR_PRIVATE_KEY are required."
    );
  }

  return { projectId, clientEmail, privateKey, databaseId };
}

function base64url(input: string | Buffer): string {
  return Buffer.from(input).toString("base64url");
}

let tokenCache: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) return tokenCache.token;

  const { clientEmail, privateKey } = firebaseConfig();
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64url(
    JSON.stringify({
      iss: clientEmail,
      scope: "https://www.googleapis.com/auth/datastore",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600
    })
  );
  const signingInput = `${header}.${payload}`;
  const signature = crypto
    .sign("RSA-SHA256", Buffer.from(signingInput), privateKey)
    .toString("base64url");

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${signingInput}.${signature}`
    })
  });
  const data = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
    error_description?: string;
  };

  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || "Unable to authorise OMNeXa HR Firestore service account.");
  }

  tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + Math.max(300, data.expires_in || 3600) * 1000
  };
  return data.access_token;
}

function firestoreBaseUrl(): string {
  const { projectId, databaseId } = firebaseConfig();
  return `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/${encodeURIComponent(databaseId)}/documents`;
}

function encodeValue(value: unknown): FirestoreValue {
  if (value === null) return { nullValue: null };
  if (typeof value === "string") return { stringValue: value };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") {
    return Number.isInteger(value)
      ? { integerValue: String(value) }
      : { doubleValue: value };
  }
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(encodeValue) } };
  }
  if (typeof value === "object" && value) {
    return { mapValue: { fields: encodeFields(value as Record<string, unknown>) } };
  }
  return { stringValue: String(value ?? "") };
}

function encodeFields(record: Record<string, unknown>): Record<string, FirestoreValue> {
  return Object.fromEntries(
    Object.entries(record)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [key, encodeValue(value)])
  );
}

function decodeValue(value: FirestoreValue): unknown {
  if ("nullValue" in value) return null;
  if ("stringValue" in value) return value.stringValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return value.doubleValue;
  if ("arrayValue" in value) return (value.arrayValue.values || []).map(decodeValue);
  if ("mapValue" in value) return decodeFields(value.mapValue.fields || {});
  return null;
}

function decodeFields(fields: Record<string, FirestoreValue>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, decodeValue(value)]));
}

async function firestoreRequest<T>(url: string, init: RequestInit = {}): Promise<T> {
  const accessToken = await getAccessToken();
  const response = await fetch(url, {
    ...init,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(init.headers || {})
    }
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Firestore HR error ${response.status}: ${detail.slice(0, 500)}`);
  }

  if (response.status === 204) return undefined as T;
  const text = await response.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

async function readDocument<T extends Record<string, unknown>>(
  collection: string,
  id: string
): Promise<T | null> {
  const accessToken = await getAccessToken();
  const response = await fetch(
    `${firestoreBaseUrl()}/${encodeURIComponent(collection)}/${encodeURIComponent(id)}`,
    {
      method: "GET",
      cache: "no-store",
      headers: { Authorization: `Bearer ${accessToken}` }
    }
  );

  if (response.status === 404) return null;
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Firestore HR error ${response.status}: ${detail.slice(0, 500)}`);
  }

  const document = (await response.json()) as FirestoreDocument;
  return decodeFields(document.fields || {}) as T;
}

async function listCollection<T extends Record<string, unknown>>(collection: string): Promise<T[]> {
  const rows: T[] = [];
  let pageToken = "";

  do {
    const params = new URLSearchParams({ pageSize: "1000" });
    if (pageToken) params.set("pageToken", pageToken);
    const data = await firestoreRequest<{
      documents?: FirestoreDocument[];
      nextPageToken?: string;
    }>(`${firestoreBaseUrl()}/${encodeURIComponent(collection)}?${params.toString()}`, {
      method: "GET"
    });

    for (const document of data.documents || []) {
      const decoded = decodeFields(document.fields || {}) as T;
      if (!("id" in decoded) && document.name) {
        (decoded as Record<string, unknown>).id = decodeURIComponent(document.name.split("/").pop() || "");
      }
      rows.push(decoded);
    }
    pageToken = data.nextPageToken || "";
  } while (pageToken);

  return rows;
}

async function writeDocument(
  collection: string,
  id: string,
  record: Record<string, unknown>
): Promise<void> {
  await firestoreRequest(
    `${firestoreBaseUrl()}/${encodeURIComponent(collection)}/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: JSON.stringify({ fields: encodeFields(record) })
    }
  );
}

let migrationPromise: Promise<void> | null = null;

async function migrateFromSupabaseOnce(): Promise<void> {
  const marker = await readDocument<Record<string, unknown>>(META_COLLECTION, MIGRATION_DOCUMENT);
  if (marker) return;

  const existingEmployees = await listCollection<EmployeeRecord>(EMPLOYEE_COLLECTION);
  const existingDocuments = await listCollection<HrDocumentRecord>(DOCUMENT_COLLECTION);
  if (existingEmployees.length || existingDocuments.length) {
    throw new Error(
      "OMNeXa HR Firestore already contains data but has no migration marker. Migration stopped to prevent a merge conflict."
    );
  }

  const { hasSupabaseHrArchive, listSupabaseDocuments, listSupabaseEmployees } = await import(
    "./hr-supabase-backup"
  );

  if (!hasSupabaseHrArchive()) {
    await writeDocument(META_COLLECTION, MIGRATION_DOCUMENT, {
      id: MIGRATION_DOCUMENT,
      source: "fresh-firestore",
      employees_migrated: 0,
      documents_migrated: 0,
      migrated_at: new Date().toISOString()
    });
    return;
  }

  const [employees, documents] = await Promise.all([
    listSupabaseEmployees(),
    listSupabaseDocuments()
  ]);

  for (const employee of employees) {
    await writeDocument(EMPLOYEE_COLLECTION, employee.id, employee as unknown as Record<string, unknown>);
  }
  for (const document of documents) {
    await writeDocument(DOCUMENT_COLLECTION, document.id, document as unknown as Record<string, unknown>);
  }

  const [verifiedEmployees, verifiedDocuments] = await Promise.all([
    listCollection<EmployeeRecord>(EMPLOYEE_COLLECTION),
    listCollection<HrDocumentRecord>(DOCUMENT_COLLECTION)
  ]);

  const employeeIds = new Set(verifiedEmployees.map((row) => row.id));
  const documentIds = new Set(verifiedDocuments.map((row) => row.id));
  const employeeMismatch = employees.some((row) => !employeeIds.has(row.id));
  const documentMismatch = documents.some((row) => !documentIds.has(row.id));

  if (
    verifiedEmployees.length !== employees.length ||
    verifiedDocuments.length !== documents.length ||
    employeeMismatch ||
    documentMismatch
  ) {
    throw new Error("OMNeXa HR migration verification failed. Supabase remains unchanged; Firestore cutover was not completed.");
  }

  await writeDocument(META_COLLECTION, MIGRATION_DOCUMENT, {
    id: MIGRATION_DOCUMENT,
    source: "FuturePlus Supabase archive",
    employees_migrated: employees.length,
    documents_migrated: documents.length,
    migrated_at: new Date().toISOString(),
    verification: "record-count-and-id-match"
  });
}

async function ensureFirestoreReady(): Promise<void> {
  firebaseConfig();
  if (!migrationPromise) migrationPromise = migrateFromSupabaseOnce();
  try {
    await migrationPromise;
  } catch (error) {
    migrationPromise = null;
    throw error;
  }
}

export async function listEmployees(): Promise<EmployeeRecord[]> {
  await ensureFirestoreReady();
  const employees = await listCollection<EmployeeRecord>(EMPLOYEE_COLLECTION);
  return employees.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
}

export async function createEmployee(input: Partial<EmployeeRecord>): Promise<EmployeeRecord> {
  await ensureFirestoreReady();

  const current = await listCollection<EmployeeRecord>(EMPLOYEE_COLLECTION);
  const employeeId = String(input.employee_id || "").trim();
  const workEmail = String(input.work_email || "").trim().toLowerCase();
  if (current.some((row) => row.employee_id.toLowerCase() === employeeId.toLowerCase())) {
    throw new Error("Employee ID already exists.");
  }
  if (current.some((row) => row.work_email.toLowerCase() === workEmail)) {
    throw new Error("OMNeXa email already exists.");
  }

  const now = new Date().toISOString();
  const record: EmployeeRecord = {
    id: input.id || crypto.randomUUID(),
    employee_id: employeeId,
    full_name: String(input.full_name || "").trim(),
    work_email: workEmail,
    personal_email: input.personal_email ?? null,
    linkedin_url: input.linkedin_url ?? null,
    whatsapp_number: input.whatsapp_number ?? null,
    phone_number: input.phone_number ?? null,
    role: String(input.role || "").trim(),
    engagement_type: input.engagement_type === "intern" ? "intern" : "employee",
    internship_paid: Boolean(input.internship_paid),
    compensation_amount: input.compensation_amount ?? null,
    compensation_currency: input.compensation_currency ?? "SGD",
    start_date: input.start_date ?? null,
    last_working_date: input.last_working_date ?? null,
    status: input.status === "exited" ? "exited" : "active",
    workspace_account_status:
      input.workspace_account_status === "created" || input.workspace_account_status === "manual"
        ? input.workspace_account_status
        : "pending",
    created_at: input.created_at || now,
    updated_at: now
  };

  await writeDocument(EMPLOYEE_COLLECTION, record.id, record as unknown as Record<string, unknown>);
  return record;
}

export async function updateEmployee(id: string, input: Partial<EmployeeRecord>): Promise<EmployeeRecord> {
  await ensureFirestoreReady();
  const current = await readDocument<EmployeeRecord>(EMPLOYEE_COLLECTION, id);
  if (!current) throw new Error("Employee record was not found.");

  const updated: EmployeeRecord = {
    ...current,
    ...input,
    id: current.id || id,
    updated_at: new Date().toISOString()
  };
  await writeDocument(EMPLOYEE_COLLECTION, id, updated as unknown as Record<string, unknown>);
  return updated;
}

export async function logDocument(
  employeeRef: string,
  documentType: "nda" | "offer" | "exit" | "service_certificate" | "promotion",
  documentData: Record<string, unknown>,
  generatedBy: string
): Promise<void> {
  await ensureFirestoreReady();
  const id = crypto.randomUUID();
  const record: HrDocumentRecord = {
    id,
    employee_ref: employeeRef,
    document_type: documentType,
    document_data: documentData,
    generated_by: generatedBy,
    generated_at: new Date().toISOString()
  };
  await writeDocument(DOCUMENT_COLLECTION, id, record as unknown as Record<string, unknown>);
}
