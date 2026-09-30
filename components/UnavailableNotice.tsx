"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

type NoticeKind = "account" | "ordering";

export default function UnavailableNotice({ kind }: { kind: NoticeKind }) {
  const { lang } = useLanguage();
  const account = kind === "account";

  const content = lang === "el"
    ? {
        title: account ? "Η σύνδεση και η εγγραφή είναι προσωρινά μη διαθέσιμες." : "Οι ηλεκτρονικές παραγγελίες είναι προσωρινά μη διαθέσιμες.",
        message: account ? "Για βοήθεια με τον λογαριασμό σας, επικοινωνήστε μαζί μας." : "Ενδιαφέρεστε για κάποιο προϊόν; Επικοινωνήστε μαζί μας και θα χαρούμε να σας εξυπηρετήσουμε.",
        contact: "Επικοινωνήστε μαζί μας",
      }
    : {
        title: account ? "Sign in and registration are temporarily unavailable." : "Online ordering is temporarily unavailable.",
        message: account ? "Please contact us if you need help with your account." : "Interested in a product? Contact us and we’ll be happy to help.",
        contact: "Contact us",
      };

  return (
    <section className="mx-auto flex min-h-[65vh] max-w-3xl flex-col items-center justify-center px-5 py-20 text-center">
      <h1 className="font-heading text-3xl font-bold leading-tight text-bark dark:text-cream sm:text-4xl">
        {content.title}
      </h1>
      <p className="mt-5 max-w-xl font-body text-base leading-relaxed text-bark/65 dark:text-cream/60">
        {content.message}
      </p>
      <Link
        href="/contact"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-secondary px-7 py-3 font-body text-sm font-semibold text-bark transition-colors hover:bg-secondary-600 hover:text-white"
      >
        {content.contact}
      </Link>
    </section>
  );
}