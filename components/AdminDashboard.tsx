"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getOrderStatusLabel } from "@/lib/orders";
import {
  getAdminData,
  updateOrderStatus,
  updateProductStock,
  type AdminData,
  type AdminOrder,
  type AdminProduct,
} from "@/app/actions/admin";

type Tab = "orders" | "messages" | "newsletter" | "products";

const TABS: { id: Tab; label: string }[] = [
  { id: "orders", label: "Orders" },
  { id: "messages", label: "Messages" },
  { id: "newsletter", label: "Newsletter" },
  { id: "products", label: "Stock" },
];

const euro = (n: number) => `€${n.toFixed(2)}`;
const when = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });

const card = "rounded-xl border border-bark/10 bg-white p-5 dark:border-cream/10 dark:bg-white/[0.04]";
const input =
  "rounded-lg border border-bark/15 bg-white px-3 py-2 font-body text-sm text-bark outline-none focus:border-secondary dark:border-cream/15 dark:bg-night-subtle dark:text-cream";
const button =
  "rounded-full bg-secondary px-4 py-2 font-body text-xs font-semibold text-bark transition-colors hover:bg-secondary-600 hover:text-white disabled:opacity-50";

export default function AdminDashboard() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("orders");
  const [data, setData] = useState<AdminData | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "forbidden" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const result = await getAdminData();
    if (result.ok) {
      setData(result.data);
      setState("ready");
    } else {
      setState(result.error === "forbidden" ? "forbidden" : "error");
      setError(result.message ?? null);
    }
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    void load();
  }, [isLoading, isAuthenticated, router, load]);

  if (state === "loading") {
    return (
      <div className="flex justify-center pt-48">
        <Loader2 className="h-6 w-6 animate-spin text-secondary" />
      </div>
    );
  }

  if (state === "forbidden") {
    return (
      <p className="mx-auto max-w-md px-6 pt-48 text-center font-body text-bark/70 dark:text-cream/70">
        This account doesn&apos;t have admin access.
      </p>
    );
  }

  if (state === "error" || !data) {
    return (
      <p className="mx-auto max-w-md px-6 pt-48 text-center font-body text-red-600">
        Couldn&apos;t load admin data{error ? `: ${error}` : "."}
      </p>
    );
  }

  const toShip = data.orders.filter((o) => o.status === "paid").length;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-32 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-bark dark:text-cream">Admin</h1>
          <p className="mt-1 font-body text-sm text-bark/60 dark:text-cream/55">
            {toShip} order{toShip === 1 ? "" : "s"} to ship · {data.messages.length} messages ·{" "}
            {data.newsletter.length} subscribers
          </p>
        </div>
        <button onClick={() => void load()} className={button}>
          Refresh
        </button>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`whitespace-nowrap rounded-full px-4 py-2 font-body text-sm transition-colors ${
              tab === t.id
                ? "bg-primary text-white dark:bg-secondary dark:text-bark"
                : "text-bark/60 hover:bg-primary/5 dark:text-cream/60"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "orders" && <OrdersTab orders={data.orders} onChanged={load} />}
      {tab === "messages" && (
        <div className="space-y-3">
          {data.messages.length === 0 && <Empty text="No messages yet." />}
          {data.messages.map((m) => (
            <div key={`${m.kind}-${m.id}`} className={card}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-heading text-base font-bold text-bark dark:text-cream">
                  {m.name}
                  {m.company && <span className="font-body text-sm font-normal text-bark/60 dark:text-cream/55"> · {m.company}</span>}
                </p>
                <span className="font-body text-xs text-bark/50 dark:text-cream/45">
                  {m.kind === "contact" ? "Contact" : m.kind === "b2b" ? "B2B" : "Restaurant"} · {when(m.created_at)}
                </span>
              </div>
              <p className="mt-1 font-body text-sm text-secondary">
                <a href={`mailto:${m.email}`}>{m.email}</a>
                {m.phone && <span className="text-bark/60 dark:text-cream/55"> · {m.phone}</span>}
              </p>
              {m.subject && <p className="mt-2 font-body text-sm font-semibold text-bark dark:text-cream">{m.subject}</p>}
              {m.message && (
                <p className="mt-2 whitespace-pre-wrap font-body text-sm text-bark/75 dark:text-cream/70">{m.message}</p>
              )}
            </div>
          ))}
        </div>
      )}
      {tab === "newsletter" && (
        <div className={card}>
          {data.newsletter.length === 0 ? (
            <Empty text="No subscribers yet." />
          ) : (
            <>
              <button
                className={`${button} mb-4`}
                onClick={() => navigator.clipboard.writeText(data.newsletter.map((s) => s.email).join("\n"))}
              >
                Copy all emails
              </button>
              <ul className="divide-y divide-bark/10 dark:divide-cream/10">
                {data.newsletter.map((s) => (
                  <li key={s.email} className="flex justify-between py-2 font-body text-sm text-bark dark:text-cream">
                    <span>{s.email}</span>
                    <span className="text-bark/50 dark:text-cream/45">
                      {s.language ?? "—"} · {when(s.created_at)}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
      {tab === "products" && (
        <div className="space-y-3">
          <p className="font-body text-xs text-bark/55 dark:text-cream/50">
            Leave stock empty to not track it. Stock goes down automatically when an order is paid and back up
            when a paid order is cancelled; at 0 the product is hidden from the shop.
          </p>
          {data.products.map((p) => (
            <ProductRow key={p.slug} product={p} onChanged={load} />
          ))}
        </div>
      )}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="font-body text-sm text-bark/60 dark:text-cream/55">{text}</p>;
}

function OrdersTab({ orders, onChanged }: { orders: AdminOrder[]; onChanged: () => Promise<void> }) {
  const [filter, setFilter] = useState<"open" | "all">("open");
  const shown = filter === "open" ? orders.filter((o) => o.status === "paid" || o.status === "shipped") : orders;

  return (
    <div className="space-y-3">
      <select value={filter} onChange={(e) => setFilter(e.target.value as "open" | "all")} className={input}>
        <option value="open">To ship / in transit</option>
        <option value="all">All orders</option>
      </select>
      {shown.length === 0 && <Empty text="No orders here." />}
      {shown.map((o) => (
        <OrderCard key={o.id} order={o} onChanged={onChanged} />
      ))}
    </div>
  );
}

function OrderCard({ order, onChanged }: { order: AdminOrder; onChanged: () => Promise<void> }) {
  const [tracking, setTracking] = useState(order.tracking_number ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const move = async (status: "shipped" | "delivered" | "cancelled") => {
    if (status === "cancelled" && !window.confirm(`Cancel ${order.order_number}? Refund it in Stripe separately.`)) return;
    setBusy(true);
    setError(null);
    const result = await updateOrderStatus({ orderId: order.id, status, trackingNumber: tracking });
    setBusy(false);
    if (result.ok) await onChanged();
    else setError(result.message ?? "Update failed");
  };

  return (
    <div className={card}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-heading text-lg font-bold text-bark dark:text-cream">
          {order.order_number}
          {order.stripe_environment === "test" && (
            <span className="ml-2 rounded bg-bark/10 px-1.5 py-0.5 font-body text-[10px] font-semibold uppercase text-bark/60 dark:bg-cream/10 dark:text-cream/60">
              test
            </span>
          )}
        </p>
        <p className="font-body text-sm text-bark/70 dark:text-cream/65">
          <span className="mr-2 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary dark:bg-secondary/10 dark:text-secondary">
            {getOrderStatusLabel(order.status, "en")}
          </span>
          {euro(order.subtotal)} · {when(order.created_at)}
        </p>
      </div>

      <div className="mt-3 grid gap-4 font-body text-sm text-bark/80 dark:text-cream/75 sm:grid-cols-2">
        <div>
          <p className="font-semibold text-bark dark:text-cream">{order.full_name}</p>
          <p>{order.address}</p>
          <p>
            {order.postal_code} {order.city}, {order.country}
          </p>
          <p className="mt-1">
            <a className="text-secondary" href={`mailto:${order.email}`}>{order.email}</a>
            {order.phone && ` · ${order.phone}`}
          </p>
          {order.notes && <p className="mt-2 italic">“{order.notes}”</p>}
        </div>
        <ul>
          {order.items.map((i) => (
            <li key={i.productId}>
              {i.quantity} × {i.name.en} {i.volume} — {euro(i.price * i.quantity)}
            </li>
          ))}
        </ul>
      </div>

      {(order.status === "paid" || order.status === "shipped" || order.status === "pending") && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-bark/10 pt-4 dark:border-cream/10">
          {order.status === "paid" && (
            <>
              <input
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
                placeholder="Tracking number (optional)"
                className={input}
              />
              <button disabled={busy} onClick={() => move("shipped")} className={button}>
                Mark shipped
              </button>
            </>
          )}
          {order.status === "shipped" && (
            <button disabled={busy} onClick={() => move("delivered")} className={button}>
              Mark delivered
            </button>
          )}
          <button
            disabled={busy}
            onClick={() => move("cancelled")}
            className="font-body text-xs text-bark/50 hover:text-red-600 disabled:opacity-50 dark:text-cream/45"
          >
            Cancel order
          </button>
          {order.tracking_number && order.status !== "paid" && (
            <span className="font-body text-xs text-bark/60 dark:text-cream/55">Tracking: {order.tracking_number}</span>
          )}
          {error && <span className="font-body text-xs text-red-600">{error}</span>}
        </div>
      )}
    </div>
  );
}

function ProductRow({ product, onChanged }: { product: AdminProduct; onChanged: () => Promise<void> }) {
  const [stock, setStock] = useState(product.stock_quantity === null ? "" : String(product.stock_quantity));
  const [inStock, setInStock] = useState(product.in_stock);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setBusy(true);
    setError(null);
    const result = await updateProductStock({
      slug: product.slug,
      stockQuantity: stock.trim() === "" ? null : Number(stock),
      inStock,
    });
    setBusy(false);
    if (result.ok) await onChanged();
    else setError(result.message ?? "Save failed");
  };

  return (
    <div className={`${card} flex flex-wrap items-center gap-4`}>
      <p className="min-w-[10rem] flex-1 font-heading text-base font-bold text-bark dark:text-cream">
        {product.name} {product.volume}
        <span className="ml-2 font-body text-sm font-normal text-bark/55 dark:text-cream/50">{euro(product.price)}</span>
      </p>
      <label className="flex items-center gap-2 font-body text-sm text-bark/70 dark:text-cream/65">
        Stock
        <input
          type="number"
          min={0}
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="not tracked"
          className={`${input} w-32`}
        />
      </label>
      <label className="flex items-center gap-2 font-body text-sm text-bark/70 dark:text-cream/65">
        <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
        Shown in shop
      </label>
      <button disabled={busy} onClick={save} className={button}>
        Save
      </button>
      {error && <span className="font-body text-xs text-red-600">{error}</span>}
    </div>
  );
}
