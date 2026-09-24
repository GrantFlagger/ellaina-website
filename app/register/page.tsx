import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";
import { noindexMetadata } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata("Εγγραφή");

export default function RegisterPage() {
  return (
    <main className="pt-20">
      <AuthForm mode="register" />
    </main>
  );
}