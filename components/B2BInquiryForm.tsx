"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Send } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

import Honeypot, { isBot } from "@/components/Honeypot";
type FormState = {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  message: string;
};

const EMPTY: FormState = {
  businessName: "",
  contactName: "",
  email: "",
  phone: "",
  message: "",
};

export default function B2BInquiryForm() {
  const { lang } = useLanguage();
  const l = lang as "el" | "en";

  const [form, setForm] = useState<FormState>(EMPTY);
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  const t =
    l === "el"
      ? {
          businessName: "Επιχείρηση / Παραγωγή",
          contactName: "Όνομα επικοινωνίας",
          email: "Email",
          phone: "Τηλέφωνο",
          message: "Πες μας λίγα λόγια για τη συνεργασία που σκέφτεσαι",
          submit: "Στείλε το αίτημα",
          sent: "Ευχαριστούμε! Θα επικοινωνήσουμε μαζί σου σύντομα.",
          error: "Κάτι πήγε στραβά. Δοκίμασε ξανά ή γράψε μας απευθείας.",
        }
      : {
          businessName: "Business / Producer",
          contactName: "Contact name",
          email: "Email",
          phone: "Phone",
          message: "Tell us a bit about the partnership you're thinking of",
          submit: "Send inquiry",
          sent: "Thank you! We'll be in touch soon.",
          error: "Something went wrong. Please try again or email us directly.",
        };

  const update = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isBot(e.currentTarget as HTMLFormElement)) {
      setStatus("sent");
      setForm(EMPTY);
      return;
    }
    setStatus("loading");

    let response: Response;
    try {
      response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "b2b", ...form, language: lang }),
      });
    } catch {
      setStatus("error");
      return;
    }

    if (!response.ok) {
      setStatus("error");
      return;
    }
    setStatus("sent");
    setForm(EMPTY);
  };

  if (status === "sent") {
    return (
      <p className="rounded-xl bg-secondary/12 px-5 py-4 text-center font-body text-sm font-medium text-bark dark:text-cream">
        {t.sent}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Honeypot />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="b2b-businessName" className="mb-2 block font-body text-xs uppercase tracking-wide text-bark/50 dark:text-cream/40">
            {t.businessName}
          </label>
          <input id="b2b-businessName"
            type="text"
            required
            value={form.businessName}
            onChange={update("businessName")}
            className="w-full rounded-xl border border-light bg-white px-4 py-3 font-body text-sm text-bark outline-none transition-colors focus:border-secondary dark:border-white/10 dark:bg-night-subtle dark:text-cream"
          />
        </div>
        <div>
          <label htmlFor="b2b-contactName" className="mb-2 block font-body text-xs uppercase tracking-wide text-bark/50 dark:text-cream/40">
            {t.contactName}
          </label>
          <input id="b2b-contactName"
            type="text"
            required
            value={form.contactName}
            onChange={update("contactName")}
            className="w-full rounded-xl border border-light bg-white px-4 py-3 font-body text-sm text-bark outline-none transition-colors focus:border-secondary dark:border-white/10 dark:bg-night-subtle dark:text-cream"
          />
        </div>
        <div>
          <label htmlFor="b2b-email" className="mb-2 block font-body text-xs uppercase tracking-wide text-bark/50 dark:text-cream/40">
            {t.email}
          </label>
          <input id="b2b-email"
            type="email"
            required
            value={form.email}
            onChange={update("email")}
            className="w-full rounded-xl border border-light bg-white px-4 py-3 font-body text-sm text-bark outline-none transition-colors focus:border-secondary dark:border-white/10 dark:bg-night-subtle dark:text-cream"
          />
        </div>
        <div>
          <label htmlFor="b2b-phone" className="mb-2 block font-body text-xs uppercase tracking-wide text-bark/50 dark:text-cream/40">
            {t.phone}
          </label>
          <input id="b2b-phone"
            type="tel"
            value={form.phone}
            onChange={update("phone")}
            className="w-full rounded-xl border border-light bg-white px-4 py-3 font-body text-sm text-bark outline-none transition-colors focus:border-secondary dark:border-white/10 dark:bg-night-subtle dark:text-cream"
          />
        </div>
      </div>

      <div>
        <label htmlFor="b2b-message" className="mb-2 block font-body text-xs uppercase tracking-wide text-bark/50 dark:text-cream/40">
          {t.message}
        </label>
        <textarea id="b2b-message"
          required
          rows={4}
          value={form.message}
          onChange={update("message")}
          className="w-full rounded-xl border border-light bg-white px-4 py-3 font-body text-sm text-bark outline-none transition-colors focus:border-secondary dark:border-white/10 dark:bg-night-subtle dark:text-cream"
        />
      </div>

      <p className="font-body text-xs leading-relaxed text-bark/60 dark:text-cream/55">
        {lang === "el"
          ? "Χρησιμοποιούμε αυτά τα στοιχεία μόνο για να απαντήσουμε στο αίτημά σου. Δες την "
          : "We only use these details to respond to your request. See our "}
        <Link href="/privacy" className="underline underline-offset-2 hover:text-secondary">
          {lang === "el" ? "Πολιτική Απορρήτου" : "Privacy Policy"}
        </Link>
        .
      </p>

      {status === "error" && (
        <p role="alert" className="font-body text-xs font-medium text-red-500">{t.error}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-2 flex items-center justify-center gap-2 rounded-full bg-secondary py-3.5 font-body text-sm font-semibold tracking-wide text-bark transition-all duration-200 hover:bg-secondary-600 hover:text-white active:scale-[0.98] disabled:opacity-60"
      >
        {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" strokeWidth={2} />}
        {t.submit}
      </button>
    </form>
  );
}