"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

const euro = (n: number) => `€${n.toFixed(2)}`;

export default function CartDrawer() {
  const { items, subtotal, isOpen, closeCart, removeItem, setQuantity } = useCart();
  const { lang } = useLanguage();
  const t = translations[lang].cart;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            className="fixed inset-0 z-[60] bg-bark/40 backdrop-blur-[2px]"
            aria-hidden
          />

          {/* Panel */}
          <motion.aside
            key="cart-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-cream dark:bg-night shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label={t.title}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-light dark:border-white/10 px-6 py-5">
              <h2 className="flex items-center gap-2.5 font-heading text-lg font-bold text-bark dark:text-cream">
                <ShoppingCart className="h-5 w-5 text-secondary" strokeWidth={2} />
                {t.title}
              </h2>
              <button
                onClick={closeCart}
                aria-label="Close cart"
                className="rounded-full p-1.5 text-bark/55 dark:text-cream/55 hover:bg-bark/5 dark:hover:bg-white/5 hover:text-bark dark:hover:text-cream transition-colors"
              >
                <X className="h-5 w-5" strokeWidth={1.8} />
              </button>
            </div>

            {/* Body */}
            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                <ShoppingCart className="h-12 w-12 text-bark/15 dark:text-cream/15" strokeWidth={1.4} />
                <p className="font-heading text-lg font-semibold text-bark dark:text-cream">{t.empty}</p>
                <p className="font-body text-sm text-bark/55 dark:text-cream/50">{t.emptyHint}</p>
                <button
                  onClick={closeCart}
                  className="mt-3 rounded-full bg-secondary px-6 py-2.5 font-body text-sm font-semibold text-bark transition-colors hover:bg-secondary-600 hover:text-white"
                >
                  {t.continue}
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <ul className="flex flex-col gap-4">
                    {items.map((item) => (
                      <li
                        key={item.id}
                        className="flex gap-4 rounded-xl border border-light/80 dark:border-white/8 bg-white dark:bg-night-subtle p-3"
                      >
                        <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-cream dark:bg-night">
                          {item.image ? (
                            <Image src={item.image} alt={item.name[lang]} fill className="object-contain p-1.5" sizes="64px" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Image src="/images/logo-drop.png" alt="" width={28} height={35} className="opacity-25" aria-hidden />
                            </div>
                          )}
                        </div>

                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-heading text-sm font-bold text-bark dark:text-cream">{item.name[lang]}</p>
                              <p className="font-body text-xs text-bark/50 dark:text-cream/45">{item.volume}</p>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              aria-label={t.remove}
                              className="rounded p-1 text-bark/35 dark:text-cream/35 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" strokeWidth={1.8} />
                            </button>
                          </div>

                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="flex items-center overflow-hidden rounded-full border border-light dark:border-white/10 bg-cream dark:bg-night">
                              <button
                                onClick={() => setQuantity(item.id, item.quantity - 1)}
                                className="flex h-7 w-7 items-center justify-center text-bark/60 dark:text-cream/50 hover:text-bark dark:hover:text-cream transition-colors"
                                aria-label="Decrease"
                              >
                                −
                              </button>
                              <span className="w-6 text-center font-body text-sm font-semibold text-bark dark:text-cream">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => setQuantity(item.id, item.quantity + 1)}
                                className="flex h-7 w-7 items-center justify-center text-bark/60 dark:text-cream/50 hover:text-bark dark:hover:text-cream transition-colors"
                                aria-label="Increase"
                              >
                                +
                              </button>
                            </div>
                            <span className="font-heading text-sm font-bold text-primary dark:text-secondary">
                              {euro(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer */}
                <div className="border-t border-light dark:border-white/10 px-6 py-5">
                  <div className="flex items-center justify-between">
                    <span className="font-body text-sm font-medium text-bark/70 dark:text-cream/65">{t.subtotal}</span>
                    <span className="font-heading text-xl font-bold text-bark dark:text-cream">{euro(subtotal)}</span>
                  </div>
                  <p className="mt-1 font-body text-xs text-bark/45 dark:text-cream/40">{t.shippingNote}</p>
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-secondary py-3.5 font-body text-sm font-semibold tracking-wide text-bark transition-all duration-200 hover:bg-secondary-600 hover:text-white active:scale-[0.98]"
                  >
                    {t.checkout}
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}