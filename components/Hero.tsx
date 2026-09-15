"use client";

/*
 * Hero — still image version, light treatment.
 * Same two changes as HeroVideo: brand logo PNG instead of the typed
 * "Ellaina" wordmark + eyebrow line, and a light cream scrim.
 */

import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.16, delayChildren: 0.35 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" as const },
  },
};

export default function Hero() {
  const { lang } = useLanguage();
  const t = translations[lang].hero;

  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      aria-label="Hero"
    >
      <Image
        src="/images/hero-grove.png"
        alt="Sunlit olive groves in the Greek countryside at golden hour"
        fill
        priority
        quality={90}
        className="object-cover object-center"
        sizes="100vw"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-cream/55 via-cream/40 to-cream/85"
      />

      <motion.div
        className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 text-center sm:px-6"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeUp} className="mb-8 sm:mb-10">
          <Image
            src="/images/logo.png"
            alt="Ellaina"
            width={297}
            height={130}
            priority
            className="h-20 w-auto object-contain sm:h-28 lg:h-32"
          />
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="max-w-2xl font-heading text-balance text-xl font-medium leading-snug text-bark sm:text-2xl lg:text-3xl"
        >
          {t.heading}
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="my-7 h-px w-16 bg-secondary sm:my-8"
        />

        <motion.p
          variants={fadeUp}
          className="max-w-md font-body text-base leading-relaxed text-bark/70 sm:max-w-lg sm:text-lg"
        >
          {t.subheading}
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-4"
        >
          <a
            href="/shop"
            className="w-full rounded-full bg-secondary px-8 py-3.5 text-sm font-semibold tracking-wide text-bark shadow-sm transition-colors duration-200 hover:bg-secondary-600 hover:text-white active:scale-[0.97] sm:w-auto"
          >
            {t.shopNow}
          </a>
          <a
            href="/about"
            className="w-full rounded-full border border-bark/30 px-8 py-3.5 text-sm font-medium tracking-wide text-bark transition-colors duration-200 hover:border-bark/60 hover:bg-bark/5 active:scale-[0.97] sm:w-auto"
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
        <span className="font-body text-[10px] font-medium uppercase tracking-[0.22em] text-bark/55">
          {t.scroll}
        </span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5 text-bark/55" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  );
}
