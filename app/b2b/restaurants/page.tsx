import type { Metadata } from "next";
import B2BRestaurants from "@/components/B2BRestaurants";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Ελαιόλαδο για Εστιατόρια",
  description: "Private-label εξαιρετικό παρθένο ελαιόλαδο για το εστιατόριό σας, με το δικό σας όνομα και λογότυπο.",
  path: "/b2b/restaurants",
});

export default function B2BRestaurantsPage() {
  return (
    <>
      <div className="h-20 w-full bg-cream dark:bg-night md:h-24" aria-hidden />
      <main className="bg-cream dark:bg-night">
        <B2BRestaurants />
      </main>
    </>
  );
}