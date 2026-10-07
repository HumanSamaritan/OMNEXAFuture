import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, AdminSession, isAllowedAdmin, isAllowedHrApprover, verifyToken } from "@/lib/admin-auth";

export async function getAdminEmail(): Promise<string | null> {
  const jar = await cookies();
  const session = verifyToken<AdminSession>(jar.get(ADMIN_SESSION_COOKIE)?.value);
  if (!session || !isAllowedAdmin(session.email)) return null;
  return session.email;
}

export async function getHrApproverEmail(): Promise<string | null> {
  const jar = await cookies();
  const session = verifyToken<AdminSession>(jar.get(ADMIN_SESSION_COOKIE)?.value);
  if (!session || !isAllowedHrApprover(session.email)) return null;
  return session.email;
}

