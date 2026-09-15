"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, User, ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { translations } from "@/lib/translations";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [b2bOpen, setB2bOpen] = useState(false);
  const [mobileB2bOpen, setMobileB2bOpen] = useState(false);
  const aboutRef = useRef<HTMLDivElement>(null);
  const b2bRef = useRef<HTMLDivElement>(null);
  const { lang, setLang } = useLanguage();
  const { count, openCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const t = translations[lang].nav;
  const pathname = usePathname();

  const ABOUT_GROUP = [
    { label: lang === "el" ? "Οι αξίες μας" : "Our values", href: "/about" },
    { label: lang === "el" ? "Γιατί Ellaina" : "Why Ellaina", href: "/about#why-ellaina" },
    { label: lang === "el" ? "Βιωσιμότητα" : "Sustainability", href: "/about#sustainability" },
  ] as const;

  const B2B_GROUP = [
    { label: lang === "el" ? "Για Παραγωγούς" : "For Producers", href: "/b2b" },
    { label: lang === "el" ? "Για Εστιατόρια" : "For Restaurants", href: "/b2b/restaurants" },
  ] as const;

  // Shop + Benefits render before the B2B dropdown; Contact renders after it,
  // so the on-page order is: About us → Shop → Benefits → B2B → Contact.
  const NAV_LINKS = [
    { label: t.products, href: "/shop" },
    { label: lang === "el" ? "Οφέλη & Συνταγές" : "Benefits & Recipes", href: "/benefits" },
  ] as const;

  const CONTACT_LINK = { label: t.contact, href: "/contact" } as const;

  const isAboutActive = pathname?.startsWith("/about") ?? false;
  const isB2bActive = pathname?.startsWith("/b2b") ?? false;
  const isLinkActive = (href: string) => pathname === href;

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

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (aboutRef.current && !aboutRef.current.contains(e.target as Node)) {
        setAboutOpen(false);
      }
      if (b2bRef.current && !b2bRef.current.contains(e.target as Node)) {
        setB2bOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const linkColor = scrolled
    ? "text-bark hover:text-primary dark:text-cream/80 dark:hover:text-cream"
    : "text-white/90 hover:text-white";

  // Active nav items get the brand gold with a stacked text-shadow that
  // reads as a subtle raised/embossed letterform — a few thin offset layers
  // in darker gold tones, plus a soft blurred shadow underneath for lift.
  // Stays constant across scrolled state since gold reads fine on both.
  const activeLinkClass =
    "text-secondary [text-shadow:0_1px_0_#8a6b3d,0_2px_0_#6f552f,0_3px_5px_rgba(0,0,0,0.35)]";

  const controlColor = scrolled
    ? "text-bark/70 hover:text-bark dark:text-cream/60 dark:hover:text-cream"
    : "text-white/70 hover:text-white";

  const burgerColor = scrolled
    ? "text-bark hover:text-primary dark:text-cream/80 dark:hover:text-cream"
    : "text-white hover:text-white/70";

  const logoFilter = scrolled ? "dark:brightness-0 dark:invert" : "brightness-0 invert";

  const firstName = user?.name?.split(" ")[0] ?? "";

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-cream/95 dark:bg-night/95 backdrop-blur-md shadow-[0_1px_0_0_rgba(61,43,31,0.08)] dark:shadow-[0_1px_0_0_rgba(0,0,0,0.3)]"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">

          <Link
            href="/"
            className="group flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded-sm"
          >
            <Image
              src="/images/logo-drop.png"
              alt=""
              width={64.8}
              height={81}
              className={`h-9 md:h-10 w-auto object-contain transition-opacity duration-300 group-hover:opacity-75 ${logoFilter}`}
              aria-hidden
            />
            <Image
              src="/images/logo.png"
              alt="Ellaina"
              width={297}
              height={129.6}
              className={`h-12 md:h-14 w-auto object-contain transition-opacity duration-300 group-hover:opacity-80 ${logoFilter}`}
              priority
            />
          </Link>

          <nav className="hidden md:flex items-center gap-1.5">
            {/* "Σχετικά με εμάς" dropdown: Η Ιστορία μας / Βιωσιμότητα / Οφέλη */}
            <div className="relative" ref={aboutRef}>
              <button
                onClick={() => setAboutOpen((v) => !v)}
                aria-expanded={aboutOpen}
                className={`flex items-center gap-1 rounded-md px-3.5 py-2 text-sm font-body font-medium tracking-wide transition-colors duration-200 ${
                  isAboutActive ? activeLinkClass : linkColor
                }`}
              >
                {lang === "el" ? "Σχετικά με εμάς" : "About us"}
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${aboutOpen ? "rotate-180" : ""}`}
                  strokeWidth={2}
                />
              </button>

              <AnimatePresence>
                {aboutOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-3 w-52 overflow-hidden rounded-xl border border-light dark:border-white/10 bg-white dark:bg-night-subtle py-2 shadow-[0_16px_44px_-12px_rgba(61,43,31,0.28)]"
                  >
                    {ABOUT_GROUP.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setAboutOpen(false)}
                        className="block px-4 py-2.5 font-body text-sm font-medium text-bark/75 transition-colors hover:bg-bark/5 hover:text-bark dark:text-cream/65 dark:hover:bg-white/5 dark:hover:text-cream"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Shop + Benefits */}
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`rounded-md px-3.5 py-2 text-sm font-body font-medium tracking-wide transition-colors duration-200 ${
                    active ? activeLinkClass : linkColor
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* "B2B" dropdown: Για Παραγωγούς / Για Εστιατόρια */}
            <div className="relative" ref={b2bRef}>
              <button
                onClick={() => setB2bOpen((v) => !v)}
                aria-expanded={b2bOpen}
                className={`flex items-center gap-1 rounded-md px-3.5 py-2 text-sm font-body font-medium tracking-wide transition-colors duration-200 ${
                  isB2bActive ? activeLinkClass : linkColor
                }`}
              >
                B2B
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${b2bOpen ? "rotate-180" : ""}`}
                  strokeWidth={2}
                />
              </button>

              <AnimatePresence>
                {b2bOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-3 w-52 overflow-hidden rounded-xl border border-light dark:border-white/10 bg-white dark:bg-night-subtle py-2 shadow-[0_16px_44px_-12px_rgba(61,43,31,0.28)]"
                  >
                    {B2B_GROUP.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setB2bOpen(false)}
                        className="block px-4 py-2.5 font-body text-sm font-medium text-bark/75 transition-colors hover:bg-bark/5 hover:text-bark dark:text-cream/65 dark:hover:bg-white/5 dark:hover:text-cream"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Contact — after B2B */}
            <Link
              href={CONTACT_LINK.href}
              className={`rounded-md px-3.5 py-2 text-sm font-body font-medium tracking-wide transition-colors duration-200 ${
                isLinkActive(CONTACT_LINK.href) ? activeLinkClass : linkColor
              }`}
            >
              {CONTACT_LINK.label}
            </Link>

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

            {/* Profile — goes straight to /profile when signed in (the
                profile page has its own sign-out control). Shows a gold
                initial circle when signed in so it's clear at a glance
                that you're logged in, or a plain icon when signed out. */}
            {isAuthenticated ? (
              <Link
                href="/profile"
                aria-label="Your profile"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/15 text-[0.75rem] font-bold text-secondary ring-1 ring-secondary/25 transition-colors duration-200 hover:bg-secondary/25"
              >
                {firstName.charAt(0).toUpperCase()}
              </Link>
            ) : (
              <Link
                href="/login"
                aria-label="Sign in"
                className={`flex items-center gap-1.5 p-1.5 rounded-full transition-colors duration-200 ${controlColor}`}
              >
                <User className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.8} />
              </Link>
            )}

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

            <Link
              href="/shop"
              className="ml-1 px-5 py-2.5 rounded-full bg-secondary text-bark text-sm font-semibold tracking-wide transition-all duration-200 hover:bg-secondary-600 hover:text-white hover:shadow-md active:scale-95"
            >
              {t.shopNow}
            </Link>
          </nav>

          <div className="md:hidden flex items-center gap-1">
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
              {/* About group — collapsible accordion on mobile */}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="border-b border-light/70 dark:border-white/8"
              >
                <button
                  onClick={() => setMobileAboutOpen((v) => !v)}
                  aria-expanded={mobileAboutOpen}
                  className={`flex w-full items-center justify-between py-4 text-base font-body font-medium ${
                    isAboutActive ? activeLinkClass : "text-bark dark:text-cream/80"
                  }`}
                >
                  {lang === "el" ? "Σχετικά με εμάς" : "About us"}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${mobileAboutOpen ? "rotate-180" : ""}`}
                    strokeWidth={2}
                  />
                </button>
                <AnimatePresence>
                  {mobileAboutOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      {ABOUT_GROUP.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => {
                            setMobileOpen(false);
                            setMobileAboutOpen(false);
                          }}
                          className="block py-3 pl-4 font-body text-[0.9375rem] text-bark/65 dark:text-cream/60"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Shop + Benefits */}
              {NAV_LINKS.map((link, i) => {
                const active = isLinkActive(link.href);
                return (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.055, duration: 0.2 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`block py-4 text-base font-body font-medium border-b border-light/70 dark:border-white/8 transition-colors duration-150 ${
                        active
                          ? activeLinkClass
                          : "text-bark dark:text-cream/80 hover:text-primary dark:hover:text-cream"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}

              {/* B2B group — collapsible accordion on mobile */}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.055, duration: 0.2 }}
                className="border-b border-light/70 dark:border-white/8"
              >
                <button
                  onClick={() => setMobileB2bOpen((v) => !v)}
                  aria-expanded={mobileB2bOpen}
                  className={`flex w-full items-center justify-between py-4 text-base font-body font-medium ${
                    isB2bActive ? activeLinkClass : "text-bark dark:text-cream/80"
                  }`}
                >
                  B2B
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${mobileB2bOpen ? "rotate-180" : ""}`}
                    strokeWidth={2}
                  />
                </button>
                <AnimatePresence>
                  {mobileB2bOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      {B2B_GROUP.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => {
                            setMobileOpen(false);
                            setMobileB2bOpen(false);
                          }}
                          className="block py-3 pl-4 font-body text-[0.9375rem] text-bark/65 dark:text-cream/60"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Contact — after B2B */}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (NAV_LINKS.length + 1) * 0.055, duration: 0.2 }}
              >
                <Link
                  href={CONTACT_LINK.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block py-4 text-base font-body font-medium border-b border-light/70 dark:border-white/8 transition-colors duration-150 ${
                    isLinkActive(CONTACT_LINK.href)
                      ? activeLinkClass
                      : "text-bark dark:text-cream/80 hover:text-primary dark:hover:text-cream"
                  }`}
                >
                  {CONTACT_LINK.label}
                </Link>
              </motion.div>

              {/* Profile — straight link, mobile */}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (NAV_LINKS.length + 2) * 0.055, duration: 0.2 }}
                className="py-4 border-b border-light/70 dark:border-white/8"
              >
                <Link
                  href={isAuthenticated ? "/profile" : "/login"}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 font-body text-base font-medium text-bark dark:text-cream/80"
                >
                  {isAuthenticated ? (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary/15 text-[0.6875rem] font-bold text-secondary ring-1 ring-secondary/25">
                      {firstName.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <User className="h-4 w-4" strokeWidth={1.8} />
                  )}
                  {isAuthenticated
                    ? (lang === "el" ? "Ο λογαριασμός μου" : "My account")
                    : (lang === "el" ? "Σύνδεση / Εγγραφή" : "Sign in / Register")}
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (NAV_LINKS.length + 3) * 0.055, duration: 0.2 }}
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

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (NAV_LINKS.length + 4) * 0.055, duration: 0.2 }}
              >
                <Link
                  href="/shop"
                  onClick={() => setMobileOpen(false)}
                  className="mt-5 block py-3.5 rounded-full bg-secondary text-bark text-base font-semibold text-center tracking-wide hover:bg-secondary-600 hover:text-white transition-all duration-200 active:scale-95"
                >
                  {t.shopNow}
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}