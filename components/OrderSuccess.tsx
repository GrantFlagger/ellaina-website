"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";

export default function OrderSuccess() {
  const { clearCart } = useCart();
  const { lang } = useLanguage();

  // The order is placed once Stripe redirects here — empty the cart.
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  const copy =
    lang === "el"
      ? {
          title: "Σ' ευχαριστούμε για την παραγγελία σου!",
          body: "Λάβαμε την παραγγελία σου και θα σου στείλουμε email επιβεβαίωσης σύντομα.",
          cta: "Επιστροφή στην Αρχική",
        }
      : {
          title: "Thank you for your order!",
          body: "We've received your order and will email you a confirmation shortly.",
          cta: "Back to Home",
        };

  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <CheckCircle2 className="h-16 w-16 text-primary dark:text-secondary" strokeWidth={1.5} />
      <h1 className="mt-6 font-heading text-3xl font-bold text-bark dark:text-cream">{copy.title}</h1>
      <p className="mt-4 font-body text-base leading-relaxed text-bark/65 dark:text-cream/60">{copy.body}</p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-secondary px-8 py-3.5 font-body text-sm font-semibold tracking-wide text-bark transition-colors hover:bg-secondary-600 hover:text-white"
      >
        {copy.cta}
      </Link>
    </section>
  );
}
