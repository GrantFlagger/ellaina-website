"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

const textContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren:   0.1,
    },
  },
};

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: "easeOut" as const },
  },
};

export default function Sustainability() {
  const sectionRef = useRef<HTMLElement>(null);
  const { lang } = useLanguage();
  const t = translations[lang].sustainability;

  const { scrollYProgress } = useScroll({
    target:  sectionRef,
    offset:  ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section
      ref={sectionRef}
      id="sustainability"
      className="relative flex min-h-[70vh] items-center justify-center overflow-hidden"
      aria-label="Sustainability"
    >
      <motion.div
        style={{ y }}
        className="absolute inset-x-0 -bottom-[10%] -top-[10%]"
        aria-hidden
      >
        <Image
          src="/images/olive-grove-day.png"
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
      </motion.div>

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-primary/50 via-primary/62 to-primary/70 pointer-events-none"
      />

      <motion.div
        className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-4 text-center sm:px-6"
        variants={textContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <motion.p
          variants={fadeUp}
          className="mb-4 font-body text-xs font-semibold uppercase tracking-[0.26em] text-secondary"
        >
          {t.label}
        </motion.p>

        <motion.h2
          variants={fadeUp}
          className="font-heading text-balance text-3xl font-bold leading-[1.18] tracking-tight text-white sm:text-4xl lg:text-[2.6rem]"
        >
          {t.heading}
        </motion.h2>

        <motion.div
          variants={fadeUp}
          className="my-7 h-px w-12 bg-secondary/70"
        />

        <motion.p
          variants={fadeUp}
          className="font-body text-[0.9375rem] leading-[1.78] text-white/72"
        >
          {t.body}
        </motion.p>

        <motion.div variants={fadeUp} className="mt-9">
          <a
            href="#our-story"
            className="inline-flex items-center rounded-full border border-white/60 px-8 py-3.5 font-body text-sm font-medium tracking-wide text-white transition-all duration-200 hover:border-white hover:bg-white/12 active:scale-[0.97]"
          >
            {t.readOurStory}
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
