import type { Metadata } from "next";
import TermsOfUse from "@/components/TermsOfUse";

export const metadata: Metadata = {
  title: "Terms of Use",
};

export default function TermsPage() {
  return (
    <>
      <div className="h-20 w-full bg-cream dark:bg-night md:h-24" aria-hidden />
      <main className="bg-cream dark:bg-night">
        <TermsOfUse />
      </main>
    </>
  );
}