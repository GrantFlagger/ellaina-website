import type { Metadata } from "next";
import PageTransition from "@/components/PageTransition";
import Sustainability from "@/components/Sustainability";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Βιωσιμότητα",
  description:
    "Καλλιέργεια σε αρμονία με τη γη — χειροσυλλεγμένες ελιές και οικογενειακή φροντίδα των ελαιώνων μας στην Πρέβεζα.",
  path: "/sustainability",
});

export default function SustainabilityPage() {
  return (
    <PageTransition>
      <main className="bg-cream dark:bg-night pt-20">
        <Sustainability headingLevel="h1" />
      </main>
    </PageTransition>
  );
}