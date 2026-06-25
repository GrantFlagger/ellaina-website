import type { Metadata } from "next";
import PageTransition from "@/components/PageTransition";
import ShopProduct   from "@/components/ShopProduct";
import Footer        from "@/components/Footer";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Order Ellaina Extra Virgin Olive Oil — Koroneiki variety, cold-pressed in Epirus, Greece. Full chemical analysis and nutritional information included.",
};

export default function ShopPage() {
  return (
    <PageTransition>
      <main className="bg-cream dark:bg-night pt-20">
        <ShopProduct />
      </main>
      <Footer />
    </PageTransition>
  );
}
