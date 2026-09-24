export interface OrderItem {
  productId: string; // matches ProductSize.id (e.g. "500ml", "750ml", "5L")
  name: { el: string; en: string };
  volume: string;
  quantity: number;
  price: number;
  image: string | null;
}

export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled" | "expired";

export interface Order {
  id: string; // human-facing order number, e.g. "ELL-1042"
  date: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
}

export function getOrderStatusLabel(status: OrderStatus, lang: "el" | "en") {
  const labels: Record<OrderStatus, { el: string; en: string }> = {
    pending: { el: "Εκκρεμεί πληρωμή", en: "Awaiting payment" },
    paid: { el: "Σε επεξεργασία", en: "Processing" },
    shipped: { el: "Απεστάλη", en: "Shipped" },
    delivered: { el: "Παραδόθηκε", en: "Delivered" },
    cancelled: { el: "Ακυρώθηκε", en: "Cancelled" },
    expired: { el: "Έληξε", en: "Expired" },
  };
  return labels[status][lang];
}
