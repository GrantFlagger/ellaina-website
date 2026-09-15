"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

export default function ShippingReturns() {
  const { lang } = useLanguage();
  const l = lang as "el" | "en";

  const copy =
    l === "el"
      ? {
          eyebrow: "Νομικές Πληροφορίες",
          heading: "Αποστολή & Επιστροφές",
          intro:
            "Στην Ellaina φροντίζουμε το ελαιόλαδό σας να φτάνει με ασφάλεια και φρεσκάδα. Εδώ θα βρείτε όλες τις πληροφορίες για τις αποστολές και την πολιτική επιστροφών μας.",

          shippingTitle: "Πολιτική Αποστολής",
          conditionsTitle: "Υπό Κανονικές Συνθήκες",
          shippingItems: [
            {
              title: "Χρόνος Επεξεργασίας",
              body: "Οι παραγγελίες συνήθως επεξεργάζονται και αποστέλλονται ανάλογα με το μέγεθος της παραγγελίας και όπως έχει συμφωνηθεί με τις ανάγκες του πελάτη.",
            },
            {
              title: "Χρόνοι Παράδοσης",
              list: [
                "Εγχώριες παραγγελίες (εντός Ελλάδας): 2–5 εργάσιμες ημέρες",
                "Παραγγελίες εντός ΕΕ: 5–10 εργάσιμες ημέρες",
                "Διεθνείς παραγγελίες: 10–20 εργάσιμες ημέρες (ανάλογα με τον προορισμό και το τελωνείο)",
              ],
            },
            {
              title: "Έξοδα Αποστολής",
              body: "Τα έξοδα αποστολής περιλαμβάνονται στην τελική τιμή.",
            },
            {
              title: "Συσκευασία",
              body: "Όλα τα προϊόντα συσκευάζονται προσεκτικά ώστε να αποφευχθούν διαρροές ή ζημιές κατά τη μεταφορά.",
            },
            {
              title: "Παρακολούθηση Παραγγελίας",
              body: "Μόλις αποσταλεί η παραγγελία σας, θα λάβετε αριθμό παρακολούθησης μέσω email. 📦 Αν η παραγγελία σας φτάσει κατεστραμμένη ή καθυστερημένη, επικοινωνήστε μαζί μας ώστε να σας βοηθήσουμε.",
            },
          ],

          returnsTitle: " Πολιτική Επιστροφών & Επιστροφής Χρημάτων",
          returnsItems: [
            {
              title: "Επιστροφές",
              body: "Όλες οι πωλήσεις είναι οριστικές — δεν δεχόμαστε επιστροφές ή αντικαταστάσεις. Οι ακυρώσεις επιτρέπονται εντός 1–5 ημερών από την ημερομηνία παραγγελίας. Μετά από αυτό το διάστημα, οι παραγγελίες δεν μπορούν να ακυρωθούν. Σε κάθε περίπτωση, η προκαταβολή δεν επιστρέφεται.",
            },
            {
              title: "Κατεστραμμένα ή Ελαττωματικά Προϊόντα",
              body: "Αν η παραγγελία σας φτάσει κατεστραμμένη, με διαρροή, ή ελαττωματική, επικοινωνήστε μαζί μας εντός 7 ημερών με φωτογραφίες του προβλήματος.",
            },
            {
              title: "Μη Επιστρεφόμενα Προϊόντα",
              body: "Για λόγους υγείας και ασφάλειας, ανοιγμένα μπουκάλια ή χρησιμοποιημένα προϊόντα δεν μπορούν να επιστραφούν.",
            },
          ],

          contactHeading: "Χρειάζεσαι βοήθεια με μια παραγγελία;",
          contactBody: "Επικοινώνησε μαζί μας για ζητήματα αποστολής ή επιστροφών.",
        }
      : {
          eyebrow: "Legal Information",
          heading: "Shipping & Returns",
          intro:
            "At Ellaina, we ensure your olive oil arrives safely and fresh. Here you'll find everything about our shipping and returns policy.",

          shippingTitle: "Shipping Policy",
          conditionsTitle: "Under Normal Conditions",
          shippingItems: [
            {
              title: "Processing Time",
              body: "Orders are typically processed and shipped based on the order amount and as agreed upon with the client's needs.",
            },
            {
              title: "Delivery Times",
              list: [
                "Domestic Orders (within Greece): 2–5 business days",
                "EU Orders: 5–10 business days",
                "International Orders: 10–20 business days (depending on destination and customs)",
              ],
            },
            {
              title: "Shipping Costs",
              body: "Shipping costs are included in the final price.",
            },
            {
              title: "Packaging",
              body: "All products are carefully packed to prevent leaks or damage during transport.",
            },
            {
              title: "Order Tracking",
              body: "Once shipped, you will receive a tracking number via email to follow your order. 📦 If your order arrives damaged or delayed, please contact us so we can assist you.",
            },
          ],

          returnsTitle: " Return & Refund Policy",
          returnsItems: [
            {
              title: "Returns",
              body: "Please note that all sales are final. We do not accept returns or exchanges. Cancellations are allowed within 1–5 days from the order date. After this period, orders cannot be cancelled. However, please note that in any case, the down payment is non-refundable.",
            },
            {
              title: "Damaged or Defective Products",
              body: "If your order arrives damaged, leaking, or defective, contact us within 7 days with photos of the issue.",
            },
            {
              title: "Non-Returnable Items",
              body: "For health and safety reasons, opened bottles or used products cannot be returned.",
            },
          ],

          contactHeading: "Need help with an order?",
          contactBody: "Get in touch with us for any shipping or return issue.",
        };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <motion.div initial="hidden" animate="visible" variants={stagger}>
        <motion.p variants={fadeUp} className="font-body text-xs font-semibold uppercase tracking-[0.26em] text-secondary">
          {copy.eyebrow}
        </motion.p>
        <motion.h1
          variants={fadeUp}
          className="mt-3 font-heading text-3xl font-bold tracking-tight text-bark dark:text-cream sm:text-4xl"
        >
          {copy.heading}
        </motion.h1>
        <motion.div variants={fadeUp} className="mt-6 h-px w-12 bg-secondary" />
        <motion.p
          variants={fadeUp}
          className="mt-6 max-w-2xl font-body text-[0.9375rem] leading-relaxed text-bark/70 dark:text-cream/60"
        >
          {copy.intro}
        </motion.p>
      </motion.div>

      {/* Shipping */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="mt-14"
      >
        <h2 className="font-heading text-xl font-bold text-bark dark:text-cream">{copy.shippingTitle}</h2>
        <div className="mt-3 h-px w-8 bg-secondary/50" />

        <h3 className="mt-6 font-body text-sm font-semibold text-bark dark:text-cream">{copy.conditionsTitle}</h3>
        <div className="mt-4 flex flex-col gap-5">
          {copy.shippingItems.map((item) => (
            <div key={item.title}>
              <h4 className="font-body text-sm font-semibold text-bark/85 dark:text-cream/75">{item.title}</h4>
              {item.body && (
                <p className="mt-1 font-body text-[0.9375rem] leading-relaxed text-bark/70 dark:text-cream/60">
                  {item.body}
                </p>
              )}
              {item.list && (
                <ul className="mt-2 flex flex-col gap-1.5">
                  {item.list.map((li, i) => (
                    <li key={i} className="flex gap-2.5">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                      <p className="font-body text-[0.9375rem] leading-relaxed text-bark/70 dark:text-cream/60">{li}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Returns */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="mt-14"
      >
        <h2 className="font-heading text-xl font-bold text-bark dark:text-cream">{copy.returnsTitle}</h2>
        <div className="mt-3 h-px w-8 bg-secondary/50" />
        <div className="mt-5 flex flex-col gap-5">
          {copy.returnsItems.map((item) => (
            <div key={item.title}>
              <h4 className="font-body text-sm font-semibold text-bark/85 dark:text-cream/75">{item.title}</h4>
              <p className="mt-1 font-body text-[0.9375rem] leading-relaxed text-bark/70 dark:text-cream/60">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="mt-16 rounded-2xl border border-light/80 bg-cream/50 p-7 dark:border-white/8 dark:bg-night-subtle"
      >
        <h2 className="font-heading text-lg font-bold text-bark dark:text-cream">{copy.contactHeading}</h2>
        <p className="mt-2 font-body text-sm leading-relaxed text-bark/65 dark:text-cream/55">{copy.contactBody}</p>
        <a
          href="mailto:ellaina.oliveoil@gmail.com"
          className="mt-4 inline-block font-body text-sm font-medium text-secondary transition-colors hover:text-secondary-600"
        >
          ellaina.oliveoil@gmail.com
        </a>
      </motion.div>
    </div>
  );
}