import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";
import { noindexMetadata } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata("Σύνδεση");

export default function LoginPage() {
  return (
    <main className="pt-20">
      <AuthForm mode="login" />
    </main>
  );
}