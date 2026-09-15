"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden:  { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: "easeOut" as const },
  },
};

// Six "natural advantage" factors, each with its own PNG icon in /public/images.
const ADVANTAGES = [
  {
    key: "sun",
    icon: "/images/sun.png",
    titleEl: "Άφθονος Ήλιος",
    titleEn: "Abundant Sunlight",
    bodyEl: "Πάνω από 2.500 ώρες ηλιοφάνειας τον χρόνο εξασφαλίζουν ιδανική ωρίμανση και πλούσια ανάπτυξη πολυφαινολών.",
    bodyEn: "Over 2,500 hours of sunshine each year ensure optimal ripening and rich phenolic development.",
  },
  {
    key: "wind",
    icon: "/images/wind.png",
    titleEl: "Θαλασσινό Αεράκι",
    titleEn: "Sea Breeze",
    bodyEl: "Δροσερά ρεύματα από το Ιόνιο ρυθμίζουν φυσικά τη θερμοκρασία και προστατεύουν τα δέντρα.",
    bodyEn: "Cool winds from the Ionian Sea moderate temperatures and protect the trees naturally.",
  },
  {
    key: "mountain",
    icon: "/images/mountain.png",
    titleEl: "Ορεινό Μικροκλίμα",
    titleEn: "Mountain Microclimate",
    bodyEl: "Οι λόφοι της Ηπείρου δημιουργούν ένα προστατευμένο, σταθερό κλίμα γύρω από τους ελαιώνες.",
    bodyEn: "The hills of Epirus create a sheltered, stable climate around the groves.",
  },
  {
    key: "olives",
    icon: "/images/olives.png",
    titleEl: "Ποικιλία Κορωνέικη",
    titleEn: "Koroneiki Variety",
    bodyEl: "Απόλυτα προσαρμοσμένη σε αυτό το έδαφος, δίνει λάδι με έντονη φρουτώδη γεύση και υψηλά αντιοξειδωτικά.",
    bodyEn: "Perfectly adapted to this environment, gives oil with intense fruitiness and high antioxidants.",
  },
  {
    key: "people",
    icon: "/images/people.png",
    titleEl: "Οικογενειακή Φροντίδα",
    titleEn: "Family Care",
    bodyEl: "Κάθε δέντρο φροντίζεται από τα ίδια χέρια εδώ και γενιές — καμία διαδικασία δεν είναι αυτοματοποιημένη.",
    bodyEn: "Every tree is tended by the same hands for generations — nothing here is automated.",
  },
  {
    key: "water",
    icon: "/images/water.png",
    titleEl: "Ισορροπημένη Βροχή",
    titleEn: "Balanced Rainfall",
    bodyEl: "Οι χειμερινές βροχές θρέφουν το χώμα, ενώ τα ξηρά καλοκαίρια συμπυκνώνουν το άρωμα στον καρπό.",
    bodyEn: "Winter rainfall nourishes the land, while dry summers concentrate the aroma in the fruit.",
  },
] as const;

const RESULT_POINTS = [
  { el: "Πλούσιο σε φυσικά αντιοξειδωτικά", en: "High in natural antioxidants" },
  { el: "Υψηλή περιεκτικότητα σε πολυφαινόλες", en: "Rich in polyphenols" },
  { el: "Χαμηλή οξύτητα", en: "Low acidity" },
  { el: "Έντονο άρωμα και φρουτώδης γεύση", en: "Intense aroma & fruity taste" },
  { el: "Ισορροπημένο, απαλό, χαρακτηριστικό", en: "Balanced, smooth, distinctive" },
] as const;

export default function WhyEllaina() {
  const { lang } = useLanguage();
  const l = lang as "el" | "en";

  return (
    <section
      id="why-ellaina"
      className="bg-white dark:bg-night-surface py-24 lg:py-32"
      aria-label="Why Ellaina"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-16 flex flex-col items-center text-center lg:mb-20"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.p
            variants={fadeUp}
            className="mb-4 font-body text-xs font-semibold uppercase tracking-[0.26em] text-secondary"
          >
            {l === "el" ? "Γιατί Ellaina" : "Why Ellaina"}
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="font-heading text-balance max-w-xl text-3xl font-bold leading-[1.15] tracking-tight text-bark dark:text-cream sm:text-4xl lg:text-[2.6rem]"
          >
            {l === "el" ? "Το Φυσικό Πλεονέκτημα" : "The Natural Advantage"}
          </motion.h2>
          <motion.div variants={fadeUp} className="mt-6 h-px w-12 bg-secondary" />
          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-lg font-body text-[0.9375rem] leading-relaxed text-bark/60 dark:text-cream/55"
          >
            {l === "el"
              ? "Ο ιδανικός συνδυασμός κλίματος, εδάφους και τοπίου δημιουργεί τις τέλειες συνθήκες για εξαιρετικό ελαιόλαδο."
              : "The ideal combination of climate, soil, and landscape creates the perfect conditions for exceptional olive oil."}
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-14 lg:grid-cols-[1fr_260px] lg:gap-0"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {/* Advantage cards — bare icon (no frame) sits half inside / half
              outside the card's top edge. Extra top margin on the grid
              (pt-8) and a taller row gap (gap-y-16) leave enough room so
              the bigger icons and the second row never overlap the first. */}
          <div className="grid grid-cols-1 gap-x-6 gap-y-16 pt-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:pr-10">
            {ADVANTAGES.map((item) => (
              <motion.div
                key={item.key}
                variants={fadeUp}
                className="group relative flex flex-col items-center rounded-2xl border border-light/80 bg-white pt-12 pb-7 px-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_-16px_rgba(61,43,31,0.22)] dark:border-white/8 dark:bg-night-subtle"
              >
                <div className="absolute left-1/2 top-0 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center transition-transform duration-300 ease-out group-hover:scale-110">
                  <Image
                    src={item.icon}
                    alt=""
                    width={96}
                    height={96}
                    className="h-24 w-24 object-contain"
                    aria-hidden
                  />
                </div>
                <h3 className="mt-2 font-heading text-[0.9375rem] font-bold leading-snug text-bark dark:text-cream">
                  {l === "el" ? item.titleEl : item.titleEn}
                </h3>
                <p className="mt-1.5 font-body text-xs leading-relaxed text-bark/60 dark:text-cream/55">
                  {l === "el" ? item.bodyEl : item.bodyEn}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Result — plain column separated by a divider, no card/panel */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col border-t border-light pt-10 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0 dark:border-white/10"
          >
            <p className="font-body text-xs font-semibold uppercase tracking-[0.26em] text-secondary">
              {l === "el" ? "Το Αποτέλεσμα" : "The Result"}
            </p>
            <h3 className="mt-3 font-heading text-lg font-bold leading-snug text-bark dark:text-cream">
              {l === "el"
                ? "Έξτρα παρθένο ελαιόλαδο εξαιρετικής ποιότητας"
                : "Extra virgin olive oil of exceptional quality"}
            </h3>
            <div className="mt-4 h-px w-10 bg-secondary/45" />

            <ul className="mt-6 flex flex-col gap-4">
              {RESULT_POINTS.map((point) => (
                <li key={point.en} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary" strokeWidth={2.2} />
                  <span className="font-body text-[0.875rem] leading-relaxed text-bark/70 dark:text-cream/60">
                    {l === "el" ? point.el : point.en}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}