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

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.236 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.428 1.808-2.428.853 0 1.267.641 1.267 1.408 0 .858-.546 2.141-.828 3.33-.236.995.498 1.806 1.476 1.806 1.771 0 3.132-1.867 3.132-4.562 0-2.387-1.716-4.057-4.164-4.057-2.836 0-4.5 2.127-4.5 4.325 0 .856.329 1.774.74 2.276a.297.297 0 0 1 .068.285c-.075.314-.244.995-.277 1.134-.044.183-.146.222-.337.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.966-.527-2.292-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com",  Icon: InstagramIcon },
  { label: "Facebook",  href: "https://facebook.com",   Icon: FacebookIcon  },
  { label: "Pinterest", href: "https://pinterest.com",  Icon: PinterestIcon },
] as const;

export default function Footer() {
  const [email,       setEmail]       = useState("");
  const [status,      setStatus]      = useState<"idle" | "loading" | "subscribed" | "duplicate" | "error">("idle");
  const { lang } = useLanguage();
  const t = translations[lang].footer;

  const QUICK_LINKS = [
    { label: t.links.ourStory,      href: "#our-story" },
    { label: t.links.products,      href: "#products" },
    { label: t.links.sustainability, href: "#sustainability" },
    { label: t.links.press,         href: "#press" },
    { label: t.links.contact,       href: "#contact" },
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
                width={120}
                height={52}
                className="h-10 w-auto object-contain brightness-0 invert opacity-80 transition-opacity duration-200 group-hover:opacity-100"
              />
            </Link>

            <p className="max-w-[22ch] font-body text-[0.875rem] leading-[1.72] text-cream/55">
              {t.tagline}
            </p>

            <div className="flex items-center gap-3 pt-1">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/15 text-cream/45 transition-all duration-200 hover:border-secondary hover:text-secondary"
                >
                  <Icon className="h-4 w-4" />
                </a>
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
                    <a
                      href={href}
                      className="group inline-flex items-center gap-1.5 font-body text-[0.875rem] text-cream/60 transition-colors duration-150 hover:text-cream"
                    >
                      <span className="inline-block h-px w-3 bg-secondary/50 transition-all duration-200 group-hover:w-4 group-hover:bg-secondary" />
                      {label}
                    </a>
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
              { label: t.privacy, href: "#privacy" },
              { label: t.terms,   href: "#terms"   },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="font-body text-xs text-cream/35 transition-colors duration-150 hover:text-cream/70"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </div>

    </footer>
  );
}
