import type { Metadata } from "next";
import TermsOfUse from "@/components/TermsOfUse";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Όροι Χρήσης",
  description: "Οι όροι χρήσης του ellainaoliveoil.com και οι όροι αγορών από το ηλεκτρονικό μας κατάστημα.",
  path: "/terms",
});

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