import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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

export const metadata: Metadata = {
  title: {
    default: "Ellaina Olive Oil — Premium Greek Extra Virgin Olive Oil",
    template: "%s | Ellaina Olive Oil",
  },
  description:
    "Ellaina delivers award-winning extra virgin olive oil from ancient groves in Greece — cold-pressed, unfiltered, and full of character.",
  keywords: [
    "Greek olive oil",
    "extra virgin olive oil",
    "premium olive oil",
    "Ellaina",
    "cold pressed olive oil",
    "ελληνικό ελαιόλαδο",
  ],
  authors: [{ name: "Ellaina Olive Oil" }],
  creator: "Ellaina Olive Oil",
  openGraph: {
    type: "website",
    locale: "el_GR",
    alternateLocale: "en_US",
    url: "https://www.ellainaoliveoil.com/",
    siteName: "Ellaina Olive Oil",
    title: "Ellaina Olive Oil — Premium Greek Extra Virgin Olive Oil",
    description:
      "Award-winning extra virgin olive oil from ancient Greek groves. Cold-pressed, unfiltered, full of character.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ellaina Olive Oil — Premium Greek Extra Virgin Olive Oil",
    description:
      "Award-winning extra virgin olive oil from ancient Greek groves. Cold-pressed, unfiltered, full of character.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}