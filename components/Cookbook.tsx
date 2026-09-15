"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { RECIPES } from "@/lib/recipes";
import Image from "next/image";

const headerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

const gridContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" as const },
  },
};

export default function Cookbook() {
  const { lang } = useLanguage();

  const copy =
    lang === "el"
      ? {
          label: "Από την κουζίνα της Ellaina",
          heading: "Το βιβλίο συνταγών",
          sub: "Έξι τρόποι να αφήσεις το λάδι να μιλήσει — απλά, ωμά, γενναιόδωρα. Πάτησε σε μια συνταγή για την πλήρη εκτέλεση.",
        }
      : {
          label: "From the Ellaina kitchen",
          heading: "The cookbook",
          sub: "Six ways to let the oil speak — simple, raw, generous. Tap a recipe for the full method.",
        };

  return (
    <section className="bg-cream dark:bg-night py-24 lg:py-32" aria-label="Cookbook">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-14 flex flex-col items-center text-center lg:mb-20"
          variants={headerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.p
            variants={fadeUp}
            className="mb-4 font-body text-xs font-semibold uppercase tracking-[0.26em] text-secondary"
          >
            {copy.label}
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="font-heading text-balance text-3xl font-bold leading-tight tracking-tight text-bark dark:text-cream sm:text-4xl lg:text-[2.75rem]"
          >
            {copy.heading}
          </motion.h1>
          <motion.div variants={fadeUp} className="mt-6 h-px w-12 bg-secondary" />
          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-lg font-body text-[0.9375rem] leading-relaxed text-bark/60 dark:text-cream/55"
          >
            {copy.sub}
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
          variants={gridContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {RECIPES.map((recipe) => (
            <motion.div key={recipe.id} variants={cardVariant}>
              <Link
                href={`/cookbook/${recipe.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-light/80 dark:border-white/8 bg-white dark:bg-night-subtle shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_18px_52px_-8px_rgba(61,43,31,0.16)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-cream dark:bg-night">
                  <Image
                    src={recipe.image}
                    alt={recipe.title[lang as "el" | "en"] ?? recipe.title.el}
                    fill
                    style={{ objectPosition: recipe.imagePosition ?? "center" }}
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-night/60 px-3 py-1.5 backdrop-blur-sm">
                    <Clock className="h-3.5 w-3.5 text-secondary" strokeWidth={2} />
                    <span className="font-body text-xs font-semibold text-cream">{recipe.time}</span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <span className="font-body text-[0.6875rem] font-semibold uppercase tracking-widest text-secondary">
                    {recipe.tag[lang as "el" | "en"] ?? recipe.tag.el}
                  </span>
                  <h3 className="mt-1.5 font-heading text-[1.15rem] font-semibold leading-snug text-bark dark:text-cream">
                    {recipe.title[lang as "el" | "en"] ?? recipe.title.el}
                  </h3>
                  <p className="mt-2 font-body text-xs leading-relaxed text-bark/55 dark:text-cream/50 line-clamp-2">
                    {recipe.lede[lang as "el" | "en"] ?? recipe.lede.el}
                  </p>

                  <span className="mt-4 inline-flex w-fit items-center gap-1.5 font-body text-xs font-semibold text-secondary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {lang === "el" ? "Δες την εκτέλεση" : "See the method"}
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}