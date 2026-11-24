import type { Metadata } from "next";
import { isAdmin } from "@/lib/auth";
import { listLeads, listPosts } from "@/lib/db";
import { AdminLogin, AdminDashboard } from "@/components/admin";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function AdminPage() {
  if (!(await isAdmin())) return <AdminLogin />;
  return <AdminDashboard leads={listLeads()} posts={listPosts(true).map(({ content, ...p }) => ({ ...p, content: "" }))} />;
}
