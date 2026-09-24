import type { Metadata } from "next";
import Benefits from "@/components/Benefits";
import Cookbook from "@/components/Cookbook";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Τα Οφέλη του Ελαιολάδου",
  description:
    "Το εξαιρετικό παρθένο ελαιόλαδο στη μεσογειακή διατροφή και παράδοση — μαζί με συνταγές για να το απολαύσεις κάθε μέρα.",
  path: "/benefits",
});

export default function BenefitsPage() {
  return (
    <main>
      <Benefits />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-light/70 dark:bg-white/8" />
      </div>
      <Cookbook headingLevel="h2" />
    </main>
  );
}