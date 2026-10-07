import type { Metadata } from "next";
import AdminPortal from "./AdminPortal";
import { getAdminEmail, getHrApproverEmail } from "@/lib/admin-session";

export const metadata: Metadata = {
  title: "OMNeXa People & HR",
  description: "Private OMNeXa employee administration workspace.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-snippet": 0,
      "max-image-preview": "none",
      "max-video-preview": 0
    }
  }
};

export default async function AdminPage() {
  const adminEmail = await getAdminEmail();
  const reviewerEmail = adminEmail ? null : await getHrApproverEmail();
  return <AdminPortal initialAdminEmail={adminEmail || reviewerEmail} initialRole={adminEmail ? "admin" : reviewerEmail ? "hr_approver" : null} />;
}
