import type { Metadata } from "next";
import PageTransition from "@/components/PageTransition";
import Sustainability from "@/components/Sustainability";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Βιωσιμότητα",
  description:
    "Καλλιέργεια σε αρμονία με τη γη — βιολογική παραγωγή χωρίς συνθετικά φυτοφάρμακα, μύλος με ηλιακή ενέργεια, στην Ήπειρο.",
};

export default function SustainabilityPage() {
  return (
    <PageTransition>
      <main className="bg-cream dark:bg-night pt-20">
        <Sustainability />
      </main>
    </PageTransition>
  );
}