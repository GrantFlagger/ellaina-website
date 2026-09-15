import type { Metadata } from "next";
import ShippingReturns from "@/components/ShippingReturns";

export const metadata: Metadata = {
  title: "Shipping & Returns",
};

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