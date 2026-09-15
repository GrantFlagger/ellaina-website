"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

export default function TermsOfUse() {
  const { lang } = useLanguage();
  const l = lang as "el" | "en";

  const copy =
    l === "el"
      ? {
          eyebrow: "Νομικές Πληροφορίες",
          heading: "Όροι Χρήσης",
          intro:
            "Αυτή η σελίδα περιγράφει την εξυπηρέτηση πελατών μας, τους αποδεκτούς τρόπους πληρωμής, και τους όρους πληρωμής που ισχύουν για κάθε παραγγελία στην Ellaina.",

          careTitle: "Εξυπηρέτηση Πελατών",
          careIntro:
            "Στην Ellaina, οι πελάτες μας βρίσκονται στο επίκεντρο όλων όσων κάνουμε. Δεσμευόμαστε να σας προσφέρουμε μια απρόσκοπτη εμπειρία αγορών και το υψηλότερο επίπεδο υποστήριξης.",
          careCommitTitle: "Η δέσμευσή μας προς εσάς:",
          careCommit: [
            "Απαντάμε σε όλα τα αιτήματα εντός 24–48 ωρών τις εργάσιμες ημέρες.",
            "Παρέχουμε σαφείς πληροφορίες για τα προϊόντα, τις τιμές και τις πολιτικές μας.",
            "Χειριζόμαστε όλες τις πληροφορίες πελατών με εμπιστευτικότητα και σεβασμό.",
            "Εργαζόμαστε για την επίλυση κάθε ζητήματος με δικαιοσύνη και διαφάνεια.",
          ],
          careReachTitle: "Πώς να επικοινωνήσετε μαζί μας:",
          careHoursNote: "Ώρες υποστήριξης: Δευτέρα – Παρασκευή, 9:00 – 17:00 (τοπική ώρα)",
          careFeedbackTitle: "Σχόλια:",
          careFeedback:
            "Εκτιμούμε τα σχόλιά σας και σας ενθαρρύνουμε να μοιραστείτε την εμπειρία σας μαζί μας. Μας βοηθούν να βελτιωνόμαστε και να συνεχίζουμε να προσφέρουμε την ποιότητα που περιμένετε.",

          methodsTitle: "Τρόποι Πληρωμής",
          methods: ["Πιστωτικές & Χρεωστικές Κάρτες (Visa, Mastercard)"],

          termsTitle: "Όροι Πληρωμής",
          termsIntro:
            "Στην Ellaina στοχεύουμε σε μια ομαλή και διαφανή διαδικασία πληρωμής. Τοποθετώντας παραγγελία μαζί μας, συμφωνείτε με τους παρακάτω όρους:",
          termsSections: [
            {
              title: "Χρόνος Πληρωμής",
              body:
                "Η πλήρης πληρωμή ή η συμφωνηθείσα προκαταβολή πρέπει να γίνεται τη στιγμή της παραγγελίας. Οι παραγγελίες δεν επεξεργάζονται ούτε αποστέλλονται μέχρι να επιβεβαιωθεί η πληρωμή. Για παραγγελίες 100 λίτρων και άνω, το 50% του ποσού καταβάλλεται την ημέρα της παραγγελίας και το υπόλοιπο κατά την ημερομηνία αποστολής. Για παραγγελίες κάτω των 100 λίτρων, η πλήρης πληρωμή γίνεται κατά την ημερομηνία/ώρα της παραγγελίας.",
            },
            {
              title: "Προκαταβολή",
              body:
                "Για παραγγελίες 100 λίτρων και άνω, η προκαταβολή επιστρέφεται σε περίπτωση ακύρωσης της παραγγελίας. Για παραγγελίες κάτω των 100 λίτρων, σε περίπτωση ακύρωσης επιστρέφεται το σύνολο της πληρωμής.",
            },
            {
              title: "Αποδεκτοί Τρόποι Πληρωμής",
              body:
                "Οι πληρωμές μπορούν να γίνουν με πιστωτική/χρεωστική κάρτα, PayPal, ή τραπεζικό έμβασμα. Για τραπεζικά εμβάσματα, οι πελάτες πρέπει να αναγράφουν τον αριθμό παραγγελίας ως αιτιολογία.",
            },
            {
              title: "Νόμισμα",
              body: "Όλες οι τιμές και οι πληρωμές επεξεργάζονται σε EUR (€).",
            },
            {
              title: "Καθυστερημένες ή Αποτυχημένες Πληρωμές",
              body: "Αν η πληρωμή δεν παραληφθεί εντός του συμφωνηθέντος χρονικού πλαισίου, η Ellaina διατηρεί το δικαίωμα να ακυρώσει την παραγγελία.",
            },
            {
              title: "Ασφάλεια",
              body: "Όλες οι συναλλαγές επεξεργάζονται μέσω ασφαλών, κρυπτογραφημένων παρόχων πληρωμών. Η Ellaina δεν αποθηκεύει ευαίσθητα στοιχεία πληρωμής.",
            },
          ],
        }
      : {
          eyebrow: "Legal Information",
          heading: "Terms of Use",
          intro:
            "This page outlines our customer care, accepted payment methods, and the payment terms that apply to every order placed with Ellaina.",

          careTitle: "Customer Care",
          careIntro:
            "At Ellaina, our customers are at the heart of everything we do. We are committed to providing you with a seamless shopping experience and the highest standard of support.",
          careCommitTitle: "Our commitment to you:",
          careCommit: [
            "We respond to all inquiries within 24–48 hours on business days.",
            "We provide clear information about our products, pricing, and policies.",
            "We handle all customer information with confidentiality and respect.",
            "We work to resolve any issues with fairness and transparency.",
          ],
          careReachTitle: "How to reach us:",
          careHoursNote: "Support hours: Monday – Friday, 9:00 AM – 5:00 PM (local time)",
          careFeedbackTitle: "Feedback:",
          careFeedback:
            "We value your feedback and encourage you to share your experience with us. It helps us improve and continue to deliver the quality you expect.",

          methodsTitle: "Payment Methods",
          methods: ["Credit & Debit Cards (Visa, Mastercard)"],

          termsTitle: "Payment Terms",
          termsIntro:
            "At Ellaina, we aim to ensure a smooth and transparent payment process. By placing an order with us, you agree to the following terms:",
          termsSections: [
            {
              title: "Payment Timing",
              body:
                "Full payment or the agreed down payment must be made at the time of order. Orders will not be processed or shipped until payment has been confirmed. For orders of 100 litres and above, 50% of the amount is paid on the order date and the remainder on the shipping date. For orders below 100 litres, full payment is made at the date/time of order.",
            },
            {
              title: "Down Payment",
              body:
                "For orders of 100 litres and above, the down payment is refundable in case of order cancellation. For orders below 100 litres, in case of order cancellation the full payment will be refunded.",
            },
            {
              title: "Accepted Methods",
              body: "Payments can be made via credit/debit cards, PayPal, or bank transfer. For bank transfers, customers must include the order number as a reference.",
            },
            {
              title: "Currency",
              body: "All prices and payments are processed in EUR (€).",
            },
            {
              title: "Late or Failed Payments",
              body: "If payment is not received within the agreed timeframe, Ellaina reserves the right to cancel the order.",
            },
            {
              title: "Security",
              body: "All transactions are processed through secure, encrypted payment gateways. Ellaina does not store sensitive payment details.",
            },
          ],
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

      {/* Customer Care */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="mt-14"
      >
        <h2 className="font-heading text-xl font-bold text-bark dark:text-cream">{copy.careTitle}</h2>
        <div className="mt-3 h-px w-8 bg-secondary/50" />
        <p className="mt-5 font-body text-[0.9375rem] leading-relaxed text-bark/70 dark:text-cream/60">
          {copy.careIntro}
        </p>

        <h3 className="mt-6 font-body text-sm font-semibold text-bark dark:text-cream">{copy.careCommitTitle}</h3>
        <ul className="mt-3 flex flex-col gap-2.5">
          {copy.careCommit.map((item, i) => (
            <li key={i} className="flex gap-3">
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
              <p className="font-body text-[0.9375rem] leading-relaxed text-bark/70 dark:text-cream/60">{item}</p>
            </li>
          ))}
        </ul>

        <h3 className="mt-6 font-body text-sm font-semibold text-bark dark:text-cream">{copy.careReachTitle}</h3>
                <div className="mt-3 flex flex-col gap-1.5">
          <a
            href="mailto:info@ellainaoliveoil.com"
            className="font-body text-sm font-medium text-secondary transition-colors hover:text-secondary-600"
          >
           info@ellainaoliveoil.com
          </a>
          <a
            href="tel:+306987657362"
            className="font-body text-sm font-medium text-secondary transition-colors hover:text-secondary-600"
          >
           +30 698 765 7362
          </a>
          <p className="font-body text-sm text-bark/60 dark:text-cream/55"> {copy.careHoursNote}</p>
        </div>

        <h3 className="mt-6 font-body text-sm font-semibold text-bark dark:text-cream">{copy.careFeedbackTitle}</h3>
        <p className="mt-2 font-body text-[0.9375rem] leading-relaxed text-bark/70 dark:text-cream/60">
          {copy.careFeedback}
        </p>
      </motion.div>

      {/* Payment Methods */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="mt-14"
      >
        <h2 className="font-heading text-xl font-bold text-bark dark:text-cream">{copy.methodsTitle}</h2>
        <div className="mt-3 h-px w-8 bg-secondary/50" />
        <ul className="mt-5 flex flex-col gap-2.5">
          {copy.methods.map((item, i) => (
            <li key={i} className="flex gap-3">
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
              <p className="font-body text-[0.9375rem] leading-relaxed text-bark/70 dark:text-cream/60">{item}</p>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Payment Terms */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="mt-14"
      >
        <h2 className="font-heading text-xl font-bold text-bark dark:text-cream">{copy.termsTitle}</h2>
        <div className="mt-3 h-px w-8 bg-secondary/50" />
        <p className="mt-5 font-body text-[0.9375rem] leading-relaxed text-bark/70 dark:text-cream/60">
          {copy.termsIntro}
        </p>

        <div className="mt-6 flex flex-col gap-6">
          {copy.termsSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-body text-sm font-semibold text-bark dark:text-cream">{section.title}</h3>
              <p className="mt-1.5 font-body text-[0.9375rem] leading-relaxed text-bark/70 dark:text-cream/60">
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}