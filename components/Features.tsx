"use client";

import { motion } from "framer-motion";
import { Droplets, MapPin, Award, Leaf, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

const FEATURE_ICONS: LucideIcon[] = [Droplets, MapPin, Award, Leaf];

const headerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
};

const fadeUp = {
  hidden:  { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

const gridContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.11,
      delayChildren:   0.05,
    },
  },
};

const blockVariant = {
  hidden:  { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" as const },
  },
};

export default function Features() {
  const { lang } = useLanguage();
  const t = translations[lang].features;

  return (
    <section
      id="features"
      className="bg-primary py-24 lg:py-32"
      aria-label="Why Ellaina"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <motion.div
          className="mb-14 flex flex-col items-center text-center lg:mb-16"
          variants={headerContainer}
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
            className="font-heading text-balance text-3xl font-bold leading-tight tracking-tight text-cream sm:text-4xl lg:text-[2.6rem]"
          >
            {t.heading}
          </motion.h2>
          <motion.div
            variants={fadeUp}
            className="mt-6 h-px w-12 bg-secondary/60"
          />
        </motion.div>

        <motion.div
          className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-8"
          variants={gridContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {t.items.map((feature, i) => {
            const Icon = FEATURE_ICONS[i];
            return (
              <motion.div
                key={i}
                variants={blockVariant}
                whileHover={{
                  scale: 1.04,
                  transition: { duration: 0.2, ease: "easeOut" as const },
                }}
                className="group flex cursor-default flex-col items-center rounded-2xl border border-white/8 p-6 text-center transition-colors duration-300 hover:bg-white/[0.06] lg:p-8"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-secondary/15 ring-1 ring-secondary/25 transition-colors duration-300 group-hover:bg-secondary/20">
                  <Icon className="h-7 w-7 text-secondary" strokeWidth={1.6} aria-hidden />
                </div>
                <h3 className="mb-2.5 font-heading text-[1.05rem] font-semibold leading-snug text-cream">
                  {feature.title}
                </h3>
                <p className="font-body text-[0.8125rem] leading-[1.72] text-cream/60">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
