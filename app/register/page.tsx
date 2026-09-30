import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";
import UnavailableNotice from "@/components/UnavailableNotice";
import { CUSTOMER_AUTH_ENABLED } from "@/lib/availability";
import { noindexMetadata } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata("Εγγραφή");

export default function RegisterPage() {
  return (
    <main className="pt-20">
      {CUSTOMER_AUTH_ENABLED ? <AuthForm mode="register" /> : <UnavailableNotice kind="account" />}
    </main>
  );
}