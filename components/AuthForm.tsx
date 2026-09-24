"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2, ArrowRight, ChevronDown, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth, type AuthUser } from "@/context/AuthContext";
import { resendVerification, signIn, signUp, verifyEmail } from "@/app/actions/auth";

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

type Mode = "login" | "register";

const COPY = {
  el: {
    login: {
      eyebrow: "Καλώς ήρθες πίσω",
      heading: "Σύνδεση στον λογαριασμό σου",
      sub: "Δες τις παραγγελίες σου και συνέχισε από εκεί που έμεινες.",
      submit: "Σύνδεση",
      forgot: "Ξέχασες τον κωδικό;",
      switchPrompt: "Δεν έχεις λογαριασμό;",
      switchCta: "Δημιούργησε έναν",
      switchHref: "/register",
    },
    register: {
      eyebrow: "Καλώς όρισες στην Ellaina",
      heading: "Δημιούργησε λογαριασμό",
      sub: "Γρήγορο checkout, ιστορικό παραγγελιών, και πρώτη πρόσβαση σε νέες κυκλοφορίες.",
      submit: "Εγγραφή",
      forgot: null,
      switchPrompt: "Έχεις ήδη λογαριασμό;",
      switchCta: "Σύνδεση",
      switchHref: "/login",
    },
    firstName: "* Όνομα",
    lastName: "* Επώνυμο",
    gender: "Φύλο",
    genderOptions: ["Γυναίκα", "Άνδρας", "Προτιμώ να μην απαντήσω"],
    email: "* Email",
    password: "* Κωδικός",
    confirmPassword: "* Επιβεβαίωση κωδικού",
    backHome: "← Επιστροφή στην αρχική",
    verify: {
      eyebrow: "Επιβεβαίωση email",
      heading: "Έλεγξε τα email σου",
      sub: (email: string) => `Στείλαμε έναν 6ψήφιο κωδικό στο ${email}. Γράψε τον παρακάτω για να ενεργοποιήσεις τον λογαριασμό σου.`,
      code: "* Κωδικός επιβεβαίωσης",
      submit: "Επιβεβαίωση",
      resend: "Αποστολή νέου κωδικού",
      resent: "Σου στείλαμε νέο κωδικό.",
    },
    errors: {
      invalid_credentials: "Λάθος email ή κωδικός.",
      email_not_verified: "Πρέπει πρώτα να επιβεβαιώσεις το email σου.",
      email_taken: "Υπάρχει ήδη λογαριασμός με αυτό το email.",
      invalid_code: "Ο κωδικός δεν είναι σωστός ή έχει λήξει.",
      weak_password: "Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες.",
      mismatch: "Οι κωδικοί δεν ταιριάζουν.",
      not_signed_in: "Η σύνδεση έληξε. Συνδέσου ξανά.",
      unknown: "Κάτι πήγε στραβά. Δοκίμασε ξανά.",
    },
    quote: "«Υγρό χρυσάφι από την καρδιά της Μεσογείου.»",
  },
  en: {
    login: {
      eyebrow: "Welcome back",
      heading: "Sign in to your account",
      sub: "See your orders and pick up right where you left off.",
      submit: "Sign in",
      forgot: "Forgot your password?",
      switchPrompt: "Don't have an account?",
      switchCta: "Create one",
      switchHref: "/register",
    },
    register: {
      eyebrow: "Welcome to Ellaina",
      heading: "Create your account",
      sub: "Faster checkout, order history, and first access to new releases.",
      submit: "Create account",
      forgot: null,
      switchPrompt: "Already have an account?",
      switchCta: "Sign in",
      switchHref: "/login",
    },
    firstName: "* First name",
    lastName: "* Last name",
    gender: "Gender",
    genderOptions: ["Female", "Male", "Prefer not to say"],
    email: "* Email",
    password: "* Password",
    confirmPassword: "* Confirm password",
    backHome: "← Back to home",
    verify: {
      eyebrow: "Confirm your email",
      heading: "Check your inbox",
      sub: (email: string) => `We sent a 6-digit code to ${email}. Enter it below to activate your account.`,
      code: "* Verification code",
      submit: "Verify",
      resend: "Send a new code",
      resent: "We've sent you a new code.",
    },
    errors: {
      invalid_credentials: "Wrong email or password.",
      email_not_verified: "Please confirm your email first.",
      email_taken: "An account with this email already exists.",
      invalid_code: "That code is wrong or has expired.",
      weak_password: "Your password needs at least 6 characters.",
      mismatch: "Passwords don't match.",
      not_signed_in: "Your session expired. Please sign in again.",
      unknown: "Something went wrong. Please try again.",
    },
    quote: "\"Liquid gold from the heart of the Mediterranean.\"",
  },
} as const;

