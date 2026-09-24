/*
 * Home page — full single-page assembly.
 *
 * Render order:
 *   1. <Navbar />       — rendered in layout.tsx (fixed, global, above every page)
 *   2. <HeroVideo /> — full-viewport background-video hero (current option)
 *   3. <Products />     — 4-card product grid with staggered fade-in
 *   4. <About />        — two-column brand story; text + image scroll reveal
 *   5. <Features />     — dark feature strip; 4 blocks with hover scale
 *   6. <Testimonials /> — auto-playing directional carousel
 *   7. <Footer />       — 3-column footer with newsletter form
 *
 * HERO A/B: the video / 3D hero switch lives in components/HomeHero.tsx.
 *
 * NOTE: CookbookTeaser and Sustainability sections were removed from the
 * homepage per latest notes — both still exist as standalone pages
 * (/cookbook and /sustainability), just no longer teased on the homepage.
 *
 * BottleFillAnimation: fixed, right-side, scroll-linked oil fill — decorative
 * only (pointer-events-none), scoped to this page since it tracks whole-page
 * scroll progress and wouldn't make sense on inner pages.
 */

import type { Metadata } from "next";
import PageTransition from "@/components/PageTransition";
import HomeHero       from "@/components/HomeHero";
import About          from "@/components/About";
import Products       from "@/components/Products";
import Features       from "@/components/Features";
import Testimonials   from "@/components/Testimonials";
import BottleFillAnimation from "@/components/BottleFillAnimation";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Ellaina — Εξαιρετικό Παρθένο Ελαιόλαδο από την Πρέβεζα",
  description:
    "Εξαιρετικό παρθένο ελαιόλαδο Κορωνέικης από το οικογενειακό μας κτήμα στην Πρέβεζα. Ψυχρή έκθλιψη, οξύτητα 0,24%, πιστοποιημένο από διαπιστευμένο εργαστήριο.",
  path: "/",
  absoluteTitle: true,
});

export default function Home() {
  return (
    <PageTransition>
      <BottleFillAnimation />
      <main>
        <HomeHero />
        <Products />
        <About />
        <Features />
        <Testimonials />
      </main>
    </PageTransition>
  );
}