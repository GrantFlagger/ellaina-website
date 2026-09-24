"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { COMPANY } from "@/lib/company";

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
              body: "Οι παραγγελίες λιανικής αποστέλλονται μόλις επιβεβαιωθεί η πληρωμή. Οι χρόνοι παράδοσης παρακάτω είναι ενδεικτικοί· σε κάθε περίπτωση η παράδοση γίνεται το αργότερο εντός 30 ημερών από την παραγγελία — διαφορετικά μπορείς να την ακυρώσεις με πλήρη επιστροφή χρημάτων. Για επαγγελματικές παραγγελίες, ο χρόνος αποστολής συμφωνείται ανάλογα με την ποσότητα.",
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
              body: "Τα έξοδα αποστολής περιλαμβάνονται στην τελική τιμή που βλέπεις πριν την πληρωμή. Για αποστολές εκτός ΕΕ, οι τελωνειακές αρχές της χώρας προορισμού ενδέχεται να επιβάλουν δασμούς ή φόρους, οι οποίοι βαρύνουν τον παραλήπτη.",
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

          returnsTitle: "Υπαναχώρηση, Επιστροφές & Επιστροφή Χρημάτων",
          returnsItems: [
            {
              title: "Δικαίωμα Υπαναχώρησης (14 ημέρες)",
              body: `Ως καταναλωτής έχεις δικαίωμα να υπαναχωρήσεις από την αγορά μέσα σε 14 ημέρες από την ημέρα που παρέλαβες τα προϊόντα, χωρίς να δώσεις αιτιολογία. Για να το ασκήσεις, στείλε μας μια σαφή δήλωση στο ${COMPANY.email} πριν λήξει η προθεσμία. Μπορείς να χρησιμοποιήσεις το υπόδειγμα παρακάτω, χωρίς να είναι υποχρεωτικό.`,
            },
            {
              title: "Ακύρωση πριν την Αποστολή",
              body: "Μπορείς να ακυρώσεις την παραγγελία σου οποιαδήποτε στιγμή πριν αποσταλεί, με πλήρη επιστροφή των χρημάτων σου.",
            },
            {
              title: "Επιστροφή των Προϊόντων",
              body: "Στείλε τα προϊόντα πίσω, αχρησιμοποίητα, στη διεύθυνση που θα σου υποδείξουμε, το αργότερο 14 ημέρες μετά τη δήλωση υπαναχώρησης. Το άμεσο κόστος της επιστροφής βαρύνει εσένα.",
            },
            {
              title: "Επιστροφή Χρημάτων",
              body: "Θα σου επιστρέψουμε όλα τα ποσά που πλήρωσες, μαζί με τα βασικά έξοδα αποστολής, εντός 14 ημερών από τη λήψη της δήλωσής σου, με τον ίδιο τρόπο πληρωμής που χρησιμοποίησες. Μπορούμε να παρακρατήσουμε την επιστροφή μέχρι να παραλάβουμε τα προϊόντα ή να μας δείξεις ότι τα έχεις αποστείλει.",
            },
            {
              title: "Εξαίρεση: Ανοιγμένα Προϊόντα",
              body: "Για λόγους προστασίας της υγείας και υγιεινής, το δικαίωμα υπαναχώρησης δεν ισχύει για σφραγισμένα προϊόντα των οποίων η σφράγιση έχει αφαιρεθεί μετά την παράδοση (π.χ. ανοιγμένα μπουκάλια ή δοχεία).",
            },
            {
              title: "Κατεστραμμένα ή Ελαττωματικά Προϊόντα",
              body: "Αν η παραγγελία σου φτάσει κατεστραμμένη, με διαρροή ή ελαττωματική, ενημέρωσέ μας το συντομότερο — ιδανικά εντός 7 ημερών — με φωτογραφίες του προβλήματος, και θα σου στείλουμε αντικατάσταση ή θα σου επιστρέψουμε τα χρήματα χωρίς καμία χρέωση. Αυτό δεν περιορίζει τη νόμιμη εγγύηση συμμόρφωσης δύο (2) ετών που ισχύει για όλα τα προϊόντα.",
            },
            {
              title: "Υπόδειγμα Δήλωσης Υπαναχώρησης",
              body: `Προς: ${COMPANY.legalName.el}, ${COMPANY.address.el}, ${COMPANY.email} — «Με την παρούσα δηλώνω ότι υπαναχωρώ από τη σύμβαση πώλησης των ακόλουθων προϊόντων: […] · Αριθμός παραγγελίας: […] · Ημερομηνία παραγγελίας / παραλαβής: […] · Ονοματεπώνυμο: […] · Διεύθυνση: […] · Ημερομηνία: […]»`,
            },
            {
              title: "Επαγγελματικές Παραγγελίες (B2B)",
              body: "Οι παραπάνω κανόνες υπαναχώρησης αφορούν καταναλωτές. Για παραγγελίες επιχειρήσεων ισχύουν οι όροι της γραπτής συμφωνίας μας.",
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
              body: "Retail orders are shipped once payment is confirmed. The delivery times below are estimates; in any case, delivery takes place no later than 30 days from your order — otherwise you may cancel it for a full refund. For business orders, shipping time is agreed according to the quantity.",
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
              body: "Shipping costs are included in the final price shown before payment. For deliveries outside the EU, the destination country's customs authorities may charge duties or taxes, payable by the recipient.",
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

          returnsTitle: "Withdrawal, Returns & Refunds",
          returnsItems: [
            {
              title: "Right of Withdrawal (14 days)",
              body: `As a consumer you have the right to withdraw from your purchase within 14 days of the day you received the products, without giving any reason. To exercise it, send us a clear statement at ${COMPANY.email} before the deadline. You may use the model form below, but it is not mandatory.`,
            },
            {
              title: "Cancelling Before Dispatch",
              body: "You can cancel your order at any time before it has been shipped, with a full refund.",
            },
            {
              title: "Returning the Products",
              body: "Send the products back, unused, to the address we give you, no later than 14 days after your withdrawal statement. You bear the direct cost of returning them.",
            },
            {
              title: "Refunds",
              body: "We will refund all payments received from you, including standard delivery costs, within 14 days of receiving your statement, using the same payment method you used. We may withhold the refund until we have received the products back or you have shown proof of sending them.",
            },
            {
              title: "Exception: Opened Products",
              body: "For health-protection and hygiene reasons, the right of withdrawal does not apply to sealed products that have been unsealed after delivery (e.g. opened bottles or tins).",
            },
            {
              title: "Damaged or Defective Products",
              body: "If your order arrives damaged, leaking, or defective, let us know as soon as possible — ideally within 7 days — with photos of the issue, and we will send a replacement or refund you at no cost. This does not limit the two-year legal guarantee of conformity that applies to all products.",
            },
            {
              title: "Model Withdrawal Form",
              body: `To: ${COMPANY.legalName.en}, ${COMPANY.address.en}, ${COMPANY.email} — "I hereby give notice that I withdraw from my contract of sale of the following goods: […] · Order number: […] · Ordered on / received on: […] · Name: […] · Address: […] · Date: […]"`,
            },
            {
              title: "Business Orders (B2B)",
              body: "The withdrawal rules above apply to consumers. Business orders are governed by the terms of our written agreement.",
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
          href={`mailto:${COMPANY.email}`}
          className="mt-4 inline-block font-body text-sm font-medium text-secondary transition-colors hover:text-secondary-600"
        >
          {COMPANY.email}
        </a>
      </motion.div>
    </div>
  );
}