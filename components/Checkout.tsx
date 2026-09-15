"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { startCheckout } from "@/lib/checkout";

const euro = (n: number) => `€${n.toFixed(2)}`;

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  notes: string;
};

const EMPTY_FORM: FormState = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  country: "",
  notes: "",
};

export default function Checkout() {
  const { items, subtotal } = useCart();
  const { lang } = useLanguage();
  const l = lang as "el" | "en";
  const t = translations[lang].checkoutPage;
  const cartT = translations[lang].cart;

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const update = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);
    setLoading(true);

    // Shipping/contact details are collected above but not sent anywhere
    // yet — there's no orders backend wired up. Once InsForge orders are
    // in place, this is where `form` gets saved alongside the session.
    const result = await startCheckout(items);
    setLoading(false);

    if (result.ok) {
      window.location.assign(result.url);
      return;
    }
    if (result.reason === "unconfigured") {
      setNotice(
        l === "el"
          ? "Η ηλεκτρονική πληρωμή ρυθμίζεται ακόμη. Κρατήσαμε τα στοιχεία σου — επικοινώνησε μαζί μας για να ολοκληρώσουμε την παραγγελία σου."
          : "Online payment is still being set up. We've noted your details — please contact us to complete your order."
      );
      return;
    }
    setNotice(l === "el" ? "Κάτι πήγε στραβά. Δοκίμασε ξανά." : "Something went wrong. Please try again.");
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-28 text-center sm:px-6">
        <ShoppingBag className="h-14 w-14 text-bark/15 dark:text-cream/15" strokeWidth={1.4} />
        <h1 className="mt-5 font-heading text-2xl font-bold text-bark dark:text-cream">
          {t.emptyTitle}
        </h1>
        <p className="mt-2 font-body text-sm text-bark/55 dark:text-cream/50">
          {cartT.emptyHint}
        </p>
        <Link
          href="/shop"
          className="mt-6 rounded-full bg-secondary px-7 py-3 font-body text-sm font-semibold text-bark transition-colors hover:bg-secondary-600 hover:text-white"
        >
          {t.emptyCta}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <motion.div initial="hidden" animate="visible" variants={fadeUp}>
        <Link
          href="/shop"
          className="mb-6 inline-flex items-center gap-2 font-body text-sm font-medium text-bark/60 transition-colors hover:text-bark dark:text-cream/55 dark:hover:text-cream"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          {t.backToCart}
        </Link>

        <p className="mb-2 font-body text-xs font-semibold uppercase tracking-[0.26em] text-secondary">
          {t.eyebrow}
        </p>
        <h1 className="font-heading text-3xl font-bold tracking-tight text-bark dark:text-cream sm:text-4xl">
          {t.heading}
        </h1>
      </motion.div>

      <form
        onSubmit={handleSubmit}
        className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14"
      >
        {/* Form */}
        <div className="flex flex-col gap-10">
          <div>
            <h2 className="font-heading text-lg font-bold text-bark dark:text-cream">
              {t.contactLabel}
            </h2>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label={t.fullName} value={form.fullName} onChange={update("fullName")} required className="sm:col-span-2" />
              <Field label={t.email} type="email" value={form.email} onChange={update("email")} required />
              <Field label={t.phone} type="tel" value={form.phone} onChange={update("phone")} required />
            </div>
          </div>

          <div>
            <h2 className="font-heading text-lg font-bold text-bark dark:text-cream">
              {t.shippingLabel}
            </h2>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label={t.address} value={form.address} onChange={update("address")} required className="sm:col-span-2" />
              <Field label={t.city} value={form.city} onChange={update("city")} required />
              <Field label={t.postalCode} value={form.postalCode} onChange={update("postalCode")} required />
              <Field label={t.country} value={form.country} onChange={update("country")} required className="sm:col-span-2" />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-body text-xs uppercase tracking-wide text-bark/50 dark:text-cream/40">
              {t.notes}
            </label>
            <textarea
              value={form.notes}
              onChange={update("notes")}
              rows={3}
              className="w-full rounded-xl border border-light bg-white px-4 py-3 font-body text-sm text-bark outline-none transition-colors focus:border-secondary dark:border-white/10 dark:bg-night-subtle dark:text-cream"
            />
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-light/80 bg-white p-6 dark:border-white/8 dark:bg-night-subtle">
            <h2 className="font-heading text-lg font-bold text-bark dark:text-cream">
              {t.orderSummary}
            </h2>

            <ul className="mt-5 flex flex-col gap-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <div className="relative h-16 w-13 shrink-0 overflow-hidden rounded-lg bg-cream dark:bg-night">
                    {item.image ? (
                      <Image src={item.image} alt={item.name[l]} fill className="object-contain p-1" sizes="52px" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Image src="/images/logo-drop.png" alt="" width={22} height={28} className="opacity-25" aria-hidden />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 items-start justify-between gap-2">
                    <div>
                      <p className="font-heading text-sm font-bold text-bark dark:text-cream">{item.name[l]}</p>
                      <p className="font-body text-xs text-bark/50 dark:text-cream/45">
                        {item.volume} · {item.quantity} × {euro(item.price)}
                      </p>
                    </div>
                    <span className="whitespace-nowrap font-heading text-sm font-bold text-primary dark:text-secondary">
                      {euro(item.price * item.quantity)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex items-center justify-between border-t border-light/70 pt-4 dark:border-white/8">
              <span className="font-body text-sm font-medium text-bark/70 dark:text-cream/65">{cartT.subtotal}</span>
              <span className="font-heading text-xl font-bold text-bark dark:text-cream">{euro(subtotal)}</span>
            </div>
            <p className="mt-1 font-body text-xs text-bark/45 dark:text-cream/40">
              {cartT.shippingNote}{" "}
              <Link href="/shipping" className="underline decoration-secondary/50 underline-offset-2 hover:text-secondary">
                {l === "el" ? "Δες την πολιτική αποστολής" : "See shipping policy"}
              </Link>
            </p>

            {notice && (
              <p className="mt-4 rounded-lg bg-secondary/12 px-3 py-2.5 font-body text-xs leading-relaxed text-bark/80 dark:text-cream/70">
                {notice}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-secondary py-3.5 font-body text-sm font-semibold tracking-wide text-bark transition-all duration-200 hover:bg-secondary-600 hover:text-white active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {t.completeOrder}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  className,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-2 block font-body text-xs uppercase tracking-wide text-bark/50 dark:text-cream/40">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-xl border border-light bg-white px-4 py-3 font-body text-sm text-bark outline-none transition-colors focus:border-secondary dark:border-white/10 dark:bg-night-subtle dark:text-cream"
      />
    </div>
  );
}