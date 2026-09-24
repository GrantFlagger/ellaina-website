"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { companyLine } from "@/lib/company";

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
            "Αυτή η σελίδα περιγράφει την εξυπηρέτηση πελατών μας, τους αποδεκτούς τρόπους πληρωμής και τους όρους πώλησης που ισχύουν για κάθε παραγγελία στην Ellaina.",

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
          methods: [
            "Πιστωτικές & Χρεωστικές Κάρτες (Visa, Mastercard), μέσω της Stripe",
            "Τραπεζικό έμβασμα (μόνο για επαγγελματικές παραγγελίες)",
          ],

          termsTitle: "Όροι Πώλησης & Πληρωμής",
          termsIntro:
            "Οι παρακάτω όροι ισχύουν για κάθε αγορά μέσω του ellainaoliveoil.com. Τοποθετώντας παραγγελία, αποδέχεσαι τους παρόντες όρους, την πολιτική Αποστολής & Επιστροφών και την Πολιτική Απορρήτου. Τελευταία ενημέρωση: 24 Σεπτεμβρίου 2026.",
          termsSections: [
            {
              title: "Στοιχεία Πωλητή",
              body: companyLine("el"),
            },
            {
              title: "Κατάρτιση Σύμβασης",
              body:
                "Η σύμβαση καταρτίζεται όταν ολοκληρώσεις την πληρωμή και λάβεις email επιβεβαίωσης της παραγγελίας. Αν κάποιο προϊόν δεν είναι τελικά διαθέσιμο, θα σε ενημερώσουμε και θα σου επιστρέψουμε αμέσως το ποσό που πλήρωσες.",
            },
            {
              title: "Τιμές",
              body:
                "Όλες οι τιμές είναι σε ευρώ (€) και περιλαμβάνουν ΦΠΑ και έξοδα αποστολής. Η συνολική τελική τιμή εμφανίζεται πριν την πληρωμή. Σε περίπτωση προφανούς λάθους στην τιμή, θα επικοινωνήσουμε μαζί σου πριν την αποστολή και μπορείς να ακυρώσεις την παραγγελία με πλήρη επιστροφή χρημάτων.",
            },
            {
              title: "Χρόνος Πληρωμής",
              body:
                "Οι παραγγελίες λιανικής πληρώνονται εξ ολοκλήρου κατά την παραγγελία, online με κάρτα μέσω της Stripe, και αποστέλλονται μόλις επιβεβαιωθεί η πληρωμή.",
            },
            {
              title: "Επαγγελματικές Παραγγελίες & Προκαταβολή",
              body:
                "Για επαγγελματικές παραγγελίες 100 λίτρων και άνω, το 50% του ποσού καταβάλλεται ως προκαταβολή κατά την παραγγελία και το υπόλοιπο κατά την ημερομηνία αποστολής. Η προκαταβολή επιστρέφεται σε περίπτωση ακύρωσης πριν την αποστολή, εκτός αν έχει συμφωνηθεί εγγράφως διαφορετικά. Για τραπεζικά εμβάσματα, αναγράφεται ως αιτιολογία ο αριθμός παραγγελίας.",
            },
            {
              title: "Καθυστερημένες ή Αποτυχημένες Πληρωμές",
              body: "Αν η πληρωμή δεν παραληφθεί εντός του συμφωνηθέντος χρονικού πλαισίου, η Ellaina διατηρεί το δικαίωμα να ακυρώσει την παραγγελία.",
            },
            {
              title: "Παράδοση",
              body:
                "Οι χρόνοι και οι όροι αποστολής περιγράφονται στη σελίδα Αποστολή & Επιστροφές. Ο κίνδυνος απώλειας ή φθοράς των προϊόντων περνά σε σένα από τη στιγμή που θα τα παραλάβεις.",
            },
            {
              title: "Δικαίωμα Υπαναχώρησης",
              body:
                "Ως καταναλωτής έχεις δικαίωμα υπαναχώρησης εντός 14 ημερών από την παραλαβή των προϊόντων, χωρίς αιτιολογία, σύμφωνα με τον ν. 2251/1994. Οι λεπτομέρειες, οι εξαιρέσεις και το υπόδειγμα δήλωσης υπαναχώρησης βρίσκονται στη σελίδα Αποστολή & Επιστροφές.",
            },
            {
              title: "Νόμιμη Εγγύηση",
              body:
                "Ευθυνόμαστε για κάθε έλλειψη συμμόρφωσης των προϊόντων που εμφανίζεται εντός δύο (2) ετών από την παράδοση, σύμφωνα με την ισχύουσα νομοθεσία για την προστασία του καταναλωτή.",
            },
            {
              title: "Ασφάλεια Πληρωμών",
              body: "Όλες οι συναλλαγές επεξεργάζονται μέσω ασφαλών, κρυπτογραφημένων παρόχων πληρωμών. Η Ellaina δεν αποθηκεύει στοιχεία καρτών.",
            },
            {
              title: "Παράπονα & Επίλυση Διαφορών",
              body:
                "Για οποιοδήποτε παράπονο, επικοινώνησε μαζί μας στα παραπάνω στοιχεία· απαντάμε εντός 24–48 ωρών τις εργάσιμες ημέρες. Αν δεν μείνεις ικανοποιημένος, μπορείς να απευθυνθείς στον Συνήγορο του Καταναλωτή (www.synigoroskatanaloti.gr) ή σε άλλο φορέα εναλλακτικής επίλυσης καταναλωτικών διαφορών.",
            },
            {
              title: "Εφαρμοστέο Δίκαιο",
              body:
                "Οι παρόντες όροι διέπονται από το ελληνικό δίκαιο. Για τυχόν διαφορές αρμόδια είναι τα δικαστήρια της Αθήνας, με την επιφύλαξη των αναγκαστικών διατάξεων προστασίας του καταναλωτή της χώρας κατοικίας σου και του δικαιώματός σου να προσφύγεις στα δικαστήρια του τόπου κατοικίας σου.",
            },
          ],
        }
      : {
          eyebrow: "Legal Information",
          heading: "Terms of Use",
          intro:
            "This page outlines our customer care, accepted payment methods, and the terms of sale that apply to every order placed with Ellaina.",

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
          methods: [
            "Credit & Debit Cards (Visa, Mastercard), via Stripe",
            "Bank transfer (business orders only)",
          ],

          termsTitle: "Terms of Sale & Payment",
          termsIntro:
            "The following terms apply to every purchase made through ellainaoliveoil.com. By placing an order, you accept these terms, our Shipping & Returns policy and our Privacy Policy. Last updated: 24 September 2026.",
          termsSections: [
            {
              title: "Seller Details",
              body: companyLine("en"),
            },
            {
              title: "Formation of Contract",
              body:
                "The contract is formed when you complete payment and receive an order confirmation email. If a product turns out to be unavailable, we will let you know and refund the amount you paid immediately.",
            },
            {
              title: "Prices",
              body:
                "All prices are in euros (€) and include VAT and shipping. The total final price is shown before payment. In the event of an obvious pricing error, we will contact you before dispatch and you may cancel the order for a full refund.",
            },
            {
              title: "Payment Timing",
              body:
                "Retail orders are paid in full at the time of order, online by card via Stripe, and are shipped once payment has been confirmed.",
            },
            {
              title: "Business Orders & Down Payment",
              body:
                "For business orders of 100 litres and above, 50% of the amount is paid as a down payment on the order date and the remainder on the shipping date. The down payment is refundable if the order is cancelled before dispatch, unless otherwise agreed in writing. For bank transfers, include the order number as the payment reference.",
            },
            {
              title: "Late or Failed Payments",
              body: "If payment is not received within the agreed timeframe, Ellaina reserves the right to cancel the order.",
            },
            {
              title: "Delivery",
              body:
                "Shipping times and conditions are described on our Shipping & Returns page. Risk of loss or damage passes to you once you receive the products.",
            },
            {
              title: "Right of Withdrawal",
              body:
                "As a consumer, you have the right to withdraw within 14 days of receiving the products, without giving a reason, under Greek consumer law (Law 2251/1994). Details, exceptions and the model withdrawal form are on our Shipping & Returns page.",
            },
            {
              title: "Legal Guarantee",
              body:
                "We are liable for any lack of conformity of the products that becomes apparent within two (2) years of delivery, in accordance with applicable consumer protection law.",
            },
            {
              title: "Payment Security",
              body: "All transactions are processed through secure, encrypted payment providers. Ellaina does not store card details.",
            },
            {
              title: "Complaints & Dispute Resolution",
              body:
                "For any complaint, contact us using the details above; we reply within 24–48 hours on business days. If you are not satisfied, you may contact the Hellenic Consumer Ombudsman (www.synigoroskatanaloti.gr) or another consumer alternative dispute resolution body.",
            },
            {
              title: "Governing Law",
              body:
                "These terms are governed by Greek law. The courts of Athens have jurisdiction over any dispute, without prejudice to the mandatory consumer protection rules of your country of residence and your right to bring proceedings in the courts where you live.",
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