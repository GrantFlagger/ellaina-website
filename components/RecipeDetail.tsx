"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Users, Droplets } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { Recipe } from "@/lib/recipes";
import Image from "next/image";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

export default function RecipeDetail({ recipe }: { recipe: Recipe }) {
  const { lang } = useLanguage();
  const l = lang as "el" | "en";

  const backLabel = lang === "el" ? "Όλες οι συνταγές" : "All recipes";
  const ingredientsLabel = lang === "el" ? "Υλικά" : "Ingredients";
  const methodLabel = lang === "el" ? "Εκτέλεση" : "Method";
  const shopCta = lang === "el" ? "Αγόρασε Ellaina" : "Shop Ellaina";

  return (
    <article>
      {/* Hero */}
      <div className="relative aspect-[16/10] w-full sm:aspect-[21/9]">
        <Image
          src={recipe.image}
          alt={recipe.title[l] ?? recipe.title.el}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-night/80 via-night/20 to-transparent"
        />

        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-4xl px-4 pb-10 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={container}>
            <motion.div variants={fadeUp}>
              <Link
                href="/cookbook"
                className="mb-5 inline-flex items-center gap-2 font-body text-sm font-medium text-cream/80 transition-colors hover:text-cream"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={2} />
                {backLabel}
              </Link>
            </motion.div>
            <motion.span
              variants={fadeUp}
              className="mb-3 inline-block rounded-full bg-secondary/20 px-3 py-1 font-body text-[0.6875rem] font-semibold uppercase tracking-widest text-secondary ring-1 ring-secondary/30"
            >
              {recipe.tag[l] ?? recipe.tag.el}
            </motion.span>
            <motion.h1
              variants={fadeUp}
              className="font-heading text-balance text-3xl font-bold leading-tight text-cream sm:text-4xl lg:text-5xl"
            >
              {recipe.title[l] ?? recipe.title.el}
            </motion.h1>
          </motion.div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl font-body text-lg leading-relaxed text-bark/75 dark:text-cream/70"
        >
          {recipe.lede[l] ?? recipe.lede.el}
        </motion.p>

        {/* Meta strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-light py-5 dark:border-white/10"
        >
          <div className="flex items-center gap-2 font-body text-sm text-bark/70 dark:text-cream/60">
            <Clock className="h-4 w-4 text-secondary" strokeWidth={1.8} />
            {recipe.time}
          </div>
          <div className="flex items-center gap-2 font-body text-sm text-bark/70 dark:text-cream/60">
            <Users className="h-4 w-4 text-secondary" strokeWidth={1.8} />
            {recipe.servings[l] ?? recipe.servings.el}
          </div>
          <div className="flex items-center gap-2 font-body text-sm font-semibold text-secondary">
            <Droplets className="h-4 w-4" strokeWidth={1.8} />
            {recipe.tip[l] ?? recipe.tip.el}
          </div>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* Ingredients */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-xl font-bold text-bark dark:text-cream">
              {ingredientsLabel}
            </h2>
            <ul className="mt-5 flex flex-col">
              {recipe.ingredients.map((ing) => (
                <li
                  key={ing.el}
                  className="flex items-center justify-between border-b border-light/70 py-3 font-body text-sm text-bark/75 last:border-0 dark:border-white/8 dark:text-cream/65"
                >
                  <span>{ing[l] ?? ing.el}</span>
                  <span className="font-semibold text-secondary">{ing.q[l] ?? ing.q.el}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/shop"
              className="group mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-secondary px-6 py-3 font-body text-sm font-semibold text-bark transition-colors hover:bg-secondary-600 hover:text-white"
            >
              {shopCta}
            </Link>
          </motion.div>

          {/* Method */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 className="font-heading text-xl font-bold text-bark dark:text-cream">
              {methodLabel}
            </h2>
            <ol className="mt-5 flex flex-col gap-6">
              {recipe.steps.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary/12 font-heading text-sm font-bold text-secondary ring-1 ring-secondary/25">
                    {i + 1}
                  </span>
                  <p className="pt-1 font-body text-[0.9375rem] leading-relaxed text-bark/75 dark:text-cream/70">
                    {step[l] ?? step.el}
                  </p>
                </li>
              ))}
            </ol>
          </motion.div>
        </div>
      </div>
    </article>
  );
}
