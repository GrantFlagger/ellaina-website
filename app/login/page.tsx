import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Σύνδεση",
  description: "Συνδέσου στον λογαριασμό σου στην Ellaina Olive Oil.",
};

export default function LoginPage() {
  return (
    <main className="pt-20">
      <AuthForm mode="login" />
    </main>
  );
}