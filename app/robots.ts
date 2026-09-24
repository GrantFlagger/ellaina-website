import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Auth, checkout and account pages are kept out of the index with a
// `noindex` meta tag instead of Disallow — crawlers must be able to fetch a
// page to see its noindex.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
