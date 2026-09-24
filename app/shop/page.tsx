import type { Metadata } from "next";
import PageTransition from "@/components/PageTransition";
import ShopProduct   from "@/components/ShopProduct";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Αγόρασε Εξαιρετικό Παρθένο Ελαιόλαδο",
  description:
    "Παράγγειλε Ellaina σε 500 ml, 750 ml ή 5 L. Κορωνέικη ποικιλία, ψυχρή έκθλιψη στην Ήπειρο, με πλήρη χημική ανάλυση και διατροφικές πληροφορίες.",
  path: "/shop",
});

export default function ShopPage() {
  return (
    <PageTransition>
      <main className="bg-cream dark:bg-night pt-20">
        <ShopProduct />
      </main>
    </PageTransition>
  );
}
