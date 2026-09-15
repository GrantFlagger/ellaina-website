import type { Metadata } from "next";
import PageTransition from "@/components/PageTransition";
import Cookbook from "@/components/Cookbook";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Συνταγές",
  description:
    "Πέντε τρόποι να μαγειρέψεις και να σερβίρεις με το Ellaina Extra Virgin Olive Oil — από τη χωριάτικη μέχρι τον ντάκο Κρητικό.",
};

export default function CookbookPage() {
  return (
    <PageTransition>
      <main className="bg-cream dark:bg-night pt-20">
        <Cookbook />
      </main>
      <Footer />
    </PageTransition>
  );
}