export default function AuthForm({ mode }: { mode: Mode }) {
  const { lang } = useLanguage();
  const { login, updateUser } = useAuth();
  const router = useRouter();
  const t = COPY[lang as "el" | "en"] ?? COPY.el;
  const m = t[mode];

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  // Set once the account needs its 6-digit email code.
  const [pending, setPending] = useState<{ email: string; gender: string } | null>(null);

  const finish = async (user: AuthUser, gender?: string) => {
    login(user);
    if (gender) await updateUser({ gender });
    router.push("/profile");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const firstName = String(data.get("firstName") ?? "").trim();
    const lastName = String(data.get("lastName") ?? "").trim();
    const gender = String(data.get("gender") ?? "");

    if (mode === "register" && password !== String(data.get("confirmPassword") ?? "")) {
      setError(t.errors.mismatch);
      return;
    }

    setLoading(true);
    try {
      if (mode === "login") {
        const result = await signIn(email, password);
        if (result.ok) return await finish(result.user);
        if (result.code === "email_not_verified") {
          await resendVerification(email);
          setPending({ email, gender: "" });
          return;
        }
        setError(t.errors[result.code]);
        return;
      }

      const result = await signUp({
        email,
        password,
        name: [firstName, lastName].filter(Boolean).join(" "),
      });
      if (!result.ok) {
        setError(t.errors[result.code]);
        return;
      }
      if (result.needsVerification || !result.user) {
        setPending({ email, gender });
        return;
      }
      await finish(result.user, gender);
    } catch {
      setError(t.errors.unknown);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!pending) return;
    setError(null);
    setInfo(null);
    const code = String(new FormData(e.currentTarget).get("code") ?? "");

    setLoading(true);
    try {
      const result = await verifyEmail(pending.email, code);
      if (!result.ok) {
        setError(t.errors[result.code]);
        return;
      }
      await finish(result.user, pending.gender || undefined);
    } catch {
      setError(t.errors.unknown);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!pending) return;
    setError(null);
    const result = await resendVerification(pending.email);
    if (result.ok) setInfo(t.verify.resent);
    else setError(t.errors[result.code]);
  };

  const eyebrow = pending ? t.verify.eyebrow : m.eyebrow;
  const heading = pending ? t.verify.heading : m.heading;
  const sub = pending ? t.verify.sub(pending.email) : m.sub;

  return (
    <div className="grid min-h-[calc(100vh-5rem)] grid-cols-1 lg:grid-cols-2">
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

          <motion.p
            variants={fadeUp}
            className="mb-3 mt-8 font-body text-xs font-semibold uppercase tracking-[0.26em] text-secondary"
          >
            {eyebrow}
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="font-heading text-3xl font-bold leading-tight text-bark dark:text-cream"
          >
            {heading}
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-3 font-body text-sm leading-relaxed text-bark/60 dark:text-cream/55"
          >
            {sub}
          </motion.p>

          {(error || info) && (
            <p
              role={error ? "alert" : "status"}
              className={`mt-6 rounded-lg px-3 py-2.5 font-body text-sm ${
                error
                  ? "bg-red-500/10 text-red-700 dark:text-red-300"
                  : "bg-secondary/12 text-bark/80 dark:text-cream/75"
              }`}
            >
              {error ?? info}
            </p>
          )}

          {pending ? (
            <form onSubmit={handleVerify} className="mt-9 flex flex-col gap-5">
              <FloatingField
                id="auth-code"
                name="code"
                label={t.verify.code}
                autoComplete="one-time-code"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
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
                    {t.verify.submit}
                    <ArrowRight className="h-4 w-4" strokeWidth={2} />
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleResend}
                className="font-body text-xs font-medium text-bark/50 transition-colors hover:text-secondary dark:text-cream/45"
              >
                {t.verify.resend}
              </button>
            </form>
          ) : (
          <motion.form
            variants={fadeUp}
            onSubmit={handleSubmit}
            className="mt-9 flex flex-col gap-5"
          >
            {mode === "register" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <FloatingField id="auth-first" name="firstName" label={t.firstName} autoComplete="given-name" />
                  <FloatingField id="auth-last" name="lastName" label={t.lastName} autoComplete="family-name" />
                </div>

                <FloatingSelect
                  id="auth-gender"
                  name="gender"
                  label={t.gender}
                  options={t.genderOptions}
                />
              </>
            )}

            <FloatingField
              id="auth-email"
              name="email"
              type="email"
              label={t.email}
              autoComplete="email"
            />

            <div>
              <FloatingField
                id="auth-password"
                name="password"
                type={showPassword ? "text" : "password"}
                label={t.password}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
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
              {mode === "login" && m.forgot && (
                <Link
                  href="/forgot-password"
                  className="mt-2 inline-block font-body text-xs font-medium text-bark/50 transition-colors hover:text-secondary dark:text-cream/45"
                >
                  {m.forgot}
                </Link>
              )}
            </div>

            {mode === "register" && (
              <FloatingField
                id="auth-confirm"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                label={t.confirmPassword}
                autoComplete="new-password"
              />
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
                  {m.submit}
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </>
              )}
            </button>
          </motion.form>
          )}

          <motion.p
            variants={fadeUp}
            className="mt-8 text-center font-body text-sm text-bark/60 dark:text-cream/50"
          >
            {m.switchPrompt}{" "}
            <Link
              href={m.switchHref}
              className="font-semibold text-secondary transition-colors hover:text-secondary-600"
            >
              {m.switchCta}
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
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
  inputMode,
  pattern,
  maxLength,
}: {
  id: string;
  name?: string;
  label: string;
  type?: string;
  autoComplete?: string;
  trailing?: React.ReactNode;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  pattern?: string;
  maxLength?: number;
}) {
  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        inputMode={inputMode}
        pattern={pattern}
        maxLength={maxLength}
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

function FloatingSelect({
  id,
  name,
  label,
  options,
}: {
  id: string;
  name?: string;
  label: string;
  options: readonly string[];
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Keeps this participating in the form's FormData like a real <select> */}
      <input type="hidden" name={name} value={value ?? ""} required />

      <button
        id={id}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`peer flex w-full items-center justify-between rounded-xl border bg-white text-left font-body text-bark transition-colors duration-200 focus:outline-none dark:bg-white/[0.04] dark:text-cream ${
          value ? "px-4 pb-2.5 pt-6 text-[0.9375rem]" : "px-4 py-4 text-[0.9375rem]"
        } ${
          open
            ? "border-secondary ring-1 ring-secondary/40"
            : "border-bark/15 dark:border-cream/15"
        }`}
      >
        <span className={value ? "" : "text-bark/40 dark:text-cream/40"}>
          {value ?? label}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-bark/40 transition-transform duration-200 dark:text-cream/35 ${open ? "rotate-180" : ""}`}
          strokeWidth={1.8}
        />
      </button>

      {value && (
        <label
          htmlFor={id}
          className={`pointer-events-none absolute left-4 top-2.5 font-body text-[0.6875rem] tracking-wide transition-colors duration-200 ${
            open ? "text-secondary" : "text-bark/40 dark:text-cream/40"
          }`}
        >
          {label}
        </label>
      )}

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-20 mt-2 w-full overflow-hidden rounded-xl border border-bark/15 bg-white py-1.5 shadow-[0_16px_44px_-12px_rgba(61,43,31,0.28)] dark:border-cream/15 dark:bg-night-subtle"
          >
            {options.map((option) => (
              <li key={option} role="option" aria-selected={value === option}>
                <button
                  type="button"
                  onClick={() => {
                    setValue(option);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-left font-body text-sm text-bark/80 transition-colors hover:bg-secondary/10 hover:text-bark dark:text-cream/75 dark:hover:bg-white/5 dark:hover:text-cream"
                >
                  {option}
                  {value === option && (
                    <Check className="h-3.5 w-3.5 text-secondary" strokeWidth={2.2} />
                  )}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}