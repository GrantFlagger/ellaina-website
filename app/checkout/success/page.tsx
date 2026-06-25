import type { Metadata } from "next";
import PageTransition from "@/components/PageTransition";
import Footer from "@/components/Footer";
import OrderSuccess from "@/components/OrderSuccess";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Thank you for your order from Ellaina Olive Oil.",
};

export default function CheckoutSuccessPage() {
  return (
    <PageTransition>
      <main className="bg-cream dark:bg-night pt-20 min-h-[60vh]">
        <OrderSuccess />
      </main>
      <Footer />
    </PageTransition>
  );
}
