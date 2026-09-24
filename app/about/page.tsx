import type { Metadata } from "next";
import About from "@/components/About";
import WhyEllaina from "@/components/WhyEllaina";
import Sustainability from "@/components/Sustainability";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Η Ιστορία & οι Αξίες μας",
  description:
    "Γνώρισε την οικογένεια πίσω από το Ellaina: ελιές Κορωνέικης στην Πρέβεζα της Ηπείρου, ψυχρή έκθλιψη και σεβασμός στη γη από γενιά σε γενιά.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main>
      <About headingLevel="h1" />
      <WhyEllaina />
      <Sustainability />
    </main>
  );
}