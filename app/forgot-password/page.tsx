import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";
import { noindexMetadata } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata("Επαναφορά Κωδικού");

export default function ForgotPasswordPage() {
  return (
    <main>
      <ForgotPasswordForm />
    </main>
  );
}