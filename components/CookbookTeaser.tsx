"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { RECIPES } from "@/lib/recipes";

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

export default function CookbookTeaser() {
  const { lang } = useLanguage();
  const featured = RECIPES.slice(0, 3);

  const copy =
    lang === "el"
      ? {
          label: "Από την κουζίνα της Ellaina",
          heading: "Πώς να το σερβίρεις",
          sub: "Το λάδι είναι φινίρισμα, όχι λίπος τηγανίσματος. Λίγες ιδέες για να το αφήσεις να μιλήσει.",
          cta: "Δες όλες τις συνταγές",
        }
      : {
          label: "From the Ellaina kitchen",
          heading: "How to serve it",
          sub: "Great oil is a finishing note, not a frying fat. A few ideas to let it speak.",
          cta: "See all recipes",
        };

  return (
    <section
      id="cookbook"
      className="bg-white dark:bg-night-surface py-24 lg:py-32"
      aria-label="Recipes"
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
            {copy.label}
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="font-heading text-balance text-3xl font-bold leading-tight tracking-tight text-bark dark:text-cream sm:text-4xl lg:text-[2.6rem]"
          >
            {copy.heading}
          </motion.h2>
          <motion.div variants={fadeUp} className="mt-6 h-px w-12 bg-secondary" />
          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-xl font-body text-[0.9375rem] leading-relaxed text-bark/60 dark:text-cream/55"
          >
            {copy.sub}
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:gap-8"
          variants={gridContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {featured.map((recipe) => (
            <motion.div key={recipe.id} variants={cardVariant}>
              <Link
                href={`/cookbook/${recipe.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-light/80 dark:border-white/8 bg-white dark:bg-night-subtle shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_18px_52px_-8px_rgba(61,43,31,0.16)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-cream dark:bg-night">
                  <Image
                    src={recipe.image}
                    alt={recipe.title[lang as "el" | "en"] ?? recipe.title.el}
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.05]"
                    sizes="(max-width: 640px) 100vw, 33vw"
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
                  <h3 className="mt-1.5 font-heading text-[1.1rem] font-semibold leading-snug text-bark dark:text-cream">
                    {recipe.title[lang as "el" | "en"] ?? recipe.title.el}
                  </h3>
                  <p className="mt-2 font-body text-xs leading-relaxed text-bark/55 dark:text-cream/50 line-clamp-2">
                    {recipe.lede[lang as "el" | "en"] ?? recipe.lede.el}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 flex justify-center"
        >
          <Link
            href="/cookbook"
            className="group inline-flex items-center gap-2 rounded-full border border-bark/20 px-7 py-3.5 font-body text-sm font-semibold text-bark transition-all duration-200 hover:border-secondary hover:bg-secondary/10 hover:text-secondary dark:border-cream/20 dark:text-cream dark:hover:border-secondary dark:hover:text-secondary"
          >
            {copy.cta}
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              strokeWidth={2}
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}