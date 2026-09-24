import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { PRODUCT_SIZES } from "@/lib/products";
import { RECIPES } from "@/lib/recipes";

// Indexable routes only — noindexed pages (auth, checkout, profile) are left out.
const STATIC_ROUTES = [
  "",
  "/shop",
  "/about",
  "/benefits",
  "/cookbook",
  "/sustainability",
  "/b2b",
  "/b2b/restaurants",
  "/contact",
  "/shipping",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...STATIC_ROUTES.map((path) => ({ url: `${SITE_URL}${path}` })),
    ...PRODUCT_SIZES.map((p) => ({ url: `${SITE_URL}/shop/${p.id}` })),
    ...RECIPES.map((r) => ({ url: `${SITE_URL}/cookbook/${r.id}` })),
  ];
}
