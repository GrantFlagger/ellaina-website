"use client";

/*
 * HeroVideo — a simple full-viewport video-background hero.
 *
 * Drop-in alternative to <HeroJourney /> for A/B comparison. It plays
 * /videos/hero.mp4 behind the same hero text + CTAs used by the original
 * <Hero />, so the only thing that changes between options is the backdrop.
 */

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

// Toggle to "left" to compare the drop sitting beside the wordmark
// instead of above it — quick to flip while we decide which reads better.
const DROP_POSITION: "top" | "left" = "top";

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.35,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" as const },
  },
};

export default function HeroVideo() {
  const { lang } = useLanguage();
  const t = translations[lang].hero;

  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      aria-label="Hero"
    >
      {/* background video */}
      {/* scale-[1.15] zooms past the baked-in black letterbox bars in the
          source footage — object-cover alone can't crop those out since
          they're part of the actual video frame, not empty container space. */}
      <video
        className="absolute inset-0 h-full w-full scale-[1.15] object-cover object-center"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/images/hero-grove.png"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* readability gradient — matches the original Hero */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/55 to-primary/85 pointer-events-none"
      />

      <motion.div
        className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 text-center sm:px-6"
        variants={container}
        initial="hidden"
        animate="visible"
      >
               {/* Brand mark — drop + wordmark, replacing the old eyebrow/heading copy.
            Sized with clamp()/vmin (smaller of viewport width/height) instead
            of fixed Tailwind h-* breakpoints, so it scales smoothly on short
            laptop screens instead of jumping between fixed sizes. */}
        <motion.div
          variants={fadeUp}
          className={
            DROP_POSITION === "left"
              ? "flex flex-row items-center gap-5 sm:gap-6"
              : "flex flex-col items-center gap-5 sm:gap-7"
          }
        >
          <Image
            src="/images/logo-drop.png"
            alt=""
            width={70}
            height={90}
            priority
            style={{ height: "clamp(72px, 12vmin, 170px)", width: "auto" }}
            className="object-contain brightness-0 invert opacity-90"
            aria-hidden
          />
          <Image
            src="/images/logo.png"
            alt="Ellaina"
            width={640}
            height={230}
            priority
            style={{ height: "clamp(170px, 28vmin, 480px)", width: "auto" }}
            className="object-contain brightness-0 invert"
          />
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="my-7 h-px w-16 bg-secondary/60 sm:my-8"
        />

        <motion.p
          variants={fadeUp}
          className="max-w-md font-body text-base leading-relaxed text-white/75 sm:text-lg sm:max-w-lg"
        >
          {t.subheading}
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-4"
        >
          <Link
            href="/shop"
            className="w-full rounded-full bg-secondary px-8 py-3.5 text-sm font-semibold tracking-wide text-bark shadow-lg transition-all duration-200 hover:bg-secondary-600 hover:text-white hover:shadow-xl active:scale-[0.97] sm:w-auto"
          >
            {t.shopNow}
          </Link>
          {/* <Link
            href="#our-story"
            className="w-full rounded-full border border-white/55 px-8 py-3.5 text-sm font-medium tracking-wide text-white transition-all duration-200 hover:border-white hover:bg-white/10 active:scale-[0.97] sm:w-auto"
          >
            {t.ourValues}
          </Link> */}
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.7 }}
        aria-hidden
      >
        <span className="font-body text-[10px] font-medium uppercase tracking-[0.22em] text-white/40">
          {t.scroll}
        </span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5 text-white/45" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  );
}