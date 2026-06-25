"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { translations } from "@/lib/translations";

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, setLang } = useLanguage();
  const { count, openCart } = useCart();
  const t = translations[lang].nav;

  const NAV_LINKS = [
    { label: t.ourStory,      href: "/#our-story" },
    { label: t.products,      href: "/#products" },
    { label: t.sustainability, href: "/#sustainability" },
    { label: t.contact,       href: "/#contact" },
  ] as const;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const linkColor = scrolled
    ? "text-bark hover:text-primary dark:text-cream/80 dark:hover:text-cream"
    : "text-white/90 hover:text-white";

  const controlColor = scrolled
    ? "text-bark/70 hover:text-bark dark:text-cream/60 dark:hover:text-cream"
    : "text-white/70 hover:text-white";

  const burgerColor = scrolled
    ? "text-bark hover:text-primary dark:text-cream/80 dark:hover:text-cream"
    : "text-white hover:text-white/70";

  const logoFilter = scrolled ? "dark:brightness-0 dark:invert" : "brightness-0 invert";

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-cream/95 dark:bg-night/95 backdrop-blur-md shadow-[0_1px_0_0_rgba(61,43,31,0.08)] dark:shadow-[0_1px_0_0_rgba(0,0,0,0.3)]"
          : "bg-transparent",
      ].join(" ")}
    >
      {/* ── Main bar ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo: drop icon + text logo */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded-sm"
          >
            <Image
              src="/images/logo-drop.png"
              alt=""
              width={24}
              height={30}
              className={`h-7 w-auto object-contain transition-opacity duration-300 group-hover:opacity-75 ${logoFilter}`}
              aria-hidden
            />
            <Image
              src="/images/logo.png"
              alt="Ellaina"
              width={110}
              height={48}
              className={`h-9 w-auto object-contain transition-opacity duration-300 group-hover:opacity-80 ${logoFilter}`}
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`text-sm font-body font-medium tracking-wide transition-colors duration-200 ${linkColor}`}
              >
                {link.label}
              </a>
            ))}

            {/* Language toggle */}
            <div className="flex items-center gap-0.5 font-body text-[0.8125rem] font-semibold">
              <button
                onClick={() => setLang("el")}
                className={`px-1.5 py-0.5 rounded transition-colors duration-150 ${lang === "el" ? "text-secondary" : `${controlColor}`}`}
                aria-label="Ελληνικά"
              >
                EL
              </button>
              <span className={`${scrolled ? "text-bark/25 dark:text-cream/20" : "text-white/30"}`}>|</span>
              <button
                onClick={() => setLang("en")}
                className={`px-1.5 py-0.5 rounded transition-colors duration-150 ${lang === "en" ? "text-secondary" : `${controlColor}`}`}
                aria-label="English"
              >
                EN
              </button>
            </div>

            {/* Cart */}
            <button
              onClick={openCart}
              aria-label="Open cart"
              className={`relative p-1.5 rounded-full transition-colors duration-200 ${controlColor}`}
            >
              <ShoppingBag className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.8} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary px-1 text-[0.625rem] font-bold leading-none text-bark">
                  {count}
                </span>
              )}
            </button>

            <a
              href="/shop"
              className="ml-1 px-5 py-2.5 rounded-full bg-secondary text-bark text-sm font-semibold tracking-wide transition-all duration-200 hover:bg-secondary-600 hover:text-white hover:shadow-md active:scale-95"
            >
              {t.shopNow}
            </a>
          </nav>

          {/* Mobile right controls */}
          <div className="md:hidden flex items-center gap-1">
            {/* Cart (mobile) */}
            <button
              onClick={openCart}
              aria-label="Open cart"
              className={`relative p-2 rounded-full transition-colors duration-200 ${controlColor}`}
            >
              <ShoppingBag className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.8} />
              {count > 0 && (
                <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary px-1 text-[0.625rem] font-bold leading-none text-bark">
                  {count}
                </span>
              )}
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className={`p-2 -mr-1 rounded-md transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary ${burgerColor}`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -45, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 45, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="block"
                  >
                    <X className="w-5 h-5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="open"
                    initial={{ rotate: 45, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -45, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="block"
                  >
                    <Menu className="w-5 h-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>

        </div>
      </div>

      {/* ── Mobile dropdown ──────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="md:hidden overflow-hidden bg-cream dark:bg-night border-t border-light dark:border-white/10"
          >
            <nav className="flex flex-col px-5 pt-3 pb-6 gap-0">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.055, duration: 0.2 }}
                  onClick={() => setMobileOpen(false)}
                  className="py-4 text-base font-body font-medium text-bark dark:text-cream/80 border-b border-light/70 dark:border-white/8 last:border-0 hover:text-primary dark:hover:text-cream transition-colors duration-150"
                >
                  {link.label}
                </motion.a>
              ))}

              {/* Language toggle (mobile) */}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.055, duration: 0.2 }}
                className="py-4 flex items-center gap-3 border-b border-light/70 dark:border-white/8"
              >
                <span className="font-body text-xs font-semibold uppercase tracking-widest text-bark/40 dark:text-cream/40">
                  Language
                </span>
                <div className="flex items-center gap-0.5 font-body text-sm font-semibold">
                  <button
                    onClick={() => setLang("el")}
                    className={`px-2 py-1 rounded transition-colors ${lang === "el" ? "text-secondary" : "text-bark/50 dark:text-cream/50 hover:text-bark dark:hover:text-cream"}`}
                  >
                    EL
                  </button>
                  <span className="text-bark/20 dark:text-cream/20">|</span>
                  <button
                    onClick={() => setLang("en")}
                    className={`px-2 py-1 rounded transition-colors ${lang === "en" ? "text-secondary" : "text-bark/50 dark:text-cream/50 hover:text-bark dark:hover:text-cream"}`}
                  >
                    EN
                  </button>
                </div>
              </motion.div>

              <motion.a
                href="/shop"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (NAV_LINKS.length + 1) * 0.055, duration: 0.2 }}
                onClick={() => setMobileOpen(false)}
                className="mt-5 py-3.5 rounded-full bg-secondary text-bark text-base font-semibold text-center tracking-wide hover:bg-secondary-600 hover:text-white transition-all duration-200 active:scale-95"
              >
                {t.shopNow}
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
