import type { Metadata } from "next";

export const SITE_URL = "https://www.ellainaoliveoil.com";
export const SITE_NAME = "Ellaina Olive Oil";
export const DEFAULT_OG_IMAGE = "/og/default.jpg";

type PageMetaInput = {
  title: string;
  description: string;
  /** Route path, e.g. "/shop". Used for the canonical URL and og:url. */
  path: string;
  /** 1200×630 image path under /public. Defaults to the brand OG image. */
  image?: string;
  imageAlt?: string;
  /** Set true to use `title` verbatim instead of the "%s | Ellaina Olive Oil" template. */
  absoluteTitle?: boolean;
  type?: "website" | "article";
};

/*
 * Builds a complete per-page Metadata object.
 *
 * Next.js merges metadata shallowly: a page that sets `openGraph` replaces the
 * root layout's `openGraph` entirely. So every indexable page gets the full
 * canonical + OG + Twitter set from here instead of relying on inheritance.
 */
export function pageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  imageAlt = SITE_NAME,
  absoluteTitle = false,
  type = "website",
}: PageMetaInput): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;
  const images = [{ url: image, width: 1200, height: 630, alt: imageAlt }];

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: "el_GR",
      url: path,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}

/** Metadata for utility pages that must stay out of the index (auth, checkout, account). */
export function noindexMetadata(title: string): Metadata {
  return {
    title,
    robots: { index: false, follow: true },
  };
}

export const absoluteUrl = (path: string) => `${SITE_URL}${path}`;
