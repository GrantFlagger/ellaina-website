"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";

export default function CheckoutSuccess() {
  const { clearCart } = useCart();
  const { lang } = useLanguage();

  // The cart's job ends once Stripe redirects back here after a
  // successful payment — clear it so a refresh or new visit starts fresh.
  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-28 text-center sm:px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <CheckCircle2 className="h-16 w-16 text-secondary" strokeWidth={1.5} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-6 font-heading text-3xl font-bold tracking-tight text-bark dark:text-cream sm:text-4xl"
      >
        {lang === "el" ? "Η παραγγελία σου επιβεβαιώθηκε" : "Your order is confirmed"}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-4 max-w-md font-body text-sm leading-relaxed text-bark/65 dark:text-cream/60"
      >
        {lang === "el"
          ? "Σε ευχαριστούμε! Θα λάβεις σύντομα email με τα στοιχεία της παραγγελίας σου."
          : "Thank you! You'll receive an email shortly with your order details."}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8"
      >
        <Link
          href="/shop"
          className="rounded-full bg-secondary px-7 py-3 font-body text-sm font-semibold text-bark transition-colors hover:bg-secondary-600 hover:text-white"
        >
          {lang === "el" ? "Συνέχεια αγορών" : "Continue shopping"}
        </Link>
      </motion.div>
    </div>
  );
}