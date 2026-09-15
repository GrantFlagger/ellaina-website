"use client";

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
 * HERO A/B: the homepage hero can be either the cinematic 3D scroll journey
 * or a background video. Flip USE_VIDEO_HERO below to compare the two.
 *
 * NOTE: CookbookTeaser and Sustainability sections were removed from the
 * homepage per latest notes — both still exist as standalone pages
 * (/cookbook and /sustainability), just no longer teased on the homepage.
 *
 * BottleFillAnimation: fixed, right-side, scroll-linked oil fill — decorative
 * only (pointer-events-none), scoped to this page since it tracks whole-page
 * scroll progress and wouldn't make sense on inner pages.
 */

import dynamic from "next/dynamic";
import PageTransition from "@/components/PageTransition";
import HeroVideo      from "@/components/HeroVideo";
import About          from "@/components/About";
import Products       from "@/components/Products";
import Features       from "@/components/Features";
import Testimonials   from "@/components/Testimonials";
import Footer         from "@/components/Footer";
import BottleFillAnimation from "@/components/BottleFillAnimation";

// 3D version is loaded with ssr:false because it boots Three.js (browser-only).
const HeroJourney = dynamic(() => import("@/components/HeroJourney"), {
  ssr: false,
});

// Comparison switch: true = background video, false = 3D scroll journey.
const USE_VIDEO_HERO = true;

export default function Home() {
  return (
    <PageTransition>
      <BottleFillAnimation />
      <main>
        {USE_VIDEO_HERO ? <HeroVideo /> : <HeroJourney />}
        <Products />
        <About />
        <Features />
        <Testimonials />
      </main>
    </PageTransition>
  );
}