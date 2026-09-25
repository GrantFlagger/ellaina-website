"use server";

import { createInsForgeServerClient } from "@/lib/insforge-server";
import type { OrderItem, OrderStatus } from "@/lib/orders";

// Every read here runs as the signed-in user; the admin RLS policies and
// public.is_admin() decide what comes back. Non-admins get "forbidden".

export type AdminOrder = {
  id: string;
  order_number: string;
  created_at: string;
  status: OrderStatus;
  full_name: string;
  email: string;
  phone: string | null;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  notes: string | null;
  items: OrderItem[];
  subtotal: number;
  tracking_number: string | null;
  stripe_environment: string | null;
};

export type AdminMessage = {
  id: string;
  kind: "contact" | "b2b" | "restaurant";
  created_at: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string | null;
};

export type AdminProduct = {
  slug: string;
  name: string;
  volume: string;
  price: number;
  stock_quantity: number | null;
  in_stock: boolean;
};

export type AdminRole = "super_admin" | "admin";

export type AdminUser = { email: string; role: AdminRole; registered: boolean; created_at: string };

export type AdminData = {
  role: AdminRole;
  orders: AdminOrder[];
  messages: AdminMessage[];
  newsletter: { id: string; email: string; language: string | null; created_at: string }[];
  products: AdminProduct[];
  /** Only loaded for super admins. */
  admins: AdminUser[];
};

type Result<T> = { ok: true; data: T } | { ok: false; error: "forbidden" | "failed"; message?: string };

async function adminSession() {
  const insforge = createInsForgeServerClient();
  const { data, error } = await insforge.database.rpc("admin_role");
  return !error && (data === "super_admin" || data === "admin") ? { insforge, role: data as AdminRole } : null;
}

async function adminClient() {
  return (await adminSession())?.insforge ?? null;
}

// The database re-checks the role; this just gives admins a clear "forbidden".
async function superAdminClient() {
  const session = await adminSession();
  return session?.role === "super_admin" ? session.insforge : null;
}

export async function getAdminData(): Promise<Result<AdminData>> {
  const session = await adminSession();
  if (!session) return { ok: false, error: "forbidden" };
  const { insforge, role } = session;
  const db = insforge.database;

  const [orders, contact, b2b, restaurant, newsletter, products, admins] = await Promise.all([
    db
      .from("orders")
      .select(
        "id, order_number, created_at, status, full_name, email, phone, address, city, postal_code, country, notes, items, subtotal, tracking_number, stripe_environment",
      )
      .neq("status", "expired")
      .order("created_at", { ascending: false })
      .limit(200),
    db.from("contact_messages").select("id, created_at, name, email, subject, message").order("created_at", { ascending: false }).limit(100),
    db.from("b2b_inquiries").select("id, created_at, business_name, contact_name, email, phone, message").order("created_at", { ascending: false }).limit(100),
    db.from("restaurant_inquiries").select("id, created_at, restaurant_name, contact_name, email, phone, city, message").order("created_at", { ascending: false }).limit(100),
    db.from("newsletter_subscribers").select("id, email, language, created_at").order("created_at", { ascending: false }).limit(1000),
    db.from("products").select("slug, name, volume, price, stock_quantity, in_stock").order("sort_order", { ascending: true }),
    role === "super_admin" ? db.rpc("admin_list_admins") : Promise.resolve({ data: [], error: null }),
  ]);

  const failed = [orders, contact, b2b, restaurant, newsletter, products, admins].find((r) => r.error);
  if (failed) return { ok: false, error: "failed", message: failed.error?.message };

  type Row = Record<string, string | null>;
  const messages: AdminMessage[] = [
    ...((contact.data ?? []) as Row[]).map((r) => ({
      id: r.id!, kind: "contact" as const, created_at: r.created_at!, name: r.name!, company: null,
      email: r.email!, phone: null, subject: r.subject, message: r.message,
    })),
    ...((b2b.data ?? []) as Row[]).map((r) => ({
      id: r.id!, kind: "b2b" as const, created_at: r.created_at!, name: r.contact_name!, company: r.business_name,
      email: r.email!, phone: r.phone, subject: null, message: r.message,
    })),
    ...((restaurant.data ?? []) as Row[]).map((r) => ({
      id: r.id!, kind: "restaurant" as const, created_at: r.created_at!, name: r.contact_name!,
      company: [r.restaurant_name, r.city].filter(Boolean).join(", "),
      email: r.email!, phone: r.phone, subject: null, message: r.message,
    })),
  ].sort((a, b) => b.created_at.localeCompare(a.created_at));

  return {
    ok: true,
    data: {
      role,
      orders: ((orders.data ?? []) as AdminOrder[]).map((o) => ({ ...o, subtotal: Number(o.subtotal) })),
      messages,
      newsletter: (newsletter.data ?? []) as AdminData["newsletter"],
      products: ((products.data ?? []) as AdminProduct[]).map((p) => ({ ...p, price: Number(p.price) })),
      admins: (admins.data ?? []) as AdminUser[],
    },
  };
}

