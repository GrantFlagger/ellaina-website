"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { COMPANY, companyLine } from "@/lib/company";

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
            "Στην Ellaina σεβόμαστε την ιδιωτικότητά σας. Αυτή η σελίδα εξηγεί ποιες πληροφορίες συλλέγουμε, γιατί, για πόσο τις κρατάμε, με ποιους τις μοιραζόμαστε και ποια δικαιώματα έχετε, σύμφωνα με τον Γενικό Κανονισμό Προστασίας Δεδομένων (ΓΚΠΔ) και τον ν. 4624/2019. Τελευταία ενημέρωση: 24 Σεπτεμβρίου 2026.",
          sections: [
            {
              title: "Υπεύθυνος Επεξεργασίας",
              items: [
                companyLine("el"),
                `Για οποιοδήποτε θέμα σχετικά με τα δεδομένα σας, επικοινωνήστε μαζί μας στο ${COMPANY.email}.`,
              ],
            },
            {
              title: "Ποια δεδομένα συλλέγουμε και γιατί",
              items: [
                "Παραγγελίες: ονοματεπώνυμο, email, τηλέφωνο και διεύθυνση αποστολής, για την εκτέλεση και παράδοση της παραγγελίας σας (εκτέλεση σύμβασης — άρθρο 6 παρ. 1 στοιχ. β ΓΚΠΔ) και για την τήρηση φορολογικών υποχρεώσεων (νομική υποχρέωση — άρθρο 6 παρ. 1 στοιχ. γ). Το τηλέφωνο χρειάζεται για την επικοινωνία της εταιρείας ταχυμεταφορών μαζί σας.",
                "Φόρμα επικοινωνίας και φόρμες B2B: όνομα, email, (προαιρετικά) τηλέφωνο, στοιχεία επιχείρησης και το μήνυμά σας, για να απαντήσουμε στο αίτημά σας (προσυμβατικά μέτρα ή έννομο συμφέρον — άρθρο 6 παρ. 1 στοιχ. β/στ).",
                "Newsletter: email και γλώσσα προτίμησης, μόνο εφόσον εγγραφείτε (συγκατάθεση — άρθρο 6 παρ. 1 στοιχ. α). Μπορείτε να ανακαλέσετε τη συγκατάθεσή σας οποιαδήποτε στιγμή μέσω του συνδέσμου διαγραφής σε κάθε email ή γράφοντάς μας.",
                "Πληρωμές: τα στοιχεία κάρτας εισάγονται απευθείας στη σελίδα πληρωμής της Stripe. Εμείς δεν λαμβάνουμε ούτε αποθηκεύουμε ποτέ τον αριθμό της κάρτας σας.",
                "Δεν χρησιμοποιούμε τα δεδομένα σας για αυτοματοποιημένη λήψη αποφάσεων ή κατάρτιση προφίλ, και δεν τα πωλούμε σε κανέναν.",
              ],
            },
            {
              title: "Με ποιους τα μοιραζόμαστε",
              items: [
                "InsForge — φιλοξενία της βάσης δεδομένων μας, σε διακομιστές εντός ΕΕ (Φρανκφούρτη).",
                "Stripe Payments Europe Ltd — επεξεργασία πληρωμών. Η Stripe ενεργεί και ως αυτοτελής υπεύθυνος επεξεργασίας για την πρόληψη απάτης· δείτε την πολιτική απορρήτου της στο stripe.com/privacy.",
                "Ο πάροχος φιλοξενίας της ιστοσελίδας μας, που καταγράφει τεχνικά δεδομένα (π.χ. διεύθυνση IP) για την ασφαλή λειτουργία του site.",
                "Εταιρείες ταχυμεταφορών, μόνο με τα στοιχεία που χρειάζονται για την παράδοση.",
                "Ο λογιστής μας και οι φορολογικές αρχές, όπου το απαιτεί ο νόμος.",
                "Ορισμένοι πάροχοι (π.χ. η Stripe) ενδέχεται να διαβιβάζουν δεδομένα εκτός ΕΟΧ, με κατάλληλες εγγυήσεις (Πλαίσιο Προστασίας Δεδομένων ΕΕ-ΗΠΑ ή Τυποποιημένες Συμβατικές Ρήτρες).",
              ],
            },
            {
              title: "Για πόσο τα κρατάμε",
              items: [
                "Στοιχεία παραγγελιών και παραστατικά: για όσο διάστημα ορίζει η φορολογική νομοθεσία.",
                "Μηνύματα επικοινωνίας και αιτήματα B2B: έως 2 χρόνια από την τελευταία μας επικοινωνία, εκτός αν προκύψει συνεργασία.",
                "Newsletter: μέχρι να διαγραφείτε.",
              ],
            },
            {
              title: "Cookies & Αποθήκευση στον Browser",
              items: [
                "Δεν χρησιμοποιούμε cookies ανάλυσης επισκεψιμότητας, διαφήμισης ή παρακολούθησης.",
                "Αποθηκεύουμε τοπικά στον browser σας (localStorage) μόνο ό,τι είναι απαραίτητο για τη λειτουργία του site: το περιεχόμενο του καλαθιού σας και τη γλώσσα που επιλέξατε. Αυτά δεν αποστέλλονται σε εμάς και μπορείτε να τα διαγράψετε από τις ρυθμίσεις του browser σας.",
                "Όταν μεταβαίνετε στη σελίδα πληρωμής, η Stripe ενδέχεται να ορίσει δικά της cookies, απαραίτητα για την ασφάλεια της συναλλαγής και την πρόληψη απάτης.",
                "Αν στο μέλλον προσθέσουμε εργαλεία ανάλυσης ή μάρκετινγκ, θα ζητάμε πρώτα τη συγκατάθεσή σας.",
              ],
            },
            {
              title: "Τα δικαιώματά σας",
              items: [
                "Έχετε δικαίωμα πρόσβασης, διόρθωσης, διαγραφής, περιορισμού της επεξεργασίας, φορητότητας και εναντίωσης, καθώς και δικαίωμα να ανακαλέσετε οποιαδήποτε συγκατάθεση, χωρίς να θίγεται η νομιμότητα της επεξεργασίας πριν από την ανάκληση.",
                `Για να ασκήσετε τα δικαιώματά σας, γράψτε μας στο ${COMPANY.email}. Θα απαντήσουμε εντός ενός μήνα.`,
                "Έχετε επίσης δικαίωμα να υποβάλετε καταγγελία στην Αρχή Προστασίας Δεδομένων Προσωπικού Χαρακτήρα (Κηφισίας 1-3, 115 23 Αθήνα, www.dpa.gr).",
              ],
            },
            {
              title: "Ασφάλεια",
              items: [
                "Η ιστοσελίδα μας χρησιμοποιεί κρυπτογράφηση SSL/TLS για την προστασία των δεδομένων σας.",
                "Τα στοιχεία πληρωμής επεξεργάζονται μέσω αξιόπιστων, ασφαλών παρόχων πληρωμών — δεν αποθηκεύουμε τα στοιχεία της κάρτας σας.",
                "Ελέγχουμε τακτικά τα συστήματά μας ώστε να διασφαλίζεται η προστασία των δεδομένων σας.",
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
            "At Ellaina, we respect your privacy. This page explains what information we collect, why, how long we keep it, who we share it with, and what rights you have under the General Data Protection Regulation (GDPR) and Greek Law 4624/2019. Last updated: 24 September 2026.",
          sections: [
            {
              title: "Data Controller",
              items: [
                companyLine("en"),
                `For any question about your data, contact us at ${COMPANY.email}.`,
              ],
            },
            {
              title: "What we collect and why",
              items: [
                "Orders: name, email, phone and shipping address, to process and deliver your order (performance of a contract — GDPR Art. 6(1)(b)) and to meet our tax obligations (legal obligation — Art. 6(1)(c)). Your phone number is needed so the courier can reach you.",
                "Contact and B2B forms: name, email, (optionally) phone, business details and your message, so we can reply to your request (pre-contractual steps or legitimate interest — Art. 6(1)(b)/(f)).",
                "Newsletter: email and preferred language, only if you subscribe (consent — Art. 6(1)(a)). You can withdraw consent at any time via the unsubscribe link in every email or by writing to us.",
                "Payments: card details are entered directly on Stripe's payment page. We never receive or store your card number.",
                "We do not use your data for automated decision-making or profiling, and we never sell it.",
              ],
            },
            {
              title: "Who we share it with",
              items: [
                "InsForge — hosting of our database, on servers in the EU (Frankfurt).",
                "Stripe Payments Europe Ltd — payment processing. Stripe also acts as an independent controller for fraud prevention; see its privacy policy at stripe.com/privacy.",
                "Our website hosting provider, which logs technical data (e.g. IP address) to run the site securely.",
                "Courier companies, only with the details needed for delivery.",
                "Our accountant and the tax authorities, where required by law.",
                "Some providers (e.g. Stripe) may transfer data outside the EEA, under appropriate safeguards (EU-US Data Privacy Framework or Standard Contractual Clauses).",
              ],
            },
            {
              title: "How long we keep it",
              items: [
                "Order details and invoices: for as long as tax law requires.",
                "Contact messages and B2B inquiries: up to 2 years after our last communication, unless a business relationship follows.",
                "Newsletter: until you unsubscribe.",
              ],
            },
            {
              title: "Cookies & Browser Storage",
              items: [
                "We do not use analytics, advertising or tracking cookies.",
                "We store only what the site needs to work in your browser's local storage: your cart contents and your chosen language. This data is not sent to us, and you can clear it from your browser settings.",
                "When you go to the payment page, Stripe may set its own cookies, which are necessary for transaction security and fraud prevention.",
                "If we add analytics or marketing tools in the future, we will ask for your consent first.",
              ],
            },
            {
              title: "Your rights",
              items: [
                "You have the right to access, rectify, erase, restrict processing of, and port your data, and to object to processing, as well as to withdraw any consent at any time, without affecting the lawfulness of processing before withdrawal.",
                `To exercise your rights, write to us at ${COMPANY.email}. We will reply within one month.`,
                "You also have the right to lodge a complaint with the Hellenic Data Protection Authority (1-3 Kifisias Ave., 115 23 Athens, www.dpa.gr).",
              ],
            },
            {
              title: "Security",
              items: [
                "Our website uses SSL/TLS encryption to protect your data.",
                "Payment information is processed through trusted, secure payment gateways — we do not store your credit card details.",
                "We regularly review our systems to keep your data protected.",
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