"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

export default function PrivacyPolicy() {
  const { lang } = useLanguage();
  const l = lang as "el" | "en";

  const copy =
    l === "el"
      ? {
          eyebrow: "Νομικές Πληροφορίες",
          heading: "Πολιτική Απορρήτου",
          intro:
            "Στην Ellaina σεβόμαστε την ιδιωτικότητά σας. Αυτή η σελίδα εξηγεί ποιες πληροφορίες συλλέγουμε, πώς τις χρησιμοποιούμε, και πώς προστατεύουμε τα δεδομένα σας.",
          sections: [
            {
              title: "Απόρρητο",
              items: [
                "Συλλέγουμε μόνο τις πληροφορίες που είναι απαραίτητες για την επεξεργασία των παραγγελιών σας και τη βελτίωση της εμπειρίας αγορών σας.",
                "Τα προσωπικά σας στοιχεία (όπως όνομα, διεύθυνση, email και στοιχεία πληρωμής) παραμένουν εμπιστευτικά και δεν πωλούνται ούτε κοινοποιούνται σε τρίτους, εκτός αν αυτό απαιτείται για την ολοκλήρωση της παραγγελίας σας (π.χ. εταιρείες μεταφορών, πάροχοι πληρωμών).",
                "Μπορείτε να επικοινωνήσετε μαζί μας ανά πάσα στιγμή για να δείτε, να ενημερώσετε, ή να ζητήσετε τη διαγραφή των προσωπικών σας δεδομένων.",
              ],
            },
            {
              title: "Ασφάλεια",
              items: [
                "Η ιστοσελίδα μας χρησιμοποιεί ασφαλή κρυπτογράφηση SSL για την προστασία των δεδομένων σας κατά τις συναλλαγές.",
                "Τα στοιχεία πληρωμής επεξεργάζονται μέσω αξιόπιστων, ασφαλών παρόχων πληρωμών — δεν αποθηκεύουμε τα στοιχεία της κάρτας σας.",
                "Ελέγχουμε τακτικά τα συστήματά μας ώστε να διασφαλίζεται το υψηλότερο επίπεδο προστασίας των δεδομένων σας.",
              ],
            },
            {
              title: "Η δική σας ευθύνη",
              items: [
                "Παρακαλούμε φροντίστε τα στοιχεία λογαριασμού και οι κωδικοί σας (όπου ισχύει) να παραμένουν απόρρητα.",
                "Αν υποψιαστείτε μη εξουσιοδοτημένη χρήση των στοιχείων σας, επικοινωνήστε μαζί μας άμεσα.",
              ],
            },
          ],
          contactHeading: "Χρειάζεσαι βοήθεια με τα δεδομένα σου;",
          contactBody: "Επικοινώνησε μαζί μας για οποιοδήποτε αίτημα σχετικά με τα προσωπικά σου δεδομένα.",
        }
      : {
          eyebrow: "Legal Information",
          heading: "Privacy Policy",
          intro:
            "At Ellaina, we respect your privacy. This page explains what information we collect, how we use it, and how we protect your data.",
          sections: [
            {
              title: "Privacy",
              items: [
                "We only collect information necessary to process your orders and improve your shopping experience.",
                "Your personal details (such as name, address, email, and payment information) are kept confidential and never sold or shared with third parties, except when required to complete your order (e.g., shipping providers, payment processors).",
                "You may contact us at any time to review, update, or request the removal of your personal information.",
              ],
            },
            {
              title: "Safety",
              items: [
                "Our website uses secure SSL encryption to protect your data during transactions.",
                "Payment information is processed through trusted, secure payment gateways — we do not store your credit card details.",
                "We regularly review our systems to ensure the highest level of protection for your data.",
              ],
            },
            {
              title: "Your Responsibility",
              items: [
                "Please ensure that your account details and passwords (if applicable) remain private.",
                "If you suspect unauthorized use of your information, contact us immediately.",
              ],
            },
          ],
          contactHeading: "Need help with your data?",
          contactBody: "Get in touch with us for any request regarding your personal information.",
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

      <div className="mt-14 flex flex-col gap-12">
        {copy.sections.map((section) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-xl font-bold text-bark dark:text-cream">
              {section.title}
            </h2>
            <div className="mt-3 h-px w-8 bg-secondary/50" />
            <ul className="mt-5 flex flex-col gap-3">
              {section.items.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                  <p className="font-body text-[0.9375rem] leading-relaxed text-bark/70 dark:text-cream/60">
                    {item}
                  </p>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="mt-16 rounded-2xl border border-light/80 bg-cream/50 p-7 dark:border-white/8 dark:bg-night-subtle"
      >
        <h2 className="font-heading text-lg font-bold text-bark dark:text-cream">{copy.contactHeading}</h2>
        <p className="mt-2 font-body text-sm leading-relaxed text-bark/65 dark:text-cream/55">{copy.contactBody}</p>
        <div className="mt-4 flex flex-col gap-1">
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
        </div>
      </motion.div>
    </div>
  );
}