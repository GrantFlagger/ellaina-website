import type { Metadata } from "next";
import AdminDashboard from "@/components/AdminDashboard";
import { noindexMetadata } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata("Admin");

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-cream dark:bg-night">
      <AdminDashboard />
    </main>
  );
}
