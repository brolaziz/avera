"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { api } from "./api";
import type { Product, Order, Category } from "./api";

export type { Product, Order, Category } from "./api";

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

export interface PaymentSettings {
  cardNumber: string;
  cardOwner: string;
  telegramUsername: string;
}

export interface FullSiteSettings {
  heroTitle: string;
  heroDiscount: string;
  freeDeliveryMin: number;
  contactPhone: string;
  telegram: string;
  instagram: string;
  payment: PaymentSettings;
}

interface AdminContextType {
  products: Product[];
  orders: Order[];
  settings: FullSiteSettings;
  categories: Category[];
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addProduct: (product: Partial<Product>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateOrderStatus: (id: string, status: string) => Promise<void>;
  updateSettings: (settings: FullSiteSettings) => Promise<void>;
  addCategory: (category: { name: string; slug: string; order?: number }) => Promise<void>;
  updateCategory: (id: string, category: { name: string; slug: string; order?: number }) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  refreshOrders: () => Promise<void>;
  refreshProducts: () => Promise<void>;
}

const defaultSettings: FullSiteSettings = {
  heroTitle: "Tabiiy charm sumkalar kolleksiyasi",
  heroDiscount: "20",
  freeDeliveryMin: 500000,
  contactPhone: "+998 90 123 45 67",
  telegram: "https://t.me/avera",
  instagram: "https://instagram.com/avera",
  payment: {
    cardNumber: "8600 1234 5678 9012",
    cardOwner: "AVERA SHOP",
    telegramUsername: "@avera_admin",
  },
};

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<FullSiteSettings>(defaultSettings);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem("admin_token");
    return !!token;
  }, []);

  const loadData = useCallback(async () => {
    try {
      const [productsData, ordersData, categoriesData, settingsData, paymentData] = await Promise.all([
        api.getProducts(),
        api.getOrders(),
        api.getCategories(),
        api.getSettings(),
        api.getPaymentSettings(),
      ]);
      setProducts(productsData);
      setOrders(ordersData);
      setCategories(categoriesData);
      setSettings({
        heroTitle: settingsData.heroTitle,
        heroDiscount: settingsData.heroDiscount,
        freeDeliveryMin: settingsData.freeDeliveryMin,
        contactPhone: settingsData.contactPhone,
        telegram: settingsData.telegram,
        instagram: settingsData.instagram,
        payment: {
          cardNumber: paymentData.cardNumber,
          cardOwner: paymentData.cardOwner,
          telegramUsername: paymentData.telegramUsername,
        },
      });
    } catch {
      // API unavailable — stay with defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const authed = checkAuth();
    setIsAuthenticated(authed);
    if (authed) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [checkAuth, loadData]);

  // Poll for new orders every 10 seconds
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(async () => {
      try {
        const ordersData = await api.getOrders();
        setOrders(ordersData);
      } catch {
        // ignore polling errors
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const { token } = await api.login(email, password);
      localStorage.setItem("admin_token", token);
      setIsAuthenticated(true);
      await loadData();
      return true;
    } catch {
      return false;
    }
  }, [loadData]);

  const logout = useCallback(() => {
    localStorage.removeItem("admin_token");
    setIsAuthenticated(false);
  }, []);

  const addProduct = useCallback(async (product: Partial<Product>) => {
    await api.createProduct(product);
    const updated = await api.getProducts();
    setProducts(updated);
  }, []);

  const updateProduct = useCallback(async (id: string, product: Partial<Product>) => {
    await api.updateProduct(id, product);
    const updated = await api.getProducts();
    setProducts(updated);
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    await api.deleteProduct(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const updateOrderStatus = useCallback(async (id: string, status: string) => {
    await api.updateOrderStatus(id, status);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  }, []);

  const updateSettings = useCallback(async (newSettings: FullSiteSettings) => {
    await api.updateSettings({
      id: "default",
      heroTitle: newSettings.heroTitle,
      heroDiscount: newSettings.heroDiscount,
      freeDeliveryMin: newSettings.freeDeliveryMin,
      contactPhone: newSettings.contactPhone,
      telegram: newSettings.telegram,
      instagram: newSettings.instagram,
    });
    await api.updatePaymentSettings({
      id: "default",
      cardNumber: newSettings.payment.cardNumber,
      cardOwner: newSettings.payment.cardOwner,
      telegramUsername: newSettings.payment.telegramUsername,
    });
    setSettings(newSettings);
  }, []);

  const addCategory = useCallback(async (category: { name: string; slug: string; order?: number }) => {
    await api.createCategory(category);
    const updated = await api.getCategories();
    setCategories(updated);
  }, []);

  const updateCategory = useCallback(async (id: string, category: { name: string; slug: string; order?: number }) => {
    await api.updateCategory(id, category);
    const updated = await api.getCategories();
    setCategories(updated);
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    await api.deleteCategory(id);
    setCategories(prev => prev.filter(c => c.id !== id));
  }, []);

  const refreshOrders = useCallback(async () => {
    const ordersData = await api.getOrders();
    setOrders(ordersData);
  }, []);

  const refreshProducts = useCallback(async () => {
    const productsData = await api.getProducts();
    setProducts(productsData);
  }, []);

  return (
    <AdminContext.Provider value={{
      products, orders, settings, categories, loading, isAuthenticated,
      login, logout,
      addProduct, updateProduct, deleteProduct,
      updateOrderStatus, updateSettings,
      addCategory, updateCategory, deleteCategory,
      refreshOrders, refreshProducts,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be inside AdminProvider");
  return ctx;
}
