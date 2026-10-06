import { NextResponse } from "next/server";
import { getAdminEmail } from "@/lib/admin-session";
import { logDocument } from "@/lib/hr-store";

const allowedTypes = new Set(["nda", "offer", "exit", "service_certificate", "promotion"]);

export async function POST(request: Request) {
  const admin = await getAdminEmail();
  if (!admin) return NextResponse.json({ error: "Unauthorised." }, { status: 401 });

  try {
    const body = (await request.json()) as {
      employee_ref?: string;
      document_type?: "nda" | "offer" | "exit" | "service_certificate" | "promotion";
      document_data?: Record<string, unknown>;
    };
    if (!body.employee_ref || !body.document_type || !allowedTypes.has(body.document_type)) {
      return NextResponse.json({ error: "Employee and document type are required." }, { status: 400 });
    }
    await logDocument(body.employee_ref, body.document_type, body.document_data || {}, admin);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin document log error", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Unable to log generated document." }, { status: 500 });
  }
}
