import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE, absoluteUrl } from "@/lib/seo";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin", "greek"],
  variable: "--font-inter",
  display: "swap",
});

const DEFAULT_DESCRIPTION =
  "Εξαιρετικό παρθένο ελαιόλαδο Κορωνέικης από το οικογενειακό μας κτήμα στην Πρέβεζα. Ψυχρή έκθλιψη, οξύτητα 0,24%, πιστοποιημένο από διαπιστευμένο εργαστήριο.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ellaina — Εξαιρετικό Παρθένο Ελαιόλαδο από την Πρέβεζα",
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  // Carried over from the current Wix site so Search Console ownership
  // survives the migration.
  verification: {
    google: "-3S7tlqdI1lJdY5_W1pvwrIugvg3-WgxocjZY_OKud0",
  },
  openGraph: {
    type: "website",
    locale: "el_GR",
    siteName: SITE_NAME,
    title: "Ellaina — Εξαιρετικό Παρθένο Ελαιόλαδο από την Πρέβεζα",
    description: DEFAULT_DESCRIPTION,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ellaina — Εξαιρετικό Παρθένο Ελαιόλαδο από την Πρέβεζα",
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: absoluteUrl("/images/logo.png"),
      email: "info@ellainaoliveoil.com",
      telephone: "+306987657362",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Φρύνης 21",
        addressLocality: "Αθήνα",
        addressRegion: "Παγκράτι",
        addressCountry: "GR",
      },
      sameAs: ["https://www.instagram.com/ellaina_olive.oil/"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      inLanguage: "el",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export const viewport: Viewport = {
  themeColor: "#2C4A1E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="el" suppressHydrationWarning className={`dark ${playfair.variable} ${inter.variable}`}>
      <body className="antialiased">
        <JsonLd data={organizationJsonLd} />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-secondary focus:px-5 focus:py-2.5 focus:font-body focus:text-sm focus:font-semibold focus:text-bark"
        >
          Μετάβαση στο περιεχόμενο / Skip to content
        </a>
        <Providers>
          <Navbar />
          <div id="main-content" tabIndex={-1} className="outline-none">
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}