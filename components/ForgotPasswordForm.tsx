"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, ArrowLeft, MailCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const COPY = {
  el: {
    eyebrow: "Επαναφορά κωδικού",
    heading: "Ξέχασες τον κωδικό σου;",
    sub: "Γράψε το email του λογαριασμού σου και θα σου στείλουμε σύνδεσμο επαναφοράς.",
    email: "Email",
    submit: "Αποστολή συνδέσμου",
    backHome: "← Επιστροφή στην αρχική",
    backLogin: "Επιστροφή στη σύνδεση",
    quote: "«Υγρό χρυσάφι από την καρδιά της Μεσογείου.»",
    successHeading: "Έλεγξε τα email σου",
    successSub: "Αν υπάρχει λογαριασμός με αυτή τη διεύθυνση, θα λάβεις σύντομα ένα email με οδηγίες επαναφοράς.",
  },
  en: {
    eyebrow: "Password reset",
    heading: "Forgot your password?",
    sub: "Enter the email on your account and we'll send you a reset link.",
    email: "Email",
    submit: "Send reset link",
    backHome: "← Back to home",
    backLogin: "Back to sign in",
    quote: "\"Liquid gold from the heart of the Mediterranean.\"",
    successHeading: "Check your inbox",
    successSub: "If an account exists for that address, you'll receive an email with reset instructions shortly.",
  },
} as const;

export default function ForgotPasswordForm() {
  const { lang } = useLanguage();
  const t = COPY[lang as "el" | "en"] ?? COPY.el;

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "");

    // TODO: wire this up once the backend is ready —
    // e.g. insforge.auth.sendPasswordReset(email).
    void email;
    await new Promise((resolve) => setTimeout(resolve, 900));

    setLoading(false);
    setSubmitted(true);
  };

  return (
    <>
      {/* Solid backdrop strip so the fixed navbar always has a solid background here,
          instead of the hero photo/gradient showing through it. */}
      <div className="h-20 w-full bg-cream dark:bg-night md:h-24" aria-hidden />

      <div className="grid min-h-[calc(100vh-11rem)] grid-cols-1 lg:grid-cols-2">
      {/* Visual panel */}
      <div className="relative hidden lg:block">
        <Image
          src="/images/hero-grove.png"
          alt="Sunlit olive groves in Epirus, Greece"
          fill
          className="object-cover object-center"
          sizes="50vw"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/25 to-primary/10"
        />
        <div className="absolute inset-x-0 bottom-0 p-12">
          <p className="max-w-sm font-heading text-2xl italic leading-snug text-white">
            {t.quote}
          </p>
          <p className="mt-4 font-body text-sm uppercase tracking-[0.2em] text-white/60">
            Ellaina — Preveza, Greece
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-cream px-4 py-16 dark:bg-night sm:px-6 lg:px-16">
        <motion.div
          className="w-full max-w-sm"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp}>
            <Link
              href="/"
              className="font-body text-xs font-medium text-bark/45 transition-colors hover:text-secondary dark:text-cream/40"
            >
              {t.backHome}
            </Link>
          </motion.div>

          {submitted ? (
            <motion.div variants={fadeUp} className="mt-10">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/12 ring-1 ring-secondary/25">
                <MailCheck className="h-5 w-5 text-secondary" strokeWidth={1.8} />
              </span>
              <h1 className="mt-6 font-heading text-2xl font-bold leading-tight text-bark dark:text-cream">
                {t.successHeading}
              </h1>
              <p className="mt-3 font-body text-sm leading-relaxed text-bark/60 dark:text-cream/55">
                {t.successSub}
              </p>

              <Link
                href="/login"
                className="mt-8 inline-flex items-center gap-2 font-body text-sm font-semibold text-secondary transition-colors hover:text-secondary-600"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={2} />
                {t.backLogin}
              </Link>
            </motion.div>
          ) : (
            <>
              <motion.p
                variants={fadeUp}
                className="mb-3 mt-8 font-body text-xs font-semibold uppercase tracking-[0.26em] text-secondary"
              >
                {t.eyebrow}
              </motion.p>
              <motion.h1
                variants={fadeUp}
                className="font-heading text-3xl font-bold leading-tight text-bark dark:text-cream"
              >
                {t.heading}
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className="mt-3 font-body text-sm leading-relaxed text-bark/60 dark:text-cream/55"
              >
                {t.sub}
              </motion.p>

              <motion.form
                variants={fadeUp}
                onSubmit={handleSubmit}
                className="mt-9 flex flex-col gap-5"
              >
                <FloatingField
                  id="forgot-email"
                  name="email"
                  type="email"
                  label={t.email}
                  autoComplete="email"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex items-center justify-center gap-2 rounded-full bg-secondary py-3.5 font-body text-sm font-semibold tracking-wide text-bark transition-all duration-200 hover:bg-secondary-600 hover:text-white active:scale-[0.98] disabled:opacity-70"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      {t.submit}
                      <ArrowRight className="h-4 w-4" strokeWidth={2} />
                    </>
                  )}
                </button>
              </motion.form>

              <motion.p variants={fadeUp} className="mt-8 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 font-body text-sm font-semibold text-secondary transition-colors hover:text-secondary-600"
                >
                  <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
                  {t.backLogin}
                </Link>
              </motion.p>
            </>
          )}
        </motion.div>
      </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */

function FloatingField({
  id,
  name,
  label,
  type = "text",
  autoComplete,
}: {
  id: string;
  name?: string;
  label: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        placeholder={label}
        className="peer w-full rounded-xl border border-bark/15 bg-white px-4 pb-2.5 pt-6 font-body text-[0.9375rem] text-bark placeholder-transparent transition-colors duration-200 focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary/40 dark:border-cream/15 dark:bg-white/[0.04] dark:text-cream"
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-4 top-4 font-body text-[0.9375rem] text-bark/40 transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-[0.9375rem] peer-focus:top-2.5 peer-focus:text-[0.6875rem] peer-focus:tracking-wide peer-focus:text-secondary peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:text-[0.6875rem] peer-[:not(:placeholder-shown)]:tracking-wide dark:text-cream/40"
      >
        {label}
      </label>
    </div>
  );
}