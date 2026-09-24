import { type CartItem } from "@/context/CartContext";

export type CheckoutCustomer = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  notes: string;
};

export type CheckoutResult =
  | { ok: true; url: string }
  | { ok: false; reason: "unconfigured" | "empty" | "out_of_stock" | "error"; message?: string };

/**
 * Asks the server to create the order and a Stripe Checkout Session, and
 * returns the Stripe URL to redirect to. Prices are looked up server-side;
 * only product slugs and quantities are sent from the cart.
 */
export async function startCheckout(
  items: CartItem[],
  customer: CheckoutCustomer,
  lang: string,
): Promise<CheckoutResult> {
  if (items.length === 0) return { ok: false, reason: "empty" };

  try {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        customer,
        lang,
      }),
    });
    const data = await res.json();
    if (data?.ok && typeof data.url === "string") return { ok: true, url: data.url };
    return {
      ok: false,
      reason: ["unconfigured", "empty", "out_of_stock"].includes(data?.reason) ? data.reason : "error",
      message: data?.message,
    };
  } catch (e) {
    return { ok: false, reason: "error", message: (e as Error).message };
  }
}
