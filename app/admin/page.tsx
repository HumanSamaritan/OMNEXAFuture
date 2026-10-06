import type { Metadata } from "next";
import AdminPortal from "./AdminPortal";
import { getAdminEmail } from "@/lib/admin-session";

export const metadata: Metadata = {
  title: "OMNeXa Admin",
  robots: { index: false, follow: false }
};

export default async function AdminPage() {
  const adminEmail = await getAdminEmail();
  return <AdminPortal initialAdminEmail={adminEmail} />;
}
