import type { Metadata } from "next";
import ShippingReturns from "@/components/ShippingReturns";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Αποστολή & Επιστροφές",
  description: "Πώς αποστέλλουμε τις παραγγελίες Ellaina Olive Oil και πώς λειτουργούν οι επιστροφές.",
  path: "/shipping",
});

export default function ShippingPage() {
  return (
    <>
      <div className="h-20 w-full bg-cream dark:bg-night md:h-24" aria-hidden />
      <main className="bg-cream dark:bg-night">
        <ShippingReturns />
      </main>
    </>
  );
}