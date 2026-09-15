"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import B2BInquiryForm from "@/components/B2BInquiryForm";

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.09 } } };

export default function B2B() {
    const { lang } = useLanguage();
    const l = lang as "el" | "en";

    const copy =
        l === "el"
            ? {
                heroEyebrow: "Για Παραγωγούς & Επιχειρήσεις",
                heroHeading: "Εσύ φέρνεις το ελαιόλαδο.\nΕμείς αναλαμβάνουμε τα υπόλοιπα.",
                heroSub:
                    "Έχεις εξαιρετικό ελαιόλαδο και θέλεις να το διαθέσεις σε επιχειρήσεις, ξενοδοχεία, εστιατόρια ή πελάτες στην Ελλάδα και το εξωτερικό; Δεν χρειάζεται να χτίσεις μόνος σου μια ολόκληρη υποδομή.",
                heroCta: "Επικοινώνησε μαζί μας",

                stepsLabel: "Πώς Δουλεύει",
                steps: [
                    {
                        title: "Ένας συνεργάτης για όλη τη διαδικασία",
                        body: "Άδειες, τυποποίηση, χημικές αναλύσεις, φιάλες, ετικέτες, συσκευασία, μεταφορές — όλη η απαραίτητη διαδικασία μπορεί εύκολα να μετατραπεί σε χρόνο, κόστος και γραφειοκρατία. Εσύ φέρνεις τον πελάτη. Εμείς φροντίζουμε το ελαιόλαδό σου να φτάσει σε αυτόν, σωστά συσκευασμένο και έτοιμο για την αγορά.",
                    },
                    { title: "Χημικές & οργανοληπτικές αναλύσεις", body: "Ελέγχουμε την ποιότητα και τα χαρακτηριστικά του ελαιολάδου σου." },
                    { title: "Τυποποίηση & συσκευασία", body: "Αναλαμβάνουμε την εμφιάλωση και τυποποίηση μέσω συνεργαζόμενων εγκαταστάσεων." },
                    { title: "Φιάλες & ετικέτες", body: "Από την επιλογή της συσκευασίας μέχρι την τελική εμφάνιση του προϊόντος." },
                    { title: "Branding", body: "Αξιοποιείς το brand της Ellaina και την υπάρχουσα υποδομή μας, χωρίς να χτίσεις ένα brand από το μηδέν." },
                    { title: "Logistics & μεταφορές", body: "Οργανώνουμε τη μεταφορά και την παράδοση, χωρίς να συντονίζεις εσύ κάθε στάδιο." },
                    { title: "Χωρίς ελάχιστη ποσότητα", body: "Δεν υπάρχει ελάχιστος αριθμός φιαλών. Μπορείς να μας εμπιστευτείς ακόμη και μια μικρή παραγγελία, ή να δοκιμάσεις μια νέα αγορά χωρίς να δεσμευτείς με μεγάλη παραγωγή." },
                    { title: "Από την Ελλάδα μέχρι την Αμερική", body: "Διαθέτουμε FDA registration, επιτρέποντας τη διαχείριση αποστολών ελαιολάδου προς την αγορά των Ηνωμένων Πολιτειών, σύμφωνα με τις απαιτούμενες διαδικασίες." },
                ],

                modelLabel: "Το Μοντέλο Συνεργασίας",
                modelHeading: "Απλό, ξεκάθαρο, χωρίς περιττή γραφειοκρατία",
                modelSteps: [
                    { title: "Εσύ", body: "Ελαιόλαδο & πελάτης" },
                    { title: "Ellaina", body: "Αναλύσεις, τυποποίηση, συσκευασία & logistics" },
                    { title: " Ο πελάτης σου", body: " Έτοιμο προϊόν" },
                ],
                modelFootnote: "Με ένα μικρό, ξεκάθαρο fee για την υπηρεσία μας.",

                restaurantsLabel: "Για Εστιατόρια",
                restaurantsHeading: "Το ελαιόλαδο του τραπεζιού σας. Η υπογραφή του εστιατορίου σας.",
                restaurantsBody: "Μικρές, κομψές φιάλες με το δικό σας όνομα και λογότυπο.",
                restaurantsCta: "Δείτε την πρόταση για εστιατόρια",

                formLabel: "Θέλεις να ξεκινήσεις;",
                formHeading: "Ας σχεδιάσουμε την επόμενη παρτίδα σου",
            }
            : {
                heroEyebrow: "For Producers & Businesses",
                heroHeading: "You bring the olive oil.\nWe handle the rest.",
                heroSub:
                    "Do you have excellent olive oil and want to sell it to businesses, hotels, restaurants, or customers in Greece and abroad? You don't need to build a whole infrastructure from scratch.",
                heroCta: "Get in touch",

                stepsLabel: "How It Works",
                steps: [
                    {
                        title: "One partner for the whole process",
                        body: "Licenses, standardization, chemical analyses, bottles, labels, packaging, shipping — it can easily turn into time, cost, and bureaucracy. You bring the customer. We make sure your olive oil reaches them, properly packaged and ready for market.",
                    },
                    { title: "Chemical & sensory analyses", body: "We check the quality and characteristics of your olive oil." },
                    { title: "Standardization & packaging", body: "We handle bottling and standardization through partner facilities." },
                    { title: "Bottles & labels", body: "From choosing the packaging to the final look of the product." },
                    { title: "Branding", body: "Use the Ellaina brand and our existing infrastructure, without building a brand from zero." },
                    { title: "Logistics & shipping", body: "We organize transport and delivery, so you don't coordinate every step yourself." },
                    { title: "No minimum quantity", body: "There's no minimum number of bottles. Trust us with even a small order, or test a new market without committing to large production." },
                    { title: "From Greece to America", body: "We hold FDA registration, allowing us to manage olive oil shipments to the United States market, in line with the required procedures." },
                ],

                modelLabel: "The Partnership Model",
                modelHeading: "Simple, clear, without unnecessary bureaucracy",
                modelSteps: [
                    { title: "You", body: "Olive oil & customer" },
                    { title: "Ellaina", body: "Analyses, standardization, packaging & logistics" },
                    { title: "Your customer", body: "Ready product" },
                ],
                modelFootnote: "With one small, clear fee for our service.",

                restaurantsLabel: "For Restaurants",
                restaurantsHeading: "The oil on your table. The signature of your restaurant.",
                restaurantsBody: "Small, elegant bottles with your own name and logo.",
                restaurantsCta: "See the offer for restaurants",

                formLabel: "Want to get started?",
                formHeading: "Let's plan your next batch",
            };

    return (
        <div>
            {/* Hero — industrial-vibe background image with dark overlay */}
            <section className="relative flex min-h-[65vh] items-center overflow-hidden">
                <Image
                    src="/images/b2b.png"
                    alt=""
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="100vw"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-night/50 via-night/40 to-night/55" />

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={stagger}
                    className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8"
                >
                    <motion.p variants={fadeUp} className="mb-4 font-body text-xs font-semibold uppercase tracking-[0.28em] text-secondary">
                        {copy.heroEyebrow}
                    </motion.p>
                    <motion.h1
                        variants={fadeUp}
                        className="whitespace-pre-line font-heading text-balance text-3xl font-bold leading-[1.2] tracking-tight text-white sm:text-4xl lg:text-5xl"
                    >
                        {copy.heroHeading}
                    </motion.h1>
                    <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-xl font-body text-base leading-relaxed text-white/70">
                        {copy.heroSub}
                    </motion.p>
                    <motion.div variants={fadeUp} className="mt-8">
                        <a
                            href="#partner-form"
                            className="inline-flex items-center gap-2 rounded-full bg-secondary px-7 py-3.5 font-body text-sm font-semibold text-bark transition-colors hover:bg-secondary-600 hover:text-white"
                        >
                            {copy.heroCta}
                            <ArrowRight className="h-4 w-4" strokeWidth={2} />
                        </a>
                    </motion.div>
                </motion.div>
            </section>

            {/* Steps — full-width, no border, background-only differentiation */}
            <section className="bg-white dark:bg-night-surface py-20 lg:py-28">
                <div className="w-full px-4 sm:px-8 lg:px-12">
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mb-12 text-center font-body text-xs font-semibold uppercase tracking-[0.26em] text-secondary"
                    >
                        {copy.stepsLabel}
                    </motion.p>

                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-60px" }}
                        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
                    >
                        {copy.steps.map((step, i) => (
                            <motion.div
                                key={step.title}
                                variants={fadeUp}
                                className="flex flex-col rounded-2xl bg-cream/70 p-6 dark:bg-white/[0.04]"
                            >
                                <span className="font-heading text-2xl font-bold text-secondary/40">
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <h3 className="mt-3 font-heading text-sm font-bold leading-snug text-bark dark:text-cream">
                                    {step.title}
                                </h3>
                                <p className="mt-2 font-body text-xs leading-relaxed text-bark/60 dark:text-cream/55">
                                    {step.body}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Partnership model — classic PowerPoint-style chevron process */}
            <section className="py-20 lg:py-28">
                <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.7 }}
                    >
                        <p className="font-body text-xs font-semibold uppercase tracking-[0.26em] text-secondary">
                            {copy.modelLabel}
                        </p>
                        <h2 className="mt-3 font-heading text-2xl font-bold text-bark dark:text-cream sm:text-3xl">
                            {copy.modelHeading}
                        </h2>
                    </motion.div>

                    <motion.div
                        className="mt-12 flex flex-col items-center gap-5 sm:flex-row sm:justify-center sm:gap-6"
                        variants={stagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-60px" }}
                    >
                        {copy.modelSteps.map((step, i) => {
                            const isFirst = i === 0;
                            const isLast = i === copy.modelSteps.length - 1;
                            const clipPath = isFirst
                                ? "polygon(0 0, 88% 0, 100% 50%, 88% 100%, 0 100%)"
                                : isLast
                                    ? "polygon(0 0, 100% 0, 100% 100%, 0 100%, 12% 50%)"
                                    : "polygon(0 0, 88% 0, 100% 50%, 88% 100%, 0 100%, 12% 50%)";

                            return (
                                <motion.div
                                    key={step.title}
                                    variants={fadeUp}
                                    style={{ clipPath }}
                                    className={`flex h-32 w-full flex-col justify-center bg-primary/45 py-5 text-left sm:w-56 ${isFirst ? "pl-6 pr-9" : "pl-9 pr-9"
                                        }`}
                                >
                                    <h3 className="font-heading text-sm font-bold text-white">{step.title}</h3>
                                    <p className="mt-1 font-body text-xs leading-relaxed text-white/70">{step.body}</p>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>


            {/* Compact inquiry form */}
            <section id="partner-form" className="bg-white dark:bg-night-surface py-20 lg:py-28">
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
                        <B2BInquiryForm />
                    </div>
                </div>
            </section>
        </div>
    );
}