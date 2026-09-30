import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";
import UnavailableNotice from "@/components/UnavailableNotice";
import { CUSTOMER_AUTH_ENABLED } from "@/lib/availability";
import { noindexMetadata } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata("Σύνδεση");

export default function LoginPage() {
  return (
    <main className="pt-20">
      {CUSTOMER_AUTH_ENABLED ? <AuthForm mode="login" /> : <UnavailableNotice kind="account" />}
    </main>
  );
}