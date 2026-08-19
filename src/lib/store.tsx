"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { api } from "./api";
import type { Order, Product } from "./api";

export type { Product } from "./api";

export interface CartItem {
  product: Product;
  color: string;
  qty: number;
}

interface StoreContextType {
  cart: CartItem[];
  cartCount: number;
  addToCart: (product: Product, color: string, qty: number) => void;
  removeFromCart: (index: number) => void;
  updateQty: (index: number, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  products: Product[];
  lastAdded: string | null;
  getPaymentSettings: () => Promise<{ cardNumber: string; cardOwner: string; telegramUsername: string }>;
  placeOrder: (customer: string, phone: string, address: string) => Promise<string>;
  getMyOrders: () => Promise<Order[]>;
  productsLoading: boolean;
}

const StoreContext = createContext<StoreContextType | null>(null);

const CART_KEY = "avera_cart";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const [productsLoading, setProductsLoading] = useState(true);
  const [cartHydrated, setCartHydrated] = useState(false);

  useEffect(() => {
    // Mahsulotlar faqat bazadan keladi. API bo'sh qaytarsa, sayt ham bo'sh ko'rinadi —
    // o'chirilgan mahsulot o'rnida namunaviy kontent qolib ketmasligi uchun.
    api.getProducts()
      .then((data) => {
        setProducts(data);
        // Admin paneldan o'chirilgan mahsulot savatda ham qolib ketmasin,
        // narxi/nomi o'zgargani esa yangilanadi.
        setCart((prev) =>
          prev
            .map((item) => {
              const fresh = data.find((p) => p.slug === item.product.slug);
              return fresh ? { ...item, product: fresh } : null;
            })
            .filter((item): item is CartItem => item !== null)
        );
      })
      .catch(() => setProducts([]))
      .finally(() => setProductsLoading(false));
  }, []);

  // Savat sahifa yangilanganda ham saqlanib qoladi
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) setCart(JSON.parse(stored));
    } catch {
      // buzilgan saqlangan savat — e'tiborsiz qoldiriladi
    }
    setCartHydrated(true);
  }, []);

  useEffect(() => {
    // Saqlangan savat o'qilmaguncha yozmaymiz — aks holda u bo'sh savat bilan almashib ketadi.
    if (!cartHydrated) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      // localStorage mavjud emas
    }
  }, [cart, cartHydrated]);

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
    const settings = await api.getPaymentSettings();
    return {
      cardNumber: settings.cardNumber,
      cardOwner: settings.cardOwner,
      telegramUsername: settings.telegramUsername,
    };
  }, []);

  const placeOrder = useCallback(async (customer: string, phone: string, address: string): Promise<string> => {
    const items = cart.map(item => ({
      name: item.product.name,
      qty: item.qty,
      price: item.product.priceNum,
      productId: item.product.id,
    }));

    const order = await api.createOrder({ customer, phone, address, items });
    localStorage.setItem("sumkaxona_phone", phone);
    setCart([]);
    return order.id;
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
      cart, cartCount, cartTotal, products, lastAdded, productsLoading,
      addToCart, removeFromCart, updateQty, clearCart,
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
