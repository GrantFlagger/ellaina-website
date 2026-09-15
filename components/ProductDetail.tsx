"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Check, ChevronRight, ChevronLeft, Leaf, Award, Droplets, MapPin, FileCheck2 } from "lucide-react";
import { PRODUCT_SIZES, type ProductSize } from "@/lib/products";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { translations } from "@/lib/translations";

const TRUST_ICONS = [Droplets, Leaf, MapPin, Award] as const;

// Shared across all sizes — it's the same oil, just different packaging.
const CHEMICAL = [
  { index: "Acidity",        description: "Purity of Olive Oil",           value: "0.24",   limit: "≤ 0.80",  unit: "%"         },
  { index: "K268",           description: "Low value = high quality",       value: "0.140",  limit: "≤ 0.220", unit: ""          },
  { index: "K232",           description: "Low value = fresh",              value: "1.598",  limit: "≤ 2.500", unit: ""          },
  { index: "ΔK",             description: "Level of processing",            value: "-0.004", limit: "≤ 0.01",  unit: ""          },
  { index: "Peroxide Value", description: "Level of oxidation (rancidity)", value: "5.8",    limit: "≤ 20",    unit: "mEq O₂/kg" },
] as const;

const FLAVOR_PROFILE = [
  { key: "acidity", labelEl: "Οξύτητα",   labelEn: "Acidity", value: 3 },
  { key: "fruity",  labelEl: "Φρουτωδές", labelEn: "Fruity",  value: 8 },
  { key: "pungent", labelEl: "Πικάντικο", labelEn: "Pungent", value: 6 },
  { key: "bitter",  labelEl: "Πικρό",     labelEn: "Bitter",  value: 5 },
] as const;

type NutritionRow = { label: string; value: string; sub: boolean; highlight?: boolean };
const NUTRITION: NutritionRow[] = [
  { label: "Energy",               value: "3389 kJ / 824 kcal", sub: false },
  { label: "Fat",                  value: "91.6 g",             sub: false },
  { label: "– of which Saturates", value: "13 g",               sub: true  },
  { label: "– Monounsaturates",    value: "73 g",               sub: true  },
  { label: "– Polyunsaturates",    value: "5.3 g",              sub: true  },
  { label: "Carbohydrates",        value: "0 g",                sub: false },
  { label: "– of which Sugars",    value: "0 g",                sub: true  },
  { label: "Proteins",             value: "0 g",                sub: false },
  { label: "Salt",                 value: "0 g",                sub: false },
  { label: "Vitamin E",            value: "~12 mg (100% NRV*)", sub: false, highlight: true },
];

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" as const } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

export default function ProductDetail({ size }: { size: ProductSize }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { lang } = useLanguage();
  const { addItem } = useCart();
  const t = translations[lang].shop;
  const pt = translations[lang].products;
  const itemT = (pt.items as Record<string, { name: string; descriptor: string }>)[size.id];
  const name       = size.name[lang];
  const descriptor = itemT?.descriptor || size.descriptor;

  const currentIndex = PRODUCT_SIZES.findIndex((s) => s.id === size.id);
  const prevSize = PRODUCT_SIZES[(currentIndex - 1 + PRODUCT_SIZES.length) % PRODUCT_SIZES.length];
  const nextSize = PRODUCT_SIZES[(currentIndex + 1) % PRODUCT_SIZES.length];

  const handleAdd = () => {
    addItem(size, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <>
      {/* Solid backdrop strip so the fixed navbar always has a solid background here */}
      <div className="h-20 w-full bg-cream dark:bg-night md:h-24" aria-hidden />
    

      {/* Product overview */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20 xl:gap-28">

          {/* Image */}
          <motion.div
            key={size.id}
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div aria-hidden className="absolute -bottom-4 -right-4 h-full w-full rounded-2xl bg-secondary/12 lg:-bottom-5 lg:-right-5" />
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-white dark:bg-night-subtle shadow-[0_20px_60px_-12px_rgba(61,43,31,0.18)]">
              {size.image ? (
                <Image
                  src={size.image}
                  alt={`Ellaina Extra Virgin Olive Oil — ${size.volume}`}
                  fill
                  priority
                  className="object-contain p-8"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 bg-primary/8">
                  <Image
                    src="/images/logo-drop.png"
                    alt=""
                    width={72}
                    height={90}
                    className="opacity-30"
                    aria-hidden
                  />
                  <span className="font-body text-xs font-semibold uppercase tracking-widest text-bark/30 dark:text-cream/30">
                    {pt.photoComingSoon}
                  </span>
                </div>
              )}
              <Image
                src="/images/olive-branch-gold.png"
                alt=""
                width={100}
                height={100}
                className="absolute bottom-5 right-5 opacity-15 pointer-events-none select-none"
                aria-hidden
              />
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            key={size.id + "-text"}
            className="flex flex-col justify-center"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <motion.p variants={fadeUp} className="mb-3 font-body text-xs font-semibold uppercase tracking-[0.26em] text-secondary">
              {t.eyebrow}
            </motion.p>

            <motion.h1 variants={fadeUp} className="font-heading text-3xl font-bold leading-tight tracking-tight text-bark dark:text-cream sm:text-4xl lg:text-[2.6rem]">
              {name}
              <span className="ml-3 font-body text-lg font-medium text-bark/40 dark:text-cream/40">({size.volume})</span>
            </motion.h1>

            <motion.div variants={fadeUp} className="my-6 h-px w-12 bg-secondary" />

            <motion.p variants={fadeUp} className="font-body text-[0.9375rem] leading-[1.78] text-bark/70 dark:text-cream/65">
              {descriptor}
            </motion.p>

            {/* Trust badges */}
            <motion.div variants={fadeUp} className="mt-7 flex flex-wrap gap-2.5">
              {t.trustBadges.map((text, i) => {
                const Icon = TRUST_ICONS[i];
                return (
                  <span key={text} className="inline-flex items-center gap-1.5 rounded-full border border-secondary/30 bg-secondary/10 px-3.5 py-1.5 font-body text-[0.75rem] font-medium text-bark/75 dark:text-cream/70">
                    <Icon className="h-3.5 w-3.5 text-secondary" strokeWidth={1.8} aria-hidden />
                    {text}
                  </span>
                );
              })}
            </motion.div>

            {/* Flavor profile */}
            <motion.div variants={fadeUp} className="mt-8">
              <span className="font-body text-[0.6875rem] font-semibold uppercase tracking-widest text-bark/40 dark:text-cream/40">
                {lang === "el" ? "Γευστικό προφίλ" : "Flavor profile"}
              </span>
              <div className="mt-3 flex flex-col gap-3">
                {FLAVOR_PROFILE.map((row) => (
                  <div key={row.key} className="flex items-center gap-3">
                    <span className="w-24 shrink-0 font-body text-xs font-medium text-bark/70 dark:text-cream/60">
                      {lang === "el" ? row.labelEl : row.labelEn}
                    </span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-bark/10 dark:bg-cream/10">
                      <div className="h-full rounded-full bg-secondary" style={{ width: `${row.value * 10}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Price + quantity + add to cart */}
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-5">
              <span className="font-heading text-3xl font-bold text-primary dark:text-secondary">{size.price}</span>

              <div className="flex items-center overflow-hidden rounded-full border border-light dark:border-white/10 bg-cream dark:bg-night">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-10 w-10 items-center justify-center text-bark/60 dark:text-cream/50 hover:text-bark dark:hover:text-cream transition-colors" aria-label="Decrease">−</button>
                <span className="w-8 text-center font-body text-sm font-semibold text-bark dark:text-cream">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="flex h-10 w-10 items-center justify-center text-bark/60 dark:text-cream/50 hover:text-bark dark:hover:text-cream transition-colors" aria-label="Increase">+</button>
              </div>

              <button
                onClick={handleAdd}
                className={["flex items-center gap-2 rounded-full px-8 py-3.5 font-body text-sm font-semibold tracking-wide transition-all duration-200 active:scale-[0.97]",
                  added ? "bg-primary text-white" : "bg-secondary text-bark hover:bg-secondary-600 hover:text-white hover:shadow-lg",
                ].join(" ")}
              >
                {added ? <Check className="h-4 w-4" strokeWidth={2.5} /> : <ShoppingCart className="h-4 w-4" strokeWidth={2} />}
                {added ? t.added : t.addToCart}
              </button>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-5">
              <a
                href="#chemical-analysis"
                className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-bark/60 dark:text-cream/55 underline decoration-secondary/50 underline-offset-4 transition-colors hover:text-bark dark:hover:text-cream"
              >
                <FileCheck2 className="h-4 w-4 text-secondary" strokeWidth={1.8} />
                {lang === "el" ? "Δείτε το Lab Certificate" : "View Lab Certificate"}
              </a>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* Other sizes — prev/next style navigation between the three products */}
      <section className="bg-white dark:bg-night-surface py-16 lg:py-20 border-y border-light/70 dark:border-white/8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <span className="font-body text-xs font-semibold uppercase tracking-[0.26em] text-secondary">
              {lang === "el" ? "Άλλα μεγέθη" : "Other sizes"}
            </span>
            <div className="flex items-center gap-2">
              <Link
                href={`/shop/${prevSize.id}`}
                aria-label="Previous product"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-light dark:border-white/10 text-bark/60 dark:text-cream/50 transition-colors hover:text-bark dark:hover:text-cream hover:border-bark/30 dark:hover:border-white/25"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={2} />
              </Link>
              <Link
                href={`/shop/${nextSize.id}`}
                aria-label="Next product"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-light dark:border-white/10 text-bark/60 dark:text-cream/50 transition-colors hover:text-bark dark:hover:text-cream hover:border-bark/30 dark:hover:border-white/25"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={2} />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {[prevSize, nextSize].map((other) => {
              const otherName = other.name[lang];
              return (
                <Link
                  key={other.id}
                  href={`/shop/${other.id}`}
                  className="group flex items-center gap-4 rounded-2xl border border-light dark:border-white/8 bg-cream/40 dark:bg-night p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_36px_-10px_rgba(61,43,31,0.16)]"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white dark:bg-night-subtle">
                    {other.image ? (
                      <Image src={other.image} alt={otherName} fill className="object-contain p-2" sizes="80px" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Image src="/images/logo-drop.png" alt="" width={28} height={35} className="opacity-25" aria-hidden />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-heading text-sm font-bold text-bark dark:text-cream">{otherName} ({other.volume})</p>
                    <p className="mt-0.5 font-heading text-sm font-bold text-primary dark:text-secondary">{other.price}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-bark/30 dark:text-cream/30 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Chemical Analysis */}
      <section id="chemical-analysis" className="bg-cream dark:bg-night py-20 lg:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

          <motion.div
            className="mb-10 flex flex-col items-center text-center"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <motion.p variants={fadeUp} className="mb-3 font-body text-xs font-semibold uppercase tracking-[0.26em] text-secondary">
              {t.chemLabel}
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-heading text-2xl font-bold tracking-tight text-bark dark:text-cream sm:text-3xl">
              {t.chemHeading}
            </motion.h2>
            <motion.div variants={fadeUp} className="mt-5 h-px w-10 bg-secondary" />
            <motion.p variants={fadeUp} className="mt-5 max-w-lg font-body text-sm leading-relaxed text-bark/60 dark:text-cream/55">
              {t.chemNote}
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="overflow-hidden rounded-2xl border border-light dark:border-white/8 shadow-sm"
          >
            <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 bg-primary px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/75 sm:grid-cols-[1fr_1fr_auto_auto]">
              <span>Index</span>
              <span className="hidden sm:block">What it measures</span>
              <span className="text-right">Ellaina</span>
              <span className="text-right">EU Limit</span>
            </div>
            {CHEMICAL.map((row, i) => (
              <div key={row.index} className={["grid grid-cols-[1fr_auto_auto] items-center gap-x-4 px-6 py-4 sm:grid-cols-[1fr_1fr_auto_auto]", i % 2 === 0 ? "bg-white dark:bg-night-surface" : "bg-cream/50 dark:bg-night"].join(" ")}>
                <div>
                  <p className="font-body text-sm font-semibold text-bark dark:text-cream">{row.index}</p>
                  <p className="mt-0.5 font-body text-xs text-bark/50 dark:text-cream/45 sm:hidden">{row.description}</p>
                </div>
                <p className="hidden font-body text-xs text-bark/55 dark:text-cream/50 sm:block">{row.description}</p>
                <span className="text-right font-body text-sm font-bold text-primary dark:text-secondary">
                  {row.value}
                  {row.unit ? <span className="ml-0.5 text-[10px] font-normal text-bark/40 dark:text-cream/35">{row.unit}</span> : null}
                </span>
                <span className="text-right font-body text-xs text-bark/45 dark:text-cream/40">{row.limit}</span>
              </div>
            ))}
          </motion.div>

          <p className="mt-6 text-center font-body text-[0.75rem] leading-relaxed text-bark/45 dark:text-cream/40">
            {t.chemFootnote}
          </p>
        </div>
      </section>

      {/* Nutritional Information */}
      <section className="bg-white dark:bg-night-surface py-20 lg:py-28">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">

          <motion.div
            className="mb-10 flex flex-col items-center text-center"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <motion.p variants={fadeUp} className="mb-3 font-body text-xs font-semibold uppercase tracking-[0.26em] text-secondary">
              {t.nutLabel}
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-heading text-2xl font-bold tracking-tight text-bark dark:text-cream sm:text-3xl">
              {t.nutHeading}
            </motion.h2>
            <motion.div variants={fadeUp} className="mt-5 h-px w-10 bg-secondary" />
            <motion.p variants={fadeUp} className="mt-5 font-body text-sm text-bark/55 dark:text-cream/50">{t.nutPer}</motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="overflow-hidden rounded-2xl border border-light/80 dark:border-white/8 shadow-sm"
          >
            <div className="flex justify-between bg-primary px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
              <span>Component</span>
              <span>Amount</span>
            </div>
            {NUTRITION.map((row, i) => (
              <div
                key={row.label}
                className={[
                  "flex items-center justify-between px-6 py-3.5",
                  i % 2 === 0 ? "bg-white dark:bg-night-surface" : "bg-cream/40 dark:bg-night",
                  row.highlight ? "border-t border-secondary/30 bg-secondary/5 dark:bg-secondary/10" : "",
                ].join(" ")}
              >
                <span className={["font-body text-sm", row.sub ? "pl-4 italic text-bark/55 dark:text-cream/50" : "font-medium text-bark dark:text-cream", row.highlight ? "font-semibold text-primary dark:text-secondary not-italic" : ""].join(" ")}>
                  {row.label}
                </span>
                <span className={["font-body text-sm", row.highlight ? "font-bold text-primary dark:text-secondary" : "text-bark/75 dark:text-cream/70"].join(" ")}>
                  {row.value}
                </span>
              </div>
            ))}
          </motion.div>

          <p className="mt-5 text-center font-body text-[0.75rem] text-bark/40 dark:text-cream/35">
            {t.nutFootnote}
          </p>
        </div>
      </section>
    </>
  );
}