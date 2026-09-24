import { NextResponse, type NextRequest } from "next/server";
import {
  createInsForgeAdminClient,
  createInsForgeServerClient,
} from "@/lib/insforge-server";
import type { OrderItem } from "@/lib/orders";
import { SITE_URL } from "@/lib/seo";

/**
 * Stripe environment for checkout. Defaults to "test" so a missing env var
 * can never take real money; set STRIPE_MODE=live in production once live
 * prices exist.
 */
const STRIPE_MODE: "test" | "live" = process.env.STRIPE_MODE === "live" ? "live" : "test";

type CheckoutRequest = {
  items: { id: string; quantity: number }[];
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    notes?: string;
  };
  lang?: string;
};

type ProductRow = {
  slug: string;
  name: string;
  volume: string;
  price: number | string;
  image: string | null;
  stripe_price_test: string | null;
  stripe_price_live: string | null;
  stock_quantity: number | null;
};

const text = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/**
 * Where Stripe sends the customer back to. Not taken from the request: a
 * proxy can report https for a plain-http dev server, and the Host header is
 * caller-controlled. CHECKOUT_BASE_URL overrides (e.g. preview deployments).
 */
function checkoutOrigin(request: NextRequest) {
  if (process.env.CHECKOUT_BASE_URL) return process.env.CHECKOUT_BASE_URL.replace(/\/$/, "");
  if (process.env.NODE_ENV === "production") return SITE_URL;
  return `http://${request.headers.get("host") ?? "localhost:3000"}`;
}

function error(status: number, reason: string, message?: string) {
  return NextResponse.json({ ok: false, reason, message }, { status });
}

/**
 * Creates a pending order priced from the database, then a Stripe Checkout
 * Session for it. The order is marked paid by the Stripe webhook trigger
 * (public.fulfill_stripe_order), never by the success redirect.
 */
export async function POST(request: NextRequest) {
  let body: CheckoutRequest;
  try {
    body = await request.json();
  } catch {
    return error(400, "error", "Invalid request");
  }

  // Merge duplicate lines and validate quantities.
  const quantities = new Map<string, number>();
  for (const item of Array.isArray(body.items) ? body.items : []) {
    const qty = Number(item?.quantity);
    if (typeof item?.id !== "string" || !Number.isInteger(qty) || qty < 1 || qty > 50) {
      return error(400, "error", "Invalid cart item");
    }
    quantities.set(item.id, (quantities.get(item.id) ?? 0) + qty);
  }
  if (quantities.size === 0) return error(400, "empty");

  const c = body.customer ?? ({} as CheckoutRequest["customer"]);
  const customer = {
    full_name: text(c.fullName),
    email: text(c.email).toLowerCase(),
    phone: text(c.phone, 40),
    address: text(c.address, 300),
    city: text(c.city, 100),
    postal_code: text(c.postalCode, 20),
    country: text(c.country, 100),
    notes: text(c.notes, 1000) || null,
  };
  const required = ["full_name", "email", "address", "city", "postal_code", "country"] as const;
  if (required.some((k) => !customer[k]) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
    return error(400, "error", "Missing customer details");
  }

  const admin = createInsForgeAdminClient();

  const { data: products, error: productsError } = await admin.database
    .from("products")
    .select("slug, name, volume, price, image, stripe_price_test, stripe_price_live, stock_quantity")
    .in("slug", Array.from(quantities.keys()))
    .eq("in_stock", true);
  if (productsError || !products) return error(500, "error", "Could not load products");

  const bySlug = new Map((products as ProductRow[]).map((p) => [p.slug, p]));
  const items: OrderItem[] = [];
  const lineItems: { priceId: string; quantity: number }[] = [];

  for (const [slug, quantity] of Array.from(quantities)) {
    const product = bySlug.get(slug);
    if (!product) return error(409, "error", `Product unavailable: ${slug}`);
    if (product.stock_quantity !== null && quantity > product.stock_quantity) {
      return error(409, "out_of_stock", `Only ${product.stock_quantity} left of ${slug}`);
    }
    const priceId = STRIPE_MODE === "live" ? product.stripe_price_live : product.stripe_price_test;
    if (!priceId) return error(503, "unconfigured", `Missing Stripe price for ${slug}`);

    items.push({
      productId: slug,
      name: { el: product.name, en: product.name },
      volume: product.volume,
      quantity,
      price: Number(product.price),
      image: product.image,
    });
    lineItems.push({ priceId, quantity });
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // Stripe sessions must be created with the visitor's own token (the admin
  // key is rejected); RLS lets it through only for this pending order with
  // exactly these line items (public.can_start_order_checkout).
  const visitor = createInsForgeServerClient();

  // Link the order to the customer's account when they're signed in.
  const { data: session } = await visitor.auth.getCurrentUser();
  const userId = session?.user?.id ?? null;

  // Same shape as public.normalize_stripe_line_items(): sorted by price.
  const checkoutLineItems = lineItems
    .map((l) => ({ price: l.priceId, quantity: l.quantity }))
    .sort((a, b) => (a.price < b.price ? -1 : a.price > b.price ? 1 : 0));

  const { data: order, error: orderError } = await admin.database
    .from("orders")
    .insert([
      {
        ...customer,
        user_id: userId,
        items,
        subtotal: subtotal.toFixed(2),
        language: body.lang === "en" ? "en" : "el",
        stripe_environment: STRIPE_MODE,
        checkout_line_items: checkoutLineItems,
      },
    ])
    .select("id, order_number")
    .single();
  if (orderError || !order) return error(500, "error", "Could not create order");

  const origin = checkoutOrigin(request);
  const { data, error: stripeError } = await visitor.payments.stripe.createCheckoutSession(
    STRIPE_MODE,
    {
      mode: "payment",
      lineItems,
      successUrl: `${origin}/checkout/success?order=${encodeURIComponent(order.order_number)}`,
      cancelUrl: `${origin}/checkout`,
      ...(userId ? { subject: { type: "user", id: userId } } : {}),
      customerEmail: customer.email,
      metadata: { order_id: order.id, order_number: order.order_number },
      idempotencyKey: `order:${order.id}`,
    },
  );

  const url = data?.checkoutSession?.url;
  if (stripeError || !url) {
    await admin.database.from("orders").update({ status: "cancelled" }).eq("id", order.id);
    return error(502, "error", stripeError?.message ?? "No checkout URL returned");
  }

  return NextResponse.json({ ok: true, url });
}
