import type { Metadata } from "next";
import Checkout from "@/components/Checkout";


export const metadata: Metadata = {
  title: "Checkout",
};

export default function CheckoutPage() {
  return (
    <>
      {/* Solid backdrop strip so the fixed navbar always has a solid
          background here, same fix used on the other standalone pages. */}
      <div className="h-20 w-full bg-cream dark:bg-night md:h-24" aria-hidden />
      <main className="bg-cream dark:bg-night">
        <Checkout />
      </main>
    </>
  );
}