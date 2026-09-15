"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

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
      staggerChildren: 0.1,
      delayChildren:   0.05,
    },
  },
};

const blockVariant = {
  hidden:  { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function Features() {
  const { lang } = useLanguage();
  const t = translations[lang].features;

  return (
    <section
      id="features"
      className="bg-primary py-24 lg:py-32"
      aria-label="The Ellaina Philosophy"
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
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-5 lg:gap-6"
          variants={gridContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {t.items.map((feature, i) => (
            <motion.div
              key={i}
              variants={blockVariant}
              whileHover={{
                y: -3,
                transition: { duration: 0.2, ease: "easeOut" as const },
              }}
              className="flex cursor-default flex-col items-center rounded-2xl border border-white/10 bg-black/15 px-6 py-9 text-center transition-colors duration-300 hover:border-secondary/30 hover:bg-black/25 lg:px-5"
            >
              <h3 className="font-heading text-[1.05rem] font-semibold leading-snug text-cream">
                {feature.title}
              </h3>
              <p className="mt-2.5 font-body text-[0.8125rem] leading-[1.65] text-cream/60">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}