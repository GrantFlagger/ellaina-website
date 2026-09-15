"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Check } from "lucide-react";
import { PRODUCT_SIZES, dbProductToSize, type ProductSize, type DbProduct } from "@/lib/products";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { translations } from "@/lib/translations";
import { insforge } from "@/lib/insforge";

const headerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
};

const fadeUp = {
  hidden:  { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const gridContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const cardVariant = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" as const } },
};

export default function Products() {
  const { lang } = useLanguage();
  const t = translations[lang].products;
  const [sizes, setSizes] = useState<ProductSize[]>(PRODUCT_SIZES);

  useEffect(() => {
    let cancelled = false;

    insforge.database
      .from("products")
      .select("id, slug, name, volume, price, currency, descriptor, image, in_stock, sort_order")
      .eq("in_stock", true)
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (cancelled || error || !data || data.length === 0) return;
        setSizes((data as DbProduct[]).map(dbProductToSize));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      id="products"
      className="bg-white dark:bg-night-surface py-24 lg:py-32"
      aria-label="Our Collection"
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
            className="font-heading text-balance text-3xl font-bold leading-tight tracking-tight text-bark dark:text-cream sm:text-4xl lg:text-[2.6rem]"
          >
            {t.heading}
          </motion.h2>
          <motion.div variants={fadeUp} className="mt-6 h-px w-12 bg-secondary" />
          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-xl font-body text-[0.9375rem] leading-relaxed text-bark/60 dark:text-cream/55"
          >
            {t.description}
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:gap-8"
          variants={gridContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {sizes.map((size) => (
            <ProductCard key={size.id} size={size} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}

function ProductCard({ size }: { size: ProductSize }) {
  const { lang } = useLanguage();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const t = translations[lang].products;
  const shopT = translations[lang].shop;
  const itemT = (t.items as Record<string, { name: string; descriptor: string }>)[size.id];
  const name       = size.name[lang];
  const descriptor = itemT?.descriptor || size.descriptor;

  const handleAdd = (e: React.MouseEvent) => {
    // Prevent the click from bubbling up to the card's Link and navigating away.
    e.preventDefault();
    e.stopPropagation();
    addItem(size, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div variants={cardVariant}>
      <Link
        href={`/shop/${size.id}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-light/80 dark:border-white/8 bg-white dark:bg-night-subtle shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_18px_52px_-8px_rgba(61,43,31,0.16)]"
      >
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-cream dark:bg-night">
          {size.image ? (
            <Image
              src={size.image}
              alt={`Ellaina Extra Virgin Olive Oil ${size.volume}`}
              fill
              className="object-contain p-6 transition-transform duration-500 group-hover:scale-[1.05]"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3">
              <Image
                src="/images/logo-drop.png"
                alt=""
                width={64}
                height={80}
                className="opacity-25"
                aria-hidden
              />
              <span className="font-body text-[0.65rem] font-semibold uppercase tracking-widest text-bark/25 dark:text-cream/25">
                {t.photoComingSoon}
              </span>
            </div>
          )}
          <div aria-hidden className="absolute inset-0 shadow-[inset_0_0_24px_rgba(61,43,31,0.05)]" />
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-heading text-[1.05rem] font-semibold leading-snug text-bark dark:text-cream">
            {name}
          </h3>
          <p className="mt-0.5 font-body text-xs font-semibold uppercase tracking-widest text-bark/35 dark:text-cream/35">
            {size.volume}
          </p>
          <p className="mt-2 font-body text-xs leading-relaxed text-bark/55 dark:text-cream/50 line-clamp-2">
            {descriptor}
          </p>

          <div className="mt-auto">
            <div className="mt-4 flex items-center justify-between border-t border-light/60 dark:border-white/8 pt-4">
              <span className="font-heading text-lg font-bold text-primary dark:text-secondary">{size.price}</span>
            </div>
            <button
              onClick={handleAdd}
              className={["mt-4 flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-[0.8125rem] font-semibold tracking-wide transition-all duration-200 active:scale-[0.97]",
                added ? "bg-primary text-white" : "bg-secondary text-bark hover:bg-secondary-600 hover:text-white",
              ].join(" ")}
            >
              {added ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> : <ShoppingCart className="h-3.5 w-3.5" strokeWidth={2.2} />}
              {added ? shopT.added : t.orderNow}
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}