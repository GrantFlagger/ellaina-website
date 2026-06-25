"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

const INTERVAL_MS = 4000;

const slideVariants = {
  enter:  (dir: number) => ({ opacity: 0, x: dir * 64 }),
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir * -64,
    transition: { duration: 0.3, ease: "easeIn" as const },
  }),
};

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

export default function Testimonials() {
  const [current,   setCurrent]   = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused,  setIsPaused]  = useState(false);
  const { lang } = useLanguage();
  const t = translations[lang].testimonials;

  useEffect(() => {
    setCurrent(0);
  }, [lang]);

  useEffect(() => {
    if (isPaused) return;
    const id = setTimeout(() => {
      setDirection(1);
      setCurrent((c) => (c + 1) % t.items.length);
    }, INTERVAL_MS);
    return () => clearTimeout(id);
  }, [current, isPaused, t.items.length]);

  const navigate = (index: number, dir: number) => {
    setDirection(dir);
    setCurrent(index);
  };

  const handlePrev = () =>
    navigate((current - 1 + t.items.length) % t.items.length, -1);

  const handleNext = () =>
    navigate((current + 1) % t.items.length, 1);

  const handleDotClick = (i: number) =>
    navigate(i, i > current ? 1 : -1);

  return (
    <section
      id="testimonials"
      className="bg-cream dark:bg-night py-24 lg:py-32"
      aria-label="Testimonials"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <motion.div
          className="mb-14 flex flex-col items-center text-center"
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
          <motion.div
            variants={fadeUp}
            className="mt-6 h-px w-12 bg-secondary"
          />
        </motion.div>

        <div className="mx-auto max-w-2xl">
          <div className="relative min-h-[280px] overflow-hidden sm:min-h-[240px]">
            <AnimatePresence custom={direction} initial={false}>
              {t.items.map((item, i) =>
                i === current ? (
                  <motion.blockquote
                    key={i}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-x-0 top-0 flex flex-col items-center px-2 text-center sm:px-6"
                    aria-live="polite"
                  >
                    <span
                      aria-hidden
                      className="mb-1 select-none font-heading text-[5rem] leading-none text-secondary/30"
                    >
                      &#8220;
                    </span>

                    <p className="font-heading text-xl italic leading-relaxed text-bark dark:text-cream sm:text-2xl">
                      {item.quote}
                    </p>

                    <div className="my-6 h-px w-8 bg-secondary" aria-hidden />

                    <footer className="font-body">
                      <cite className="not-italic">
                        <span className="text-sm font-semibold text-bark dark:text-cream">
                          {item.author}
                        </span>
                        <span className="mx-2 text-bark/30 dark:text-cream/30" aria-hidden>·</span>
                        <span className="text-sm text-bark/55 dark:text-cream/50">{item.role}</span>
                      </cite>
                    </footer>
                  </motion.blockquote>
                ) : null
              )}
            </AnimatePresence>
          </div>

          <div className="mt-6 flex items-center justify-center gap-5">
            <button
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-bark/20 dark:border-cream/20 text-bark/45 dark:text-cream/45 transition-all duration-150 hover:border-secondary hover:text-secondary active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.8} />
            </button>

            <div
              className="flex items-center gap-2"
              role="tablist"
              aria-label="Testimonial navigation"
            >
              {t.items.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === current}
                  aria-label={`Go to testimonial ${i + 1}`}
                  onClick={() => handleDotClick(i)}
                  className="flex items-center justify-center py-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded"
                >
                  <motion.span
                    className={`block h-1.5 rounded-full ${
                      i === current ? "bg-secondary" : "bg-bark/25 dark:bg-cream/25"
                    }`}
                    animate={{ width: i === current ? 24 : 8 }}
                    transition={{ duration: 0.3, ease: "easeOut" as const }}
                  />
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              aria-label="Next testimonial"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-bark/20 dark:border-cream/20 text-bark/45 dark:text-cream/45 transition-all duration-150 hover:border-secondary hover:text-secondary active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
