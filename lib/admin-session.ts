import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, AdminSession, isAllowedAdmin, verifyToken } from "@/lib/admin-auth";

export async function getAdminEmail(): Promise<string | null> {
  const jar = await cookies();
  const session = verifyToken<AdminSession>(jar.get(ADMIN_SESSION_COOKIE)?.value);
  if (!session || !isAllowedAdmin(session.email)) return null;
  return session.email;
}
