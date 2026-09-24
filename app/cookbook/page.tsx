import type { Metadata } from "next";
import PageTransition from "@/components/PageTransition";
import Cookbook from "@/components/Cookbook";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Συνταγές με Ελαιόλαδο",
  description:
    "Συνταγές με Ellaina Extra Virgin Olive Oil — από λαδόπιτα Πρέβεζας και μπριάμ μέχρι χωριάτικη και ντάκο.",
  path: "/cookbook",
});

export default function CookbookPage() {
  return (
    <PageTransition>
      <main className="bg-cream dark:bg-night pt-20">
        <Cookbook />
      </main>
    </PageTransition>
  );
}