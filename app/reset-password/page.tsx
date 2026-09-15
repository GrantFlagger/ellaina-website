import { Suspense } from "react";
import ResetPasswordForm from "@/components/ResetPasswordForm";
import Footer from "@/components/Footer";

export default function ResetPasswordPage() {
  return (
    <>
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
      <Footer />
    </>
  );
}