"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { resetPasswordWithCode, sendPasswordReset } from "@/app/actions/auth";

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
    sub: "Γράψε το email του λογαριασμού σου και θα σου στείλουμε έναν 6ψήφιο κωδικό επαναφοράς.",
    email: "Email",
    submit: "Αποστολή κωδικού",
    codeHeading: "Όρισε νέο κωδικό",
    codeSub: (email: string) => `Αν υπάρχει λογαριασμός για το ${email}, σου στείλαμε έναν 6ψήφιο κωδικό. Γράψε τον μαζί με τον νέο σου κωδικό.`,
    code: "Κωδικός από το email",
    password: "Νέος κωδικός",
    confirmPassword: "Επιβεβαίωση κωδικού",
    save: "Αποθήκευση κωδικού",
    mismatch: "Οι κωδικοί δεν ταιριάζουν.",
    invalidCode: "Ο κωδικός δεν είναι σωστός ή έχει λήξει.",
    weakPassword: "Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες.",
    genericError: "Κάτι πήγε στραβά. Δοκίμασε ξανά.",
    backHome: "← Επιστροφή στην αρχική",
    backLogin: "Επιστροφή στη σύνδεση",
    quote: "«Υγρό χρυσάφι από την καρδιά της Μεσογείου.»",
    successHeading: "Ο κωδικός άλλαξε",
    successSub: "Μπορείς πλέον να συνδεθείς με τον νέο σου κωδικό.",
  },
  en: {
    eyebrow: "Password reset",
    heading: "Forgot your password?",
    sub: "Enter the email on your account and we'll send you a 6-digit reset code.",
    email: "Email",
    submit: "Send reset code",
    codeHeading: "Set a new password",
    codeSub: (email: string) => `If an account exists for ${email}, we've sent it a 6-digit code. Enter it with your new password.`,
    code: "Code from the email",
    password: "New password",
    confirmPassword: "Confirm password",
    save: "Save password",
    mismatch: "Passwords don't match.",
    invalidCode: "That code is wrong or has expired.",
    weakPassword: "Your password needs at least 6 characters.",
    genericError: "Something went wrong. Please try again.",
    backHome: "← Back to home",
    backLogin: "Back to sign in",
    quote: "\"Liquid gold from the heart of the Mediterranean.\"",
    successHeading: "Password updated",
    successSub: "You can now sign in with your new password.",
  },
} as const;

export default function ForgotPasswordForm() {
  const { lang } = useLanguage();
  const t = COPY[lang as "el" | "en"] ?? COPY.el;

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"email" | "code" | "done">("email");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const submitted = step === "done";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const address = String(new FormData(e.currentTarget).get("email") ?? "").trim();

    setLoading(true);
    try {
      // Always move on, whether or not the account exists, so the form
      // can't be used to discover which emails have accounts.
      await sendPasswordReset(address);
      setEmail(address);
      setStep("code");
    } catch {
      setError(t.genericError);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const data = new FormData(e.currentTarget);
    const code = String(data.get("code") ?? "");
    const password = String(data.get("password") ?? "");
    if (password !== String(data.get("confirmPassword") ?? "")) {
      setError(t.mismatch);
      return;
    }

    setLoading(true);
    try {
      const result = await resetPasswordWithCode(email, code, password);
      if (result.ok) setStep("done");
      else if (result.code === "weak_password") setError(t.weakPassword);
      else if (result.code === "invalid_code") setError(t.invalidCode);
      else setError(t.genericError);
    } catch {
      setError(t.genericError);
    } finally {
      setLoading(false);
    }
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
                <CheckCircle2 className="h-5 w-5 text-secondary" strokeWidth={1.8} />
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
                {step === "code" ? t.codeHeading : t.heading}
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className="mt-3 font-body text-sm leading-relaxed text-bark/60 dark:text-cream/55"
              >
                {step === "code" ? t.codeSub(email) : t.sub}
              </motion.p>

              {error && (
                <p
                  role="alert"
                  className="mt-6 rounded-lg bg-red-500/10 px-3 py-2.5 font-body text-sm text-red-700 dark:text-red-300"
                >
                  {error}
                </p>
              )}

              {step === "code" ? (
                <form onSubmit={handleReset} className="mt-9 flex flex-col gap-5">
                  <FloatingField id="forgot-code" name="code" label={t.code} autoComplete="one-time-code" />
                  <FloatingField id="forgot-password" name="password" type="password" label={t.password} autoComplete="new-password" />
                  <FloatingField id="forgot-confirm" name="confirmPassword" type="password" label={t.confirmPassword} autoComplete="new-password" />
                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 flex items-center justify-center gap-2 rounded-full bg-secondary py-3.5 font-body text-sm font-semibold tracking-wide text-bark transition-all duration-200 hover:bg-secondary-600 hover:text-white active:scale-[0.98] disabled:opacity-70"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        {t.save}
                        <ArrowRight className="h-4 w-4" strokeWidth={2} />
                      </>
                    )}
                  </button>
                </form>
              ) : (
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
              )}

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