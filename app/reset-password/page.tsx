import type { Metadata } from "next";
import { Suspense } from "react";
import ResetPasswordForm from "@/components/ResetPasswordForm";
import { noindexMetadata } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata("Νέος Κωδικός");

export default function ResetPasswordPage() {
  return (
    <main>
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}