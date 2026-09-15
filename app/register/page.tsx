import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Εγγραφή",
  description: "Δημιούργησε λογαριασμό στην Ellaina Olive Oil.",
};

export default function RegisterPage() {
  return (
    <main className="pt-20">
      <AuthForm mode="register" />
    </main>
  );
}