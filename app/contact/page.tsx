import type { Metadata } from "next";
import PageTransition from "@/components/PageTransition";
import Contact from "@/components/Contact";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Επικοινωνία",
  description:
    "Επικοινώνησε με την Ellaina Olive Oil για παραγγελίες, χονδρική, ή ερωτήσεις σχετικά με το κτήμα μας στην Πρέβεζα.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <PageTransition>
      <main className="bg-cream dark:bg-night pt-20">
        <Contact />
      </main>
    </PageTransition>
  );
}