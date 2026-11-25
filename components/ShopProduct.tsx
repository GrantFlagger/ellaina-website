"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Check } from "lucide-react";
import { PRODUCT_SIZES, type ProductSize } from "@/lib/products";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { translations } from "@/lib/translations";
import { PRODUCT_PURCHASES_ENABLED } from "@/lib/availability";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" as const } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

export default function ShopProduct() {
  const { lang } = useLanguage();
  const t = translations[lang].shop;

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <motion.div
        className="mb-12 flex flex-col items-center text-center"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <motion.p variants={fadeUp} className="mb-3 font-body text-xs font-semibold uppercase tracking-[0.26em] text-secondary">
          {t.collection}
        </motion.p>
        <motion.div variants={fadeUp} className="mt-5 h-px w-10 bg-secondary" />
      </motion.div>

      <motion.div
        className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
        initial="hidden"
        animate="visible"
      >
        {PRODUCT_SIZES.map((size) => (
          <SizeCard key={size.id} size={size} />
        ))}
      </motion.div>
    </section>
  );
}

// ── Size card ─────────────────────────────────────────────────────────────────

function SizeCard({ size }: { size: ProductSize }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { lang } = useLanguage();
  const { addItem } = useCart();
  const t = translations[lang];
  const shopT = t.shop;
  const itemT = (t.products.items as Record<string, { name: string; descriptor: string }>)[size.id];
  const name = size.name[lang];
  const descriptor = itemT?.descriptor || size.descriptor;

  const handleAdd = () => {
    addItem(size, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } } }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-light dark:border-white/8 bg-white dark:bg-night-subtle shadow-sm transition-shadow duration-300 hover:shadow-[0_12px_40px_-8px_rgba(61,43,31,0.14)]"
    >
      {/* Whole-card link — sits under everything; interactive controls below get a higher z-index so they stay clickable */}
      <Link href={`/shop/${size.id}`} className="absolute inset-0 z-0" aria-label={name} tabIndex={-1} />

      <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-cream dark:bg-night pointer-events-none">
        {size.image ? (
          <Image
            src={size.image}
            alt={`Ellaina ${size.volume}`}
            fill
            className="object-contain p-8 transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-primary/8">
            <Image
              src="/images/logo-drop.png"
              alt=""
              width={56}
              height={70}
              className="opacity-30"
              aria-hidden
            />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-4 p-6 pointer-events-none">
        <div>
          <h3 className="font-heading text-lg font-bold text-bark dark:text-cream transition-colors group-hover:text-primary dark:group-hover:text-secondary">
            {name}
            <span className="ml-2 font-body text-sm font-normal text-bark/45 dark:text-cream/40">({size.volume})</span>
          </h3>
          <p className="mt-1.5 font-body text-sm leading-relaxed text-bark/60 dark:text-cream/55">{descriptor}</p>
        </div>

        <div className="mt-auto flex flex-col items-start gap-4">
          <span className="font-heading text-2xl font-bold text-primary dark:text-secondary">{size.price}</span>

          {PRODUCT_PURCHASES_ENABLED ? (
            <div className="relative z-10 flex w-full items-center justify-between gap-3 pointer-events-auto">
              <div className="flex items-center overflow-hidden rounded-full border border-light dark:border-white/10 bg-cream dark:bg-night">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-9 w-9 items-center justify-center text-bark/60 dark:text-cream/50 hover:text-bark dark:hover:text-cream transition-colors" aria-label="Decrease">−</button>
                <span className="w-7 text-center font-body text-sm font-semibold text-bark dark:text-cream">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="flex h-9 w-9 items-center justify-center text-bark/60 dark:text-cream/50 hover:text-bark dark:hover:text-cream transition-colors" aria-label="Increase">+</button>
              </div>
              <button
                onClick={handleAdd}
                className={["flex items-center gap-2 rounded-full px-5 py-2.5 font-body text-sm font-semibold tracking-wide transition-all duration-300 active:scale-[0.97]", added ? "bg-primary text-white" : "bg-secondary text-bark hover:bg-secondary-600 hover:text-white"].join(" ")}
              >
                {added ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> : <ShoppingCart className="h-3.5 w-3.5" strokeWidth={2} />}
                {added ? shopT.added : shopT.addToCart}
              </button>
            </div>
          ) : (
            <Link
              href="/contact"
              className="relative z-10 inline-flex w-full items-center justify-center rounded-full bg-secondary px-5 py-2.5 font-body text-sm font-semibold tracking-wide text-bark transition-colors hover:bg-secondary-600 hover:text-white pointer-events-auto"
            >
              {lang === "el" ? "Επικοινωνία" : "Contact us"}
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}