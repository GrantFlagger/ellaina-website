import type { Metadata } from "next";
import B2B from "@/components/B2B";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "B2B & Χονδρική Ελαιολάδου",
  description: "Συνεργασία με την Ellaina για αναλύσεις, τυποποίηση, συσκευασία, branding και logistics — χωρίς ελάχιστη ποσότητα.",
  path: "/b2b",
});

export default function B2BPage() {
  return (
    <>
      <div className="h-20 w-full bg-cream dark:bg-night md:h-24" aria-hidden />
      <main className="bg-cream dark:bg-night">
        <B2B />
      </main>
    </>
  );
}