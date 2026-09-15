"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, ShoppingBag, MapPinned, ArrowRight, ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: "easeOut" as const },
  },
};

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const COPY = {
  el: {
    gemiLabel: "Αρ. Γ.Ε.ΜΗ.",
    heading1: "Χρειάζεσαι βοήθεια;",
    heading2: "Επικοινώνησε μαζί μας!",
    body: "Η ποιότητα του ελαιόλαδου μας είναι προτεραιότητά μας, και είμαστε εδώ για να βοηθήσουμε. Είτε έχεις ερωτήσεις για παραγγελία, είτε θες να μάθεις περισσότερα για τη παραγωγή μας, θα σας απαντήσουμε σύντομα.",
    firstName: "Όνομα",
    firstNamePh: "Το όνομά σου",
    lastName: "Επώνυμο",
    lastNamePh: "Το επώνυμό σου",
    email: "Email",
    emailPh: "Το email σου",
    reason: "Θέμα",
    reasonPh: "Επίλεξε θέμα",
    reasons: ["Παραγγελία", "Χονδρική", "Γενική ερώτηση", "Άλλο"],
    phone: "Τηλέφωνο",
    phoneOptional: "προαιρετικό",
    phonePh: "Το τηλέφωνό σου",
    message: "Μήνυμα",
    messagePh: "Γράψε το μήνυμά σου",
    send: "Αποστολή μηνύματος",
    sent: "Στάλθηκε ✓",
    card1Title: "Μάθε περισσότερα για την Ellaina",
    card1Cta: "Οι αξίες μας",
    card2Title: "Δες τη νέα μας συγκομιδή",
    card2Cta: "Στο κατάστημα",
    card3Title: "Πού θα μας βρεις",
    responseNote: "Απαντάμε εντός 24 ωρών για γενικές ερωτήσεις και θέματα εξυπηρέτησης.",
  },
  en: {
    gemiLabel: "Company Reg. No. (GEMI)",
    heading1: "Need help?",
    heading2: "Contact us!",
    body: "The quality of our olive oil is our priority, and we're here to help. Whether you have questions about an order or want to learn more about our production, we will get back to you shortly.",
    firstName: "First name",
    firstNamePh: "Enter your first name",
    lastName: "Last name",
    lastNamePh: "Enter your last name",
    email: "Email address",
    emailPh: "Enter your email",
    reason: "Reason",
    reasonPh: "Select your reason",
    reasons: ["Order", "Wholesale", "General inquiry", "Other"],
    phone: "Phone",
    phoneOptional: "optional",
    phonePh: "Enter your phone number",
    message: "Message",
    messagePh: "Enter your message",
    send: "Send message",
    sent: "Sent ✓",
    card1Title: "Learn more about Ellaina",
    card1Cta: "Our values",
    card2Title: "Check out our new harvest",
    card2Cta: "Go shopping",
    card3Title: "Where to find us",
    responseNote: "Our response time is 24 hours for general inquiries and customer support.",
  },
} as const;

type Copy = (typeof COPY)["el"];