export async function updateOrderStatus(input: {
  orderId: string;
  status: "shipped" | "delivered" | "cancelled";
  trackingNumber?: string;
  note?: string;
}): Promise<Result<null>> {
  const insforge = await adminClient();
  if (!insforge) return { ok: false, error: "forbidden" };

  const { error } = await insforge.database.rpc("admin_update_order_status", {
    p_order_id: input.orderId,
    p_status: input.status,
    p_tracking_number: input.trackingNumber?.trim() || null,
    p_note: input.note?.trim() || null,
  });
  return error ? { ok: false, error: "failed", message: error.message } : { ok: true, data: null };
}

export async function updateProductStock(input: {
  slug: string;
  stockQuantity: number | null;
  inStock: boolean;
}): Promise<Result<null>> {
  const insforge = await adminClient();
  if (!insforge) return { ok: false, error: "forbidden" };

  const qty = input.stockQuantity;
  if (qty !== null && (!Number.isInteger(qty) || qty < 0 || qty > 100000)) {
    return { ok: false, error: "failed", message: "Stock must be a whole number ≥ 0" };
  }

  const { error } = await insforge.database
    .from("products")
    .update({ stock_quantity: qty, in_stock: input.inStock })
    .eq("slug", input.slug);
  return error ? { ok: false, error: "failed", message: error.message } : { ok: true, data: null };
}

export async function addAdmin(email: string): Promise<Result<null>> {
  const insforge = await superAdminClient();
  if (!insforge) return { ok: false, error: "forbidden" };

  const { error } = await insforge.database.rpc("admin_add_admin", { p_email: email.trim() });
  return error ? { ok: false, error: "failed", message: error.message } : { ok: true, data: null };
}

export async function removeAdmin(email: string): Promise<Result<null>> {
  const insforge = await superAdminClient();
  if (!insforge) return { ok: false, error: "forbidden" };

  const { error } = await insforge.database.rpc("admin_remove_admin", { p_email: email });
  return error ? { ok: false, error: "failed", message: error.message } : { ok: true, data: null };
}

export async function deleteOrder(orderId: string): Promise<Result<null>> {
  const insforge = await superAdminClient();
  if (!insforge) return { ok: false, error: "forbidden" };

  const { error } = await insforge.database.rpc("admin_delete_order", { p_order_id: orderId });
  return error ? { ok: false, error: "failed", message: error.message } : { ok: true, data: null };
}

export async function deleteSubmission(
  kind: AdminMessage["kind"] | "newsletter",
  id: string,
): Promise<Result<null>> {
  const insforge = await superAdminClient();
  if (!insforge) return { ok: false, error: "forbidden" };

  const { error } = await insforge.database.rpc("admin_delete_submission", { p_kind: kind, p_id: id });
  return error ? { ok: false, error: "failed", message: error.message } : { ok: true, data: null };
}
