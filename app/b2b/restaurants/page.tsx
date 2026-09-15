import type { Metadata } from "next";
import B2BRestaurants from "@/components/B2BRestaurants";

export const metadata: Metadata = {
  title: "Ellaina για Εστιατόρια",
  description: "Private-label extra virgin olive oil για το εστιατόριό σας, με το δικό σας όνομα και λογότυπο.",
};

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