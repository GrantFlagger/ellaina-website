import type { Metadata } from "next";
import PageTransition from "@/components/PageTransition";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Επικοινωνία",
  description:
    "Επικοινώνησε με την Ellaina Olive Oil για παραγγελίες, χονδρική, ή ερωτήσεις σχετικά με το κτήμα μας στην Πρέβεζα.",
};

export default function ContactPage() {
  return (
    <PageTransition>
      <main className="bg-cream dark:bg-night pt-20">
        <Contact />
      </main>
    </PageTransition>
  );
}