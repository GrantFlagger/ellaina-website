"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
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
    eyebrow: "Νέος κωδικός",
    heading: "Ορισμός νέου κωδικού",
    sub: "Επίλεξε έναν νέο κωδικό για τον λογαριασμό σου.",
    password: "Νέος κωδικός",
    confirmPassword: "Επιβεβαίωση κωδικού",
    submit: "Αποθήκευση κωδικού",
    backHome: "← Επιστροφή στην αρχική",
    mismatch: "Οι κωδικοί δεν ταιριάζουν",
    invalidLink: "Ο σύνδεσμος επαναφοράς δεν είναι έγκυρος ή έχει λήξει.",
    requestNew: "Ζήτησε νέο σύνδεσμο",
    quote: "«Υγρό χρυσάφι από την καρδιά της Μεσογείου.»",
    successHeading: "Ο κωδικός άλλαξε",
    successSub: "Μπορείς πλέον να συνδεθείς με τον νέο σου κωδικό.",
    goToLogin: "Μετάβαση στη σύνδεση",
  },
  en: {
    eyebrow: "New password",
    heading: "Set a new password",
    sub: "Choose a new password for your account.",
    password: "New password",
    confirmPassword: "Confirm password",
    submit: "Save password",
    backHome: "← Back to home",
    mismatch: "Passwords don't match",
    invalidLink: "This reset link is invalid or has expired.",
    requestNew: "Request a new link",
    quote: "\"Liquid gold from the heart of the Mediterranean.\"",
    successHeading: "Password updated",
    successSub: "You can now sign in with your new password.",
    goToLogin: "Go to sign in",
  },
} as const;

export default function ResetPasswordForm() {
  const { lang } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const t = COPY[lang as "el" | "en"] ?? COPY.el;

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const data = new FormData(e.currentTarget);
    const password = String(data.get("password") ?? "");
    const confirmPassword = String(data.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      setError(t.mismatch);
      return;
    }

    setLoading(true);

    // TODO: wire this up once the backend is ready —
    // e.g. insforge.auth.resetPassword(token, password).
    void token;
    void password;
    await new Promise((resolve) => setTimeout(resolve, 900));

    setLoading(false);
    setSuccess(true);
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

          {!token ? (
            <motion.div variants={fadeUp} className="mt-10">
              <h1 className="font-heading text-2xl font-bold leading-tight text-bark dark:text-cream">
                {t.invalidLink}
              </h1>
              <Link
                href="/forgot-password"
                className="mt-6 inline-flex items-center gap-2 font-body text-sm font-semibold text-secondary transition-colors hover:text-secondary-600"
              >
                {t.requestNew}
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Link>
            </motion.div>
          ) : success ? (
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

              <button
                onClick={() => router.push("/login")}
                className="mt-8 flex items-center justify-center gap-2 rounded-full bg-secondary px-7 py-3.5 font-body text-sm font-semibold tracking-wide text-bark transition-all duration-200 hover:bg-secondary-600 hover:text-white active:scale-[0.98]"
              >
                {t.goToLogin}
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </button>
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
                  id="reset-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  label={t.password}
                  autoComplete="new-password"
                  trailing={
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="text-bark/40 transition-colors hover:text-secondary dark:text-cream/35"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" strokeWidth={1.8} />
                      ) : (
                        <Eye className="h-4 w-4" strokeWidth={1.8} />
                      )}
                    </button>
                  }
                />

                <FloatingField
                  id="reset-confirm"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  label={t.confirmPassword}
                  autoComplete="new-password"
                />

                {error && (
                  <p className="font-body text-xs font-medium text-red-500">{error}</p>
                )}

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
  trailing,
}: {
  id: string;
  name?: string;
  label: string;
  type?: string;
  autoComplete?: string;
  trailing?: React.ReactNode;
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
      {trailing && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">{trailing}</div>
      )}
    </div>
  );
}