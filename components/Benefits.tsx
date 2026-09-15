"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

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
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.05 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

const underline = {
  hidden:  { width: 0 },
  visible: { width: "2.25rem", transition: { duration: 0.7, ease: "easeOut" as const, delay: 0.25 } },
};

const CARD_META = [
  { key: "health", icon: "/images/heart.png", delay: 0,   size: 56 },
  { key: "beauty", icon: "/images/woman.png", delay: 0.4, size: 56 },
  { key: "ritual", icon: "/images/shot.png",  delay: 0.8, size: 68 },
] as const;

export default function Benefits() {
  const { lang } = useLanguage();
  const l = lang as "el" | "en";

  const copy =
    l === "el"
      ? {
          label: "Πέρα από τη γεύση",
          heading: "Το ταξίδι μιας σταγόνας",
          sub: "Από το χωράφι στην καρδιά σου, στο δέρμα σου, στο πιάτο σου.",
          cards: {
            health: {
              eyebrow: "Υγεία",
              watermark: "ΥΓΕΙΑ",
              title: "Καλό για την καρδιά σου",
              body: "Πλούσιο σε μονοακόρεστα λιπαρά, στηρίζει την καρδιαγγειακή υγεία. Γεμάτο πολυφαινόλες και βιταμίνη Ε — φυσική ασπίδα ενάντια στο οξειδωτικό στρες.",
            },
            beauty: {
              eyebrow: "Ομορφιά",
              watermark: "ΟΜΟΡΦΙΑ",
              title: "Το μυστικό ομορφιάς της Μεσογείου",
              body: "Στο δέρμα, ενυδατώνει και προστατεύει από τα σημάδια του χρόνου. Στα μαλλιά, λειτουργεί ως παραδοσιακή θρεπτική μάσκα.",
            },
            ritual: {
              eyebrow: "Τελετουργία",
              watermark: "ΞΗΜΕΡΩΜΑ",
              title: "Το πρωινό σου ελιξίριο",
              body: "Μια κουταλιά Ellaina με χυμό λεμονιού, με άδειο στομάχι — ένα φυσικό «beauty shot» πριν τον καφέ σου.",
            },
          },
        }
      : {
          label: "Beyond the taste",
          heading: "The journey of a drop",
          sub: "From the grove to your heart, your skin, your plate.",
          cards: {
            health: {
              eyebrow: "Health",
              watermark: "HEALTH",
              title: "Good for your heart",
              body: "Rich in heart-friendly monounsaturated fats, supporting cardiovascular health. Packed with polyphenols and vitamin E — a natural shield against oxidative stress.",
            },
            beauty: {
              eyebrow: "Beauty",
              watermark: "BEAUTY",
              title: "The Mediterranean's beauty secret",
              body: "On skin, it hydrates and protects against everyday signs of aging. On hair, it works as a traditional nourishing mask.",
            },
            ritual: {
              eyebrow: "Ritual",
              watermark: "DAWN",
              title: "Your morning elixir",
              body: "A spoonful of Ellaina with lemon juice, on an empty stomach — a natural \"beauty shot\" before your coffee.",
            },
          },
        };

  return (
    <section className="bg-cream dark:bg-night py-24 lg:py-32" aria-label="Benefits">
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
          className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:gap-7"
          variants={gridContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {CARD_META.map(({ key, icon, delay, size }) => {
            const card = copy.cards[key as keyof typeof copy.cards];
            return (
              <motion.div
                key={key}
                variants={cardVariant}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-light/70 dark:border-white/8 bg-white dark:bg-night-subtle p-8 shadow-[0_10px_32px_-14px_rgba(61,43,31,0.12)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_50px_-16px_rgba(61,43,31,0.2)] lg:p-9"
              >
                {/* soft ambient glow on hover, echoes the Sustainability section */}
                <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-secondary/[0.07] blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-3 select-none whitespace-nowrap text-center font-heading text-[2.25rem] font-bold italic leading-none text-secondary/[0.09] sm:text-[2.6rem]"
                >
                  {card.watermark}
                </span>

                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay }}
                  className="relative z-10 mt-5 flex h-14 items-end"
                >
                  <Image
                    src={icon}
                    alt=""
                    width={size}
                    height={size}
                    style={{ width: size, height: size }}
                    className="max-h-14 object-contain object-bottom"
                    aria-hidden
                  />
                </motion.div>

                <p className="relative z-10 mt-6 font-body text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-secondary">
                  {card.eyebrow}
                </p>

                <h3 className="relative z-10 mt-1.5 font-heading text-lg font-bold leading-snug text-bark dark:text-cream lg:text-xl">
                  {card.title}
                </h3>

                <motion.div variants={underline} className="relative z-10 mt-3.5 h-px bg-secondary/45" />

                <p className="relative z-10 mt-4 font-body text-[0.875rem] leading-[1.75] text-bark/65 dark:text-cream/60">
                  {card.body}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}