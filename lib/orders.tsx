export interface OrderItem {
  productId: string; // matches ProductSize.id (e.g. "500ml", "750ml", "5L")
  name: { el: string; en: string };
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: OrderItem[];
}

// TODO: replace with InsForge query once orders table is wired up.
// Item shape mirrors PRODUCT_SIZES in lib/products.ts (same ids, names, images)
// so switching to real order data later is a straight swap.
export const mockOrders: Order[] = [
  {
    id: "ELL-1042",
    date: "2026-07-14",
    status: "delivered",
    total: 43.0,
    items: [
      {
        productId: "500ml",
        name: { el: "Οικογενειακή Επιλογή", en: "Family Choice" },
        quantity: 2,
        price: 13,
        image: "/images/bottle-warm.png",
      },
      {
        productId: "750ml",
        name: { el: "Premium Φιάλη", en: "Premium Bottle" },
        quantity: 1,
        price: 17,
        image: "/images/bottle-classic.png",
      },
    ],
  },
  {
    id: "ELL-1038",
    date: "2026-06-02",
    status: "shipped",
    total: 13,
    items: [
      {
        productId: "500ml",
        name: { el: "Οικογενειακή Επιλογή", en: "Family Choice" },
        quantity: 1,
        price: 13,
        image: "/images/bottle-warm.png",
      },
    ],
  },
];

export function getOrderStatusLabel(status: Order["status"], lang: "el" | "en") {
  const labels: Record<Order["status"], { el: string; en: string }> = {
    pending: { el: "Σε επεξεργασία", en: "Processing" },
    shipped: { el: "Απεστάλη", en: "Shipped" },
    delivered: { el: "Παραδόθηκε", en: "Delivered" },
    cancelled: { el: "Ακυρώθηκε", en: "Cancelled" },
  };
  return labels[status][lang];
}