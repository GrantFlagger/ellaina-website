"use client";

/*
 * HERO A/B: the homepage hero can be either the cinematic 3D scroll journey
 * or a background video. Flip USE_VIDEO_HERO below to compare the two.
 * Kept in its own client component so app/page.tsx can stay a server
 * component and export metadata.
 */

import dynamic from "next/dynamic";
import HeroVideo from "@/components/HeroVideo";

// 3D version is loaded with ssr:false because it boots Three.js (browser-only).
const HeroJourney = dynamic(() => import("@/components/HeroJourney"), {
  ssr: false,
});

// Comparison switch: true = background video, false = 3D scroll journey.
const USE_VIDEO_HERO = true;

export default function HomeHero() {
  return USE_VIDEO_HERO ? <HeroVideo /> : <HeroJourney />;
}
