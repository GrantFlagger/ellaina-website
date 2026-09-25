/*
 * Legacy Wix URLs (from the live site's sitemaps as of Sept 2026) → new routes.
 * Each is also served under Wix's /el/ language prefix, so both are mapped
 * directly to avoid redirect chains.
 */
const WIX_REDIRECTS = [
  ["/welcome", "/"],
  ["/store-policy", "/terms"],
  ["/shipping-and-returns", "/shipping"],
  ["/product-page/large-sized-bottle-500-ml", "/shop/500ml"],
  // The 250 ml bottle is discontinued — send it to the shop overview.
  ["/product-page/small-sized-bottle-250-ml", "/shop"],
  ["/product-page/small-sized-bottle-250-ml-1", "/shop"],
];

/*
 * Checkout otherwise sends Stripe back to the hard-coded www domain, which is
 * wrong for preview deploys and for a Netlify site not yet on that domain.
 * The host only exposes the deploy's own URL at build time, so bake it in as
 * CHECKOUT_BASE_URL (unless one is set explicitly).
 */
function deployCheckoutBaseUrl() {
  if (process.env.CHECKOUT_BASE_URL) return undefined;
  // Netlify: CONTEXT is production | deploy-preview | branch-deploy | dev.
  // URL is the site's primary address: the custom domain once one is set,
  // otherwise the .netlify.app subdomain.
  if (process.env.NETLIFY === "true") {
    return process.env.CONTEXT === "production" ? process.env.URL : process.env.DEPLOY_PRIME_URL;
  }
  // Vercel: VERCEL_BRANCH_URL has no scheme.
  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_BRANCH_URL) {
    return `https://${process.env.VERCEL_BRANCH_URL}`;
  }
  return undefined;
}

const deployBaseUrl = deployCheckoutBaseUrl();

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],

  env: deployBaseUrl ? { CHECKOUT_BASE_URL: deployBaseUrl } : {},

  // Product photos are served from InsForge Storage (which redirects to its CDN).
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.insforge.app", pathname: "/api/storage/**" },
      { protocol: "https", hostname: "cdn.insforge.dev", pathname: "/storage/**" },
    ],
  },

  async redirects() {
    return [
      // Canonical host is www — send the apex domain there.
      {
        source: "/:path*",
        has: [{ type: "host", value: "ellainaoliveoil.com" }],
        destination: "https://www.ellainaoliveoil.com/:path*",
        permanent: true,
      },
      ...WIX_REDIRECTS.flatMap(([from, to]) => [
        { source: from, destination: to, permanent: true },
        { source: `/el${from}`, destination: to, permanent: true },
      ]),
      // Remaining Wix Greek-prefixed pages (/el, /el/about, /el/shop, /el/contact).
      { source: "/el", destination: "/", permanent: true },
      { source: "/el/:path*", destination: "/:path*", permanent: true },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        ],
      },
    ];
  },
};

export default nextConfig;
