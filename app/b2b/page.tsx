import type { Metadata } from "next";
import B2B from "@/components/B2B";

export const metadata: Metadata = {
  title: "B2B & Χονδρική",
  description: "Συνεργασία με την Ellaina για αναλύσεις, τυποποίηση, συσκευασία, branding και logistics — χωρίς ελάχιστη ποσότητα.",
};

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