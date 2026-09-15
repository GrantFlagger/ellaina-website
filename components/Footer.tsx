"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { insforge } from "@/lib/insforge";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M16.5 3c.3 1.9 1.6 3.4 3.5 3.8v3c-1.3 0-2.6-.4-3.5-1.1v6.8c0 3-2.4 5.5-5.5 5.5S5.5 17.7 5.5 14.7c0-2.8 2.1-5.1 4.8-5.4v3.1c-1.1.3-1.9 1.2-1.9 2.3 0 1.4 1.1 2.5 2.5 2.5s2.5-1.1 2.5-2.5V3h3.1Z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/ellaina_olive.oil?stkn=MW5senk5bDBwdHRtdA==",  Icon: InstagramIcon },
  { label: "TikTok",    href: "https://tiktok.com",    Icon: TikTokIcon    },
] as const;

export default function Footer() {
  const [email,       setEmail]       = useState("");
  const [status,      setStatus]      = useState<"idle" | "loading" | "subscribed" | "duplicate" | "error">("idle");
  const { lang } = useLanguage();
  const t = translations[lang].footer;

  const QUICK_LINKS = [
    { label: t.links.ourValues,       href: "/about" },
    { label: t.links.products,       href: "/shop" },
    { label: "B2B",                  href: "/b2b" },
    { label: t.links.sustainability, href: "/sustainability" },
    { label: lang === "el" ? "Αποστολή & Επιστροφές" : "Shipping & Returns", href: "/shipping" },
    { label: t.links.contact,        href: "/contact" },
  ];
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || status === "loading") return;

    setStatus("loading");

    const { error } = await insforge.database
      .from("newsletter_subscribers")
      .insert([{ email: email.trim().toLowerCase(), language: lang }]);

    if (error) {
      setStatus(error.message?.toLowerCase().includes("duplicate") ? "duplicate" : "error");
      return;
    }

    setStatus("subscribed");
    setEmail("");
  };

  return (
    <footer className="bg-bark" aria-label="Site footer">

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16">

          {/* Col 1: Brand */}
          <div className="flex flex-col gap-5">
            <Link href="/" className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded-sm w-fit">
              <Image
                src="/images/logo.png"
                alt="Ellaina"
                width={180}
                height={78}
                className="h-16 w-auto object-contain brightness-0 invert opacity-80 transition-opacity duration-200 group-hover:opacity-100 lg:h-20"
              />
            </Link>

            <p className="max-w-[22ch] font-body text-[0.875rem] leading-[1.72] text-cream/55">
              {t.tagline}
            </p>

            <div className="flex items-center gap-3 pt-1">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/15 text-cream/45 transition-all duration-200 hover:border-secondary hover:text-secondary"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Col 2: Quick links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-body text-xs font-semibold uppercase tracking-[0.22em] text-cream/40">
              {t.quickLinks}
            </h3>
            <nav aria-label="Footer navigation">
              <ul className="flex flex-col gap-2.5">
                {QUICK_LINKS.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="group inline-flex items-center gap-1.5 font-body text-[0.875rem] text-cream/60 transition-colors duration-150 hover:text-cream"
                    >
                      <span className="inline-block h-px w-3 bg-secondary/50 transition-all duration-200 group-hover:w-4 group-hover:bg-secondary" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Col 3: Newsletter */}
          <div className="flex flex-col gap-4">
            <h3 className="font-body text-xs font-semibold uppercase tracking-[0.22em] text-cream/40">
              {t.stayInGrove}
            </h3>
            <p className="font-body text-[0.875rem] leading-relaxed text-cream/55">
              {t.newsletter}
            </p>

            {status === "subscribed" || status === "duplicate" ? (
              <p className="font-body text-sm font-medium text-secondary">
                {status === "duplicate" ? t.alreadySubscribed : t.thankyou}
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2.5 sm:flex-row lg:flex-col xl:flex-row">
                <label htmlFor="footer-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="footer-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  required
                  disabled={status === "loading"}
                  className="flex-1 rounded-full border border-cream/15 bg-white/5 px-4 py-2.5 font-body text-sm text-cream placeholder:text-cream/30 focus:border-secondary/60 focus:outline-none focus:ring-1 focus:ring-secondary/40 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="rounded-full bg-secondary px-5 py-2.5 font-body text-sm font-semibold text-bark transition-all duration-200 hover:bg-secondary-400 active:scale-[0.97] whitespace-nowrap disabled:opacity-70"
                >
                  {status === "loading" ? t.subscribing : t.subscribe}
                </button>
              </form>
            )}
            {status === "error" && (
              <p className="font-body text-xs font-medium text-red-400">
                {t.subscribeError}
              </p>
            )}
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row sm:px-6 lg:px-8">
          <p className="font-body text-xs text-cream/35">
            &copy; {new Date().getFullYear()} Ellaina Olive Oil. {t.rights}
          </p>
          <nav aria-label="Legal links" className="flex gap-5">
            {[
              { label: t.privacy, href: "/privacy" },
              { label: t.terms,   href: "/terms"   },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="font-body text-xs text-cream/35 transition-colors duration-150 hover:text-cream/70"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

    </footer>
  );
}