"use client";

/*
 * Home page — full single-page assembly.
 *
 * Render order:
 *   1. <Navbar />       — rendered in layout.tsx (fixed, global, above every page)
 *   2. <HeroVideo /> — full-viewport background-video hero (current option)
 *   3. <About />        — two-column brand story; text + image scroll reveal
 *   4. <Products />     — 4-card product grid with staggered fade-in
 *   5. <Features />     — dark feature strip; 4 blocks with hover scale
 *   6. <Sustainability />— full-bleed parallax banner
 *   7. <Testimonials /> — auto-playing directional carousel
 *   8. <Footer />       — 3-column footer with newsletter form
 *
 * HERO A/B: the homepage hero can be either the cinematic 3D scroll journey
 * or a background video. Flip USE_VIDEO_HERO below to compare the two.
 */

import dynamic from "next/dynamic";
import PageTransition from "@/components/PageTransition";
import HeroVideo      from "@/components/HeroVideo";
import About          from "@/components/About";
import Products       from "@/components/Products";
import Features       from "@/components/Features";
import Sustainability from "@/components/Sustainability";
import Testimonials   from "@/components/Testimonials";
import Footer         from "@/components/Footer";

// 3D version is loaded with ssr:false because it boots Three.js (browser-only).
const HeroJourney = dynamic(() => import("@/components/HeroJourney"), {
  ssr: false,
});

// Comparison switch: true = background video, false = 3D scroll journey.
const USE_VIDEO_HERO = true;

export default function Home() {
  return (
    <PageTransition>
      <main>
        {USE_VIDEO_HERO ? <HeroVideo /> : <HeroJourney />}
        <About />
        <Products />
        <Features />
        <Sustainability />
        <Testimonials />
      </main>
      <Footer />
    </PageTransition>
  );
}
