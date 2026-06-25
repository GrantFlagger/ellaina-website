import { insforge } from "@/lib/insforge";
import { type CartItem } from "@/context/CartContext";

/**
 * Maps a product slug -> Stripe Price ID.
 *
 * These IDs come from the Stripe catalog once payments are enabled on the
 * InsForge backend and prices are synced:
 *   npx @insforge/cli payments stripe prices ...
 *
 * Until every cart item has a price ID here, checkout returns
 * `{ ok: false, reason: "unconfigured" }` and the UI shows a notice.
 */
export const STRIPE_PRICE_IDS: Record<string, string> = {
  // "500ml": "price_xxx",
  // "750ml": "price_xxx",
  // "5L":    "price_xxx",
};

export type CheckoutResult =
  | { ok: true; url: string }
  | { ok: false; reason: "unconfigured" | "empty" | "error"; message?: string };

/**
 * Create a Stripe Checkout Session for the current cart and return the URL to
 * redirect to. One-time payment (`mode: 'payment'`), anonymous checkout allowed.
 */
export async function startCheckout(items: CartItem[]): Promise<CheckoutResult> {
  if (items.length === 0) return { ok: false, reason: "empty" };

  const missing = items.filter((i) => !STRIPE_PRICE_IDS[i.id]);
  if (missing.length > 0) {
    return {
      ok: false,
      reason: "unconfigured",
      message: `Missing Stripe price IDs for: ${missing.map((i) => i.id).join(", ")}`,
    };
  }

  const lineItems = items.map((i) => ({
    priceId:  STRIPE_PRICE_IDS[i.id],
    quantity: i.quantity,
  }));

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  try {
    const { data, error } = await insforge.payments.createCheckoutSession("test", {
      mode:      "payment",
      lineItems,
      successUrl: `${origin}/checkout/success`,
      cancelUrl:  `${origin}/shop`,
      idempotencyKey: `cart:${items
        .map((i) => `${i.id}x${i.quantity}`)
        .join("-")}`,
    });

    if (error) return { ok: false, reason: "error", message: error.message };

    const url = data?.checkoutSession?.url;
    if (!url) return { ok: false, reason: "error", message: "No checkout URL returned" };

    return { ok: true, url };
  } catch (e) {
    return { ok: false, reason: "error", message: (e as Error).message };
  }
}
