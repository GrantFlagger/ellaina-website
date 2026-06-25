"use client";

/*
 * HeroVideo — a simple full-viewport video-background hero.
 *
 * Drop-in alternative to <HeroJourney /> for A/B comparison. It plays
 * /videos/hero.mp4 behind the same hero text + CTAs used by the original
 * <Hero />, so the only thing that changes between options is the backdrop.
 */

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

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
      <video
        className="absolute inset-0 h-full w-full object-cover object-center"
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
        <motion.p
          variants={fadeUp}
          className="mb-5 font-body text-xs font-semibold uppercase tracking-[0.28em] text-secondary sm:text-sm"
        >
          {t.eyebrow}
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="font-heading text-balance text-[2.6rem] font-bold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-[4.25rem]"
        >
          {t.heading}
        </motion.h1>

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
          <a
            href="/shop"
            className="w-full rounded-full bg-secondary px-8 py-3.5 text-sm font-semibold tracking-wide text-bark shadow-lg transition-all duration-200 hover:bg-secondary-600 hover:text-white hover:shadow-xl active:scale-[0.97] sm:w-auto"
          >
            {t.shopNow}
          </a>
          <a
            href="#our-story"
            className="w-full rounded-full border border-white/55 px-8 py-3.5 text-sm font-medium tracking-wide text-white transition-all duration-200 hover:border-white hover:bg-white/10 active:scale-[0.97] sm:w-auto"
          >
            {t.ourStory}
          </a>
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
