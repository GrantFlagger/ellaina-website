"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

const textContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren:   0.05,
    },
  },
};

const fadeUp = {
  hidden:  { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: "easeOut" as const },
  },
};

const fadeRight = {
  hidden:  { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, ease: "easeOut" as const },
  },
};

export default function About() {
  const { lang } = useLanguage();
  const t = translations[lang].about;

  return (
    <section
      id="our-story"
      className="bg-cream dark:bg-night py-24 lg:py-36"
      aria-label="Our Story"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20 xl:gap-28">

          {/* Text column */}
          <motion.div
            className="order-2 flex flex-col lg:order-1"
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
              className="font-heading text-balance text-3xl font-bold leading-[1.18] tracking-tight text-bark dark:text-cream sm:text-4xl lg:text-[2.6rem]"
            >
              {t.heading}
            </motion.h2>

            <motion.div
              variants={fadeUp}
              className="my-7 h-px w-12 bg-secondary"
            />

            <motion.p
              variants={fadeUp}
              className="font-body text-[0.9375rem] leading-[1.78] text-bark/75 dark:text-cream/70"
            >
              {t.p1}
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="mt-5 font-body text-[0.9375rem] leading-[1.78] text-bark/75 dark:text-cream/70"
            >
              {t.p2}
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="mt-5 font-body text-[0.9375rem] leading-[1.78] text-bark/75 dark:text-cream/70"
            >
              {t.p3}
            </motion.p>

            <motion.div variants={fadeUp} className="mt-9">
              <a
                href="#about"
                className="group inline-flex items-center gap-2 font-body text-sm font-semibold text-primary dark:text-secondary transition-colors duration-200 hover:text-secondary dark:hover:text-secondary-300"
              >
                {t.learnMore}
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                  strokeWidth={2}
                />
              </a>
            </motion.div>
          </motion.div>

          {/* Image column */}
          <motion.div
            className="order-1 lg:order-2"
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <div className="relative">
              <div
                aria-hidden
                className="absolute -bottom-4 -right-4 h-full w-full rounded-2xl bg-secondary/15 lg:-bottom-5 lg:-right-5"
              />
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-[0_20px_60px_-12px_rgba(61,43,31,0.22)]">
                <Image
                  src="/images/about-oil-pour.png"
                  alt="Ellaina extra virgin olive oil being poured at sunset over the Epirus fields"
                  fill
                  className="object-cover object-center transition-transform duration-700 hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
