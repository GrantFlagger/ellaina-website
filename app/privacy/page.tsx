import type { Metadata } from "next";
import PrivacyPolicy from "@/components/PrivacyPolicy";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Πολιτική Απορρήτου",
  description: "Πώς η Ellaina Olive Oil συλλέγει, χρησιμοποιεί και προστατεύει τα προσωπικά σου δεδομένα.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <div className="h-20 w-full bg-cream dark:bg-night md:h-24" aria-hidden />
      <main className="bg-cream dark:bg-night">
        <PrivacyPolicy />
      </main>
    </>
  );
}