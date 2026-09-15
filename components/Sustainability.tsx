"use client";

import { motion } from "framer-motion";
import { Leaf, Droplets, Recycle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: "easeOut" as const },
  },
};

const POINTS = [
  {
    icon: Leaf,
    titleEl: "Παραδοσιακή συλλογή",
    titleEn: "Traditional harvest",
    bodyEl: "Οι ελιές μαζεύονται με τα χέρια, χωρίς επαφή με μηχανήματα.",
    bodyEn: "Olives are hand-picked, with no contact with heavy machinery.",
  },
  {
    icon: Droplets,
    titleEl: "Ψυχρή έκθλιψη",
    titleEn: "Cold extraction",
    bodyEl: "Η παραγωγή συνδυάζει την παράδοση με σύγχρονη, ψυχρή τεχνολογία.",
    bodyEn: "Production blends tradition with modern, cold-press technology.",
  },
  {
    icon: Recycle,
    titleEl: "Σεβασμός στη γη",
    titleEn: "Respect for the land",
    bodyEl: "Πρακτικές που προστατεύουν το έδαφος και τους ελαιώνες της Πρέβεζας.",
    bodyEn: "Practices that protect the soil and the olive groves of Preveza.",
  },
] as const;

export default function Sustainability() {
  const { lang } = useLanguage();
  const t = translations[lang].sustainability;

  return (
    <section
      id="sustainability"
      className="relative overflow-hidden bg-primary py-24 lg:py-32"
      aria-label="Sustainability"
    >
      {/* Subtle decorative texture — no photo, just soft radial glows in the brand color */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto flex max-w-2xl flex-col items-center text-center"
          variants={container}
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

          <motion.div variants={fadeUp} className="my-7 h-px w-12 bg-secondary/70" />

          <motion.p
            variants={fadeUp}
            className="font-body text-[0.9375rem] leading-[1.78] text-white/72"
          >
            {t.body}
          </motion.p>
        </motion.div>

        <motion.div
          className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3 lg:gap-8"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {POINTS.map((point) => {
            const Icon = point.icon;
            return (
              <motion.div
                key={point.titleEn}
                variants={fadeUp}
                className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 px-6 py-8 text-center backdrop-blur-sm"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary/15 ring-1 ring-secondary/30">
                  <Icon className="h-5 w-5 text-secondary" strokeWidth={1.8} />
                </span>
                <h3 className="mt-4 font-heading text-base font-bold text-white">
                  {lang === "el" ? point.titleEl : point.titleEn}
                </h3>
                <p className="mt-2 font-body text-[0.8125rem] leading-relaxed text-white/65">
                  {lang === "el" ? point.bodyEl : point.bodyEn}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}