import type { Metadata } from "next";
import CheckoutSuccess from "@/components/CheckoutSuccess";


export const metadata: Metadata = {
  title: "Order Confirmed",
};

export default function CheckoutSuccessPage() {
  return (
    <>
      <div className="h-20 w-full bg-cream dark:bg-night md:h-24" aria-hidden />
      <main className="bg-cream dark:bg-night">
        <CheckoutSuccess />
      </main>
    </>
  );
}