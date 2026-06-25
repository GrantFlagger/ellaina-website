"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { type ProductSize } from "@/lib/products";

export type CartItem = {
  id:       string;        // product slug — stable unique key
  name:     string;
  volume:   string;
  price:    number;        // unit price (EUR)
  image:    string | null;
  quantity: number;
};

type CartContextType = {
  items:      CartItem[];
  count:      number;       // total quantity across all lines
  subtotal:   number;       // EUR
  isOpen:     boolean;
  openCart:   () => void;
  closeCart:  () => void;
  addItem:    (size: ProductSize, quantity?: number) => void;
  removeItem: (id: string) => void;
  setQuantity:(id: string, quantity: number) => void;
  clearCart:  () => void;
};

const STORAGE_KEY = "ellaina-cart";

const CartContext = createContext<CartContextType>({
  items: [],
  count: 0,
  subtotal: 0,
  isOpen: false,
  openCart: () => {},
  closeCart: () => {},
  addItem: () => {},
  removeItem: () => {},
  setQuantity: () => {},
  clearCart: () => {},
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [items,  setItems]  = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted cart once on mount.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      /* ignore corrupted cart */
    }
    setHydrated(true);
  }, []);

  // Persist on change (only after the initial load, so we never clobber storage with []).
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((size: ProductSize, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === size.id);
      if (existing) {
        return prev.map((i) =>
          i.id === size.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          id:       size.id,
          name:     size.name,
          volume:   size.volume,
          price:    size.priceNum,
          image:    size.image,
          quantity,
        },
      ];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const setQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const count    = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        subtotal,
        isOpen,
        openCart:  () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addItem,
        removeItem,
        setQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
