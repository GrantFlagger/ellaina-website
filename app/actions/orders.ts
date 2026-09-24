"use server";

import { createInsForgeServerClient } from "@/lib/insforge-server";
import type { Order, OrderItem, OrderStatus } from "@/lib/orders";

type OrderRow = {
  order_number: string;
  created_at: string;
  status: OrderStatus;
  subtotal: number | string;
  items: OrderItem[];
};

/**
 * The signed-in customer's placed orders, newest first. RLS limits rows to
 * `user_id = auth.uid()`; unpaid/abandoned checkouts are left out.
 */
export async function getMyOrders(): Promise<Order[]> {
  const insforge = createInsForgeServerClient();
  const { data, error } = await insforge.database
    .from("orders")
    .select("order_number, created_at, status, subtotal, items")
    .in("status", ["paid", "shipped", "delivered", "cancelled"])
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !data) return [];

  return (data as OrderRow[]).map((row) => ({
    id: row.order_number,
    date: row.created_at,
    status: row.status,
    total: Number(row.subtotal),
    items: row.items,
  }));
}
