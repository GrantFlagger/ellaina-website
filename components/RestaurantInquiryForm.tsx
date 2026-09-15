"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { insforge } from "@/lib/insforge";

type FormState = {
  restaurantName: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
  message: string;
};

const EMPTY: FormState = {
  restaurantName: "",
  contactName: "",
  email: "",
  phone: "",
  city: "",
  message: "",
};

export default function RestaurantInquiryForm() {
  const { lang } = useLanguage();

  const [form, setForm] = useState<FormState>(EMPTY);
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  const t =
    lang === "el"
      ? {
          restaurantName: "Όνομα εστιατορίου",
          contactName: "Όνομα επικοινωνίας",
          email: "Email",
          phone: "Τηλέφωνο",
          city: "Πόλη",
          message: "Πες μας λίγα λόγια για το εστιατόριο και την ποσότητα που σκέφτεσαι",
          submit: "Ζήτησε πρόταση",
          sent: "Ευχαριστούμε! Θα επικοινωνήσουμε μαζί σου σύντομα για το private-label πρόγραμμα.",
          error: "Κάτι πήγε στραβά. Δοκίμασε ξανά ή γράψε μας απευθείας.",
        }
      : {
          restaurantName: "Restaurant name",
          contactName: "Contact name",
          email: "Email",
          phone: "Phone",
          city: "City",
          message: "Tell us a bit about your restaurant and the quantity you're thinking of",
          submit: "Request a proposal",
          sent: "Thank you! We'll be in touch soon about the private-label program.",
          error: "Something went wrong. Please try again or email us directly.",
        };

  const update = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    const { error } = await insforge.database.from("restaurant_inquiries").insert([
      {
        restaurant_name: form.restaurantName,
        contact_name: form.contactName,
        email: form.email,
        phone: form.phone,
        city: form.city,
        message: form.message,
        language: lang,
      },
    ]);

    if (error) {
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block font-body text-xs uppercase tracking-wide text-bark/50 dark:text-cream/40">
            {t.restaurantName}
          </label>
          <input
            type="text"
            required
            value={form.restaurantName}
            onChange={update("restaurantName")}
            className="w-full rounded-xl border border-light bg-white px-4 py-3 font-body text-sm text-bark outline-none transition-colors focus:border-secondary dark:border-white/10 dark:bg-night-subtle dark:text-cream"
          />
        </div>
        <div>
          <label className="mb-2 block font-body text-xs uppercase tracking-wide text-bark/50 dark:text-cream/40">
            {t.contactName}
          </label>
          <input
            type="text"
            required
            value={form.contactName}
            onChange={update("contactName")}
            className="w-full rounded-xl border border-light bg-white px-4 py-3 font-body text-sm text-bark outline-none transition-colors focus:border-secondary dark:border-white/10 dark:bg-night-subtle dark:text-cream"
          />
        </div>
        <div>
          <label className="mb-2 block font-body text-xs uppercase tracking-wide text-bark/50 dark:text-cream/40">
            {t.email}
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={update("email")}
            className="w-full rounded-xl border border-light bg-white px-4 py-3 font-body text-sm text-bark outline-none transition-colors focus:border-secondary dark:border-white/10 dark:bg-night-subtle dark:text-cream"
          />
        </div>
        <div>
          <label className="mb-2 block font-body text-xs uppercase tracking-wide text-bark/50 dark:text-cream/40">
            {t.phone}
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={update("phone")}
            className="w-full rounded-xl border border-light bg-white px-4 py-3 font-body text-sm text-bark outline-none transition-colors focus:border-secondary dark:border-white/10 dark:bg-night-subtle dark:text-cream"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-2 block font-body text-xs uppercase tracking-wide text-bark/50 dark:text-cream/40">
            {t.city}
          </label>
          <input
            type="text"
            value={form.city}
            onChange={update("city")}
            className="w-full rounded-xl border border-light bg-white px-4 py-3 font-body text-sm text-bark outline-none transition-colors focus:border-secondary dark:border-white/10 dark:bg-night-subtle dark:text-cream"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block font-body text-xs uppercase tracking-wide text-bark/50 dark:text-cream/40">
          {t.message}
        </label>
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={update("message")}
          className="w-full rounded-xl border border-light bg-white px-4 py-3 font-body text-sm text-bark outline-none transition-colors focus:border-secondary dark:border-white/10 dark:bg-night-subtle dark:text-cream"
        />
      </div>

      {status === "error" && (
        <p className="font-body text-xs font-medium text-red-500">{t.error}</p>
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