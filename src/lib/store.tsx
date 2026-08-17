"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { type Product } from "./data";
import { api } from "./api";
import type { Order } from "./api";

export type { Product } from "./data";

export interface CartItem {
  product: Product;
  color: string;
  qty: number;
}

interface StoreContextType {
  cart: CartItem[];
  cartCount: number;
  confirmOpen: boolean;
  addToCart: (product: Product, color: string, qty: number) => void;
  removeFromCart: (index: number) => void;
  updateQty: (index: number, qty: number) => void;
  clearCart: () => void;
  openConfirm: () => void;
  closeConfirm: () => void;
  cartTotal: number;
  products: Product[];
  lastAdded: string | null;
  getPaymentSettings: () => Promise<{ cardNumber: string; cardOwner: string; telegramUsername: string }>;
  placeOrder: (customer: string, phone: string, address: string) => Promise<string>;
  getMyOrders: () => Promise<Order[]>;
  productsLoading: boolean;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    api.getProducts()
      .then((data) => {
        setProducts(data as unknown as Product[]);
        setProductsLoading(false);
      })
      .catch(() => {
        // Fallback to local data if API unavailable
        import("./data").then(({ products: defaultProducts }) => {
          setProducts(defaultProducts);
          setProductsLoading(false);
        });
      });
  }, []);

  const addToCart = useCallback((product: Product, color: string, qty: number) => {
    setCart(prev => {
      const existing = prev.findIndex(item => item.product.slug === product.slug && item.color === color);
      if (existing >= 0) {
        const next = [...prev];
        next[existing] = { ...next[existing], qty: next[existing].qty + qty };
        return next;
      }
      return [...prev, { product, color, qty }];
    });
    setLastAdded(product.slug);
    setTimeout(() => setLastAdded(null), 1200);
  }, []);

  const removeFromCart = useCallback((index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const updateQty = useCallback((index: number, qty: number) => {
    if (qty < 1) return;
    setCart(prev => prev.map((item, i) => i === index ? { ...item, qty } : item));
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.priceNum * item.qty, 0);

  const getPaymentSettings = useCallback(async () => {
    try {
      const settings = await api.getPaymentSettings();
      return {
        cardNumber: settings.cardNumber,
        cardOwner: settings.cardOwner,
        telegramUsername: settings.telegramUsername,
      };
    } catch {
      return {
        cardNumber: "8600 1234 5678 9012",
        cardOwner: "AVERA SHOP",
        telegramUsername: "@avera_admin",
      };
    }
  }, []);

  const placeOrder = useCallback(async (customer: string, phone: string, address: string): Promise<string> => {
    const items = cart.map(item => ({
      name: item.product.name,
  qty: item.qty,
      price: item.product.priceNum,
      productId: item.product.id,
    }));

    try {
      const order = await api.createOrder({ customer, phone, address, items });
      // Save phone for profile orders lookup
      localStorage.setItem("sumkaxona_phone", phone);
      setCart([]);
      return order.id;
    } catch {
      // Fallback: generate local order ID
      const orderId = "ORD-" + String(Date.now()).slice(-6);
      setCart([]);
      return orderId;
    }
  }, [cart]);

  const getMyOrders = useCallback(async (): Promise<Order[]> => {
    try {
      const phone = localStorage.getItem("sumkaxona_phone");
      if (!phone) return [];
      return await api.getMyOrders(phone);
    } catch {
      return [];
    }
  }, []);

  return (
    <StoreContext.Provider value={{
      cart, cartCount, confirmOpen, cartTotal, products, lastAdded, productsLoading,
      addToCart, removeFromCart, updateQty, clearCart,
      openConfirm: () => setConfirmOpen(true),
      closeConfirm: () => setConfirmOpen(false),
      getPaymentSettings, placeOrder, getMyOrders,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be inside StoreProvider");
  return ctx;
}

export function formatPrice(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