export default function Contact() {
  const { lang } = useLanguage();
  const t = COPY[lang as "el" | "en"] ?? COPY.el;

  return (
    <section className="bg-cream dark:bg-night py-20 lg:py-28" aria-label="Contact">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.35fr_1fr] lg:gap-20">
          {/* Left: heading + form */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.h1
              variants={fadeUp}
              className="font-heading text-balance text-4xl font-bold leading-[1.08] tracking-tight text-bark dark:text-cream sm:text-5xl lg:text-[3.25rem]"
            >
              {t.heading1}
              <br />
              {t.heading2}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-md font-body text-[0.9375rem] leading-relaxed text-bark/60 dark:text-cream/55"
            >
              {t.body}
            </motion.p>

            <motion.div variants={fadeUp}>
              <ContactForm t={t} />
            </motion.div>
          </motion.div>

          {/* Right: sidebar link cards */}
          <motion.div
            className="flex flex-col gap-8 lg:pt-3"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <SidebarCard
              icon={User}
              title={t.card1Title}
              ctaLabel={t.card1Cta}
              href="/about"
              variant="link"
            />
            <SidebarCard
              icon={ShoppingBag}
              title={t.card2Title}
              ctaLabel={t.card2Cta}
              href="/shop"
              variant="button"
            />
            <SidebarCard icon={MapPinned} title={t.card3Title} variant="info">
              <a
                href="mailto:info@ellainaoliveoil.com"
                className="block font-body text-sm text-bark/70 dark:text-cream/60 transition-colors hover:text-secondary"
              >
                info@ellainaoliveoil.com
              </a>
              <a
                href="tel:+306987657362"
                className="mt-1 block font-body text-sm text-bark/70 dark:text-cream/60 transition-colors hover:text-secondary"
              >
                +30 698 765 7362
              </a>
              <a
                href="tel:+306977640449"
                className="mt-1 block font-body text-sm text-bark/70 dark:text-cream/60 transition-colors hover:text-secondary"
              >
                +30 697 764 0449
              </a>
              <a           
                href="https://maps.google.com/?q=Φρύνης+21,+Παγκράτι,+Αθήνα"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block font-body text-sm text-bark/70 dark:text-cream/60 transition-colors hover:text-secondary"
              >
                Φρύνης 21, Παγκράτι
              </a>
              <p className="mt-2 font-body text-xs text-bark/45 dark:text-cream/40">
                {t.gemiLabel}: 195010503000
              </p>
              <p className="mt-3 font-body text-xs leading-relaxed text-bark/45 dark:text-cream/40">
                {t.responseNote}
              </p>
            </SidebarCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function SidebarCard({
  icon: Icon,
  title,
  ctaLabel,
  href,
  variant,
  children,
}: {
  icon: typeof User;
  title: string;
  ctaLabel?: string;
  href?: string;
  variant: "link" | "button" | "info";
  children?: React.ReactNode;
}) {
  return (
    <motion.div variants={fadeUp} className="flex gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary/12 ring-1 ring-secondary/20">
        <Icon className="h-5 w-5 text-secondary" strokeWidth={1.7} />
      </span>
      <div className="flex flex-col gap-2.5 pt-0.5">
        <h3 className="font-heading text-[1.05rem] font-semibold leading-snug text-bark dark:text-cream">
          {title}
        </h3>

        {variant === "link" && href && ctaLabel && (
          <Link
            href={href}
            className="w-fit rounded-full border border-bark/20 dark:border-cream/20 px-4 py-2 font-body text-[0.8125rem] font-medium text-bark dark:text-cream transition-colors hover:border-secondary hover:text-secondary"
          >
            {ctaLabel}
          </Link>
        )}

        {variant === "button" && href && ctaLabel && (
          <Link
            href={href}
            className="group inline-flex w-fit items-center gap-1.5 font-body text-[0.8125rem] font-semibold text-secondary transition-colors hover:text-secondary-600"
          >
            {ctaLabel}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        )}

        {variant === "info" && children}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */

function ContactForm({ t }: { t: Copy }) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="mt-10 flex max-w-xl flex-col gap-7"
    >
      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
        <UnderlineField id="c-first" label={t.firstName} placeholder={t.firstNamePh} required />
        <UnderlineField id="c-last" label={t.lastName} placeholder={t.lastNamePh} required />
      </div>

      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
        <UnderlineField id="c-email" type="email" label={t.email} placeholder={t.emailPh} required />
        <UnderlineSelect id="c-reason" label={t.reason} placeholder={t.reasonPh} options={t.reasons} required />
      </div>

      <UnderlineField
        id="c-phone"
        type="tel"
        label={t.phone}
        placeholder={t.phonePh}
        optionalLabel={t.phoneOptional}
      />

      <UnderlineField
        id="c-message"
        as="textarea"
        rows={3}
        label={t.message}
        placeholder={t.messagePh}
        required
      />

      <button
        type="submit"
        className="mt-3 w-fit rounded-full bg-bark px-8 py-3.5 font-body text-sm font-semibold tracking-wide text-cream transition-colors hover:bg-secondary hover:text-bark dark:bg-secondary dark:text-bark dark:hover:bg-secondary-600"
      >
        {submitted ? t.sent : t.send}
      </button>
    </form>
  );
}

function UnderlineField({
  id,
  label,
  placeholder,
  type = "text",
  as = "input",
  rows,
  required = false,
  optionalLabel,
}: {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
  as?: "input" | "textarea";
  rows?: number;
  required?: boolean;
  optionalLabel?: string;
}) {
  const shared =
    "w-full border-0 border-b border-bark/15 dark:border-cream/15 bg-transparent px-0 py-2 font-body text-[0.9375rem] text-bark dark:text-cream placeholder:text-bark/35 dark:placeholder:text-cream/30 focus:border-secondary focus:outline-none focus:ring-0 transition-colors duration-200";

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="flex items-baseline gap-2 font-body text-xs font-semibold uppercase tracking-[0.14em] text-bark/70 dark:text-cream/55">
        {label}
        {optionalLabel && (
          <span className="font-body text-[0.6875rem] font-normal normal-case tracking-normal text-bark/35 dark:text-cream/30">
            ({optionalLabel})
          </span>
        )}
      </label>
      {as === "textarea" ? (
        <textarea
          id={id}
          rows={rows}
          placeholder={placeholder}
          required={required}
          className={`${shared} resize-none`}
        />
      ) : (
        <input id={id} type={type} placeholder={placeholder} required={required} className={shared} />
      )}
    </div>
  );
}

function UnderlineSelect({
  id,
  label,
  placeholder,
  options,
  required = false,
}: {
  id: string;
  label: string;
  placeholder: string;
  options: readonly string[];
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-bark/70 dark:text-cream/55">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          defaultValue=""
          required={required}
          className="peer w-full appearance-none border-0 border-b border-bark/15 dark:border-cream/15 bg-transparent px-0 py-2 pr-7 font-body text-[0.9375rem] font-normal text-bark/40 focus:border-secondary focus:outline-none invalid:text-bark/40 valid:text-bark valid:dark:text-cream dark:text-cream dark:invalid:text-cream/35"
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt} className="text-bark">
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-bark/40 transition-colors peer-focus:text-secondary dark:text-cream/40"
          strokeWidth={1.8}
          aria-hidden
        />
      </div>
    </div>
  );
}