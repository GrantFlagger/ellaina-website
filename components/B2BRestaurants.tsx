"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import RestaurantInquiryForm from "@/components/RestaurantInquiryForm";
import Image from "next/image";

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

export default function B2BRestaurants() {
  const { lang } = useLanguage();
  const l = lang as "el" | "en";

  const copy =
    l === "el"
      ? {
          eyebrow: "Για Εστιατόρια",
          heading: "Το ελαιόλαδο του τραπεζιού σας.\nΗ υπογραφή του εστιατορίου σας.",
          intro:
            "Ένα πραγματικά ξεχωριστό εστιατόριο προσέχει κάθε λεπτομέρεια. Από την πρώτη μπουκιά μέχρι την τελευταία πινελιά στο τραπέζι, κάθε στοιχείο αποτελεί μέρος της εμπειρίας του πελάτη. Γιατί λοιπόν το ελαιόλαδο να είναι απλώς ένα ακόμη μπουκάλι;",
          body1Heading: "Ένα premium ελαιόλαδο, σχεδιασμένο για εσάς",
          body1: "Με την Ellaina μπορείτε να προσφέρετε στους πελάτες σας ένα premium Extra Virgin Olive Oil, σχεδιασμένο ειδικά για το εστιατόριό σας. Μικρές, κομψές φιάλες ιδανικές για το τραπέζι, με την αισθητική της Ellaina και τη δυνατότητα να ενσωματώσουν το όνομα, το λογότυπο ή την ταυτότητα του εστιατορίου σας.",
          body2Heading: "Κάτι περισσότερο από συνοδευτικό",
          body2: "Ο πελάτης δεν βλέπει απλώς ένα μπουκάλι ελαιόλαδο στο τραπέζι — βλέπει το ελαιόλαδο του δικού σας εστιατορίου. Μια μικρή λεπτομέρεια που κάνει τη διαφορά.",
          body3Heading: "Εμείς αναλαμβάνουμε τα πάντα",
          body3: "Την επιλογή και τον έλεγχο του ελαιολάδου, τις αναλύσεις, την τυποποίηση, τη συσκευασία και την παράδοση. Εσείς επιλέγετε την αισθητική και την ποσότητα που ταιριάζει στο εστιατόριό σας.",
          brandLine1: "Ένα ελαιόλαδο που δεν σερβίρετε απλώς.",
          brandLine2: "Ένα ελαιόλαδο που σας αντιπροσωπεύει.",
          mockLabel: "Ellaina ×",
          mockPlaceholder: "[Το όνομα του εστιατορίου σας]",
          tagline: "Η ποιότητα στο τραπέζι. Η ταυτότητα στο μπουκάλι.",
          formLabel: "Ενδιαφέρεσαι;",
          formHeading: "Ζήτησε μια πρόταση για το εστιατόριό σου",
        }
      : {
          back: "Back to B2B",
          eyebrow: "For Restaurants",
          heading: "The oil on your table.\nThe signature of your restaurant.",
          intro:
            "A truly distinctive restaurant pays attention to every detail. From the first bite to the last touch on the table, every element is part of the guest's experience. So why should the olive oil be just another bottle?",
          body1Heading: "A premium oil, designed for you",
          body1: "With Ellaina you can offer your guests a premium Extra Virgin Olive Oil, designed specifically for your restaurant. Small, elegant bottles ideal for the table, with Ellaina's aesthetic and the option to feature your restaurant's own name, logo, or identity.",
          body2Heading: "More than just a side item",
          body2: "The guest doesn't just see a bottle of olive oil on the table — they see your restaurant's own olive oil. A small detail that makes the difference.",
          body3Heading: "We handle everything",
          body3: "Selecting and checking the oil, the analyses, standardization, packaging, and delivery. You choose the aesthetic and the quantity that suits your restaurant.",
          brandLine1: "An olive oil you don't just serve.",
          brandLine2: "An olive oil that represents you.",
          mockLabel: "Ellaina ×",
          mockPlaceholder: "[Your restaurant's name]",
          tagline: "Quality on the table. Identity on the bottle.",
          formLabel: "Interested?",
          formHeading: "Request a proposal for your restaurant",
        };

  return (
    <div>
            {/* Hero — restaurant-table image with dark overlay */}
      <section className="relative flex min-h-[55vh] items-center overflow-hidden">
        <Image
          src="/images/restaurant-b2b.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-night/70 via-night/55 to-night/75" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8"
        >
          <motion.p variants={fadeUp} className="font-body text-xs font-semibold uppercase tracking-[0.26em] text-secondary">
            {copy.eyebrow}
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="mt-3 whitespace-pre-line font-heading text-balance text-3xl font-bold leading-[1.2] tracking-tight text-white sm:text-4xl"
          >
            {copy.heading}
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-6 max-w-xl font-body text-[0.9375rem] leading-[1.85] text-white/75">
            {copy.intro}
          </motion.p>
        </motion.div>
      </section>

      {/* Brand mockup panel */}
      <section className="bg-bark py-16 text-center lg:py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-md px-4"
        >
          <p className="font-heading text-2xl font-bold text-cream sm:text-3xl">
            {copy.mockLabel} <span className="italic text-secondary">{copy.mockPlaceholder}</span>
          </p>
          <div className="mx-auto mt-5 h-px w-12 bg-secondary/50" />
          <p className="mt-5 font-body text-sm uppercase tracking-[0.2em] text-cream/60">
            {copy.tagline}
          </p>
        </motion.div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="mx-auto flex max-w-3xl flex-col gap-14 px-4 sm:px-6 lg:px-8">
          {[
            { heading: copy.body1Heading, body: copy.body1 },
            { heading: copy.body2Heading, body: copy.body2 },
            { heading: copy.body3Heading, body: copy.body3 },
          ].map((block) => (
            <motion.div
              key={block.heading}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="font-heading text-xl font-bold text-bark dark:text-cream">{block.heading}</h2>
              <div className="mt-3 h-px w-8 bg-secondary/50" />
              <p className="mt-5 font-body text-[0.9375rem] leading-[1.85] text-bark/70 dark:text-cream/60">
                {block.body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16 text-center dark:bg-night-surface lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8"
        >
          <p className="font-heading text-lg font-bold leading-snug text-bark dark:text-cream">
            {copy.brandLine1}
            <br />
            {copy.brandLine2}
          </p>
        </motion.div>
      </section>

      {/* Dedicated restaurant inquiry form */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <p className="font-body text-xs font-semibold uppercase tracking-[0.26em] text-secondary">
              {copy.formLabel}
            </p>
            <h2 className="mt-3 font-heading text-xl font-bold text-bark dark:text-cream sm:text-2xl">
              {copy.formHeading}
            </h2>
          </motion.div>

          <div className="mt-8 rounded-2xl border border-light/80 bg-cream/40 p-6 dark:border-white/8 dark:bg-night sm:p-7">
            <RestaurantInquiryForm />
          </div>
        </div>
      </section>
    </div>
  );
}