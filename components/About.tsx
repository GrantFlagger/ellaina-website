"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: "easeOut" as const },
  },
};

export default function About() {
  const { lang } = useLanguage();
  const l = lang as "el" | "en";
  const t = translations[lang].about;

  // Each beat has a base image and a second image that crossfades in on
  // hover — same "swap on hover" pattern for all three, just different
  // image pairs.
  const beats = [
    {
      title: t.beat1Title,
      text: t.p1,
      image: "/images/map1.png",
      hoverImage: "/images/map2.png",
      alt: "Map of the olive-growing region around Preveza",
    },
    {
      title: t.beat2Title,
      text: t.p2,
      image: "/images/kthma.png",
      hoverImage: "/images/hand-olive.png",
      alt: "Our olive grove and the hands that tend it",
    },
    {
      title: t.beat3Title,
      text: t.p3,
      image: "/images/el-bottle.png",
      hoverImage: "/images/oil-droping.png",
      alt: "A bottle of Ellaina, and the oil it pours",
    },
  ];

  return (
    <section
      id="our-story"
      className="bg-cream dark:bg-night py-24 lg:py-32"
      aria-label="Our values"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-20 lg:mb-28"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            variants={fadeUp}
            className="mb-4 font-body text-xs font-semibold uppercase tracking-[0.26em] text-secondary"
          >
            {lang === "el" ? "Οι αξίες μας" : "Our values"}
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="font-heading text-balance max-w-2xl text-3xl font-bold leading-[1.15] tracking-tight text-bark dark:text-cream sm:text-4xl lg:text-[2.9rem]"
          >
            {t.heading}
          </motion.h2>
          <motion.div variants={fadeUp} className="mt-6 h-px w-12 bg-secondary" />
        </motion.div>

        <div className="flex flex-col gap-16 lg:gap-24">
          {beats.map((beat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.75, ease: "easeOut" }}
              className={`grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16 ${
                i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              {/* Image pair — base image visible by default, hover image
                  crossfades in on :hover via opacity, both stacked with fill */}
              <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl shadow-[0_20px_50px_-16px_rgba(61,43,31,0.25)]">
                <Image
                  src={beat.image}
                  alt={beat.alt}
                  fill
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
                <Image
                  src={beat.hoverImage}
                  alt=""
                  fill
                  aria-hidden
                  className="object-cover object-center opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
              </div>

              <div className="flex flex-col">
                <h3 className="font-heading text-xl font-bold text-bark dark:text-cream lg:text-[1.4rem]">
                  {beat.title}
                </h3>
                <div className="mt-3 h-px w-8 bg-secondary/50" />
                <p className="mt-5 font-body text-[1.0625rem] leading-[1.85] text-bark/75 dark:text-cream/70">
                  {beat.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}