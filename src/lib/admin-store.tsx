"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { api } from "./api";
import type {
  Product, Order, Category, CategoryInput, SiteSettings,
  FooterSection, PartnerRequest,
} from "./api";

export type { Product, Order, Category, SiteSettings, FooterSection, PartnerRequest } from "./api";

export interface PaymentSettings {
  cardNumber: string;
  cardOwner: string;
  telegramUsername: string;
}

export interface FullSiteSettings extends Omit<SiteSettings, "id"> {
  payment: PaymentSettings;
}

interface AdminContextType {
  products: Product[];
  orders: Order[];
  settings: FullSiteSettings;
  categories: Category[];
  footer: FooterSection[];
  partnerRequests: PartnerRequest[];
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addProduct: (product: Partial<Product>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateOrderStatus: (id: string, status: string) => Promise<void>;
  updateSettings: (settings: FullSiteSettings) => Promise<void>;
  addCategory: (category: CategoryInput) => Promise<void>;
  updateCategory: (id: string, category: CategoryInput) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  saveFooter: (sections: FooterSection[]) => Promise<void>;
  updatePartnerRequestStatus: (id: string, status: string) => Promise<void>;
  deletePartnerRequest: (id: string) => Promise<void>;
  refreshOrders: () => Promise<void>;
  refreshProducts: () => Promise<void>;
}

export const defaultSettings: FullSiteSettings = {
  heroBadge: "",
  heroTitle: "",
  heroSubtitle: "",
  heroDiscount: "",
  heroImage: "",
  heroCtaText: "",
  heroCtaLink: "/katalog",
  featuredTitle: "",
  freeDeliveryMin: 0,
  contactPhone: "",
  telegram: "",
  instagram: "",
  address: "",
  workHours: "",
  footerAbout: "",
  payment: { cardNumber: "", cardOwner: "", telegramUsername: "" },
};

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<FullSiteSettings>(defaultSettings);
  const [categories, setCategories] = useState<Category[]>([]);
  const [footer, setFooter] = useState<FooterSection[]>([]);
  const [partnerRequests, setPartnerRequests] = useState<PartnerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [productsData, ordersData, categoriesData, settingsData, paymentData, footerData, partnersData] =
        await Promise.all([
          api.getProducts(),
          api.getOrders(),
          api.getCategories(true),
          api.getSettings(),
          api.getPaymentSettings(),
          api.getFooter(true),
          api.getPartnerRequests(),
        ]);

      setProducts(productsData);
      setOrders(ordersData);
      setCategories(categoriesData);
      setFooter(footerData);
      setPartnerRequests(partnersData);
      setSettings({
        heroBadge: settingsData.heroBadge,
        heroTitle: settingsData.heroTitle,
        heroSubtitle: settingsData.heroSubtitle,
        heroDiscount: settingsData.heroDiscount,
        heroImage: settingsData.heroImage,
        heroCtaText: settingsData.heroCtaText,
        heroCtaLink: settingsData.heroCtaLink,
        featuredTitle: settingsData.featuredTitle,
        freeDeliveryMin: settingsData.freeDeliveryMin,
        contactPhone: settingsData.contactPhone,
        telegram: settingsData.telegram,
        instagram: settingsData.instagram,
        address: settingsData.address,
        workHours: settingsData.workHours,
        footerAbout: settingsData.footerAbout,
        payment: {
          cardNumber: paymentData.cardNumber,
          cardOwner: paymentData.cardOwner,
          telegramUsername: paymentData.telegramUsername,
        },
      });
    } catch {
      // API javob bermadi — bo'sh holat bilan davom etamiz
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const authed = !!localStorage.getItem("admin_token");
    setIsAuthenticated(authed);
    if (authed) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [loadData]);

  // Yangi buyurtmalar uchun har 10 soniyada tekshiriladi
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(async () => {
      try {
        setOrders(await api.getOrders());
      } catch {
        // polling xatolari e'tiborsiz
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
    setProducts(await api.getProducts());
  }, []);

  const updateProduct = useCallback(async (id: string, product: Partial<Product>) => {
    await api.updateProduct(id, product);
    setProducts(await api.getProducts());
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
    const { payment, ...site } = newSettings;
    await api.updateSettings({ id: "default", ...site });
    await api.updatePaymentSettings({ id: "default", ...payment });
    setSettings(newSettings);
  }, []);

  const addCategory = useCallback(async (category: CategoryInput) => {
    await api.createCategory(category);
    setCategories(await api.getCategories(true));
  }, []);

  const updateCategory = useCallback(async (id: string, category: CategoryInput) => {
    await api.updateCategory(id, category);
    setCategories(await api.getCategories(true));
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    await api.deleteCategory(id);
    setCategories(await api.getCategories(true));
    // Kategoriya o'chirilganda mahsulotlar kategoriyasiz qoladi — ro'yxatni yangilaymiz
    setProducts(await api.getProducts());
  }, []);

  const saveFooter = useCallback(async (sections: FooterSection[]) => {
    const saved = await api.updateFooter(sections);
    setFooter(saved);
  }, []);

  const updatePartnerRequestStatus = useCallback(async (id: string, status: string) => {
    await api.updatePartnerRequestStatus(id, status);
    setPartnerRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  }, []);

  const deletePartnerRequest = useCallback(async (id: string) => {
    await api.deletePartnerRequest(id);
    setPartnerRequests(prev => prev.filter(r => r.id !== id));
  }, []);

  const refreshOrders = useCallback(async () => {
    setOrders(await api.getOrders());
  }, []);

  const refreshProducts = useCallback(async () => {
    setProducts(await api.getProducts());
  }, []);

  return (
    <AdminContext.Provider value={{
      products, orders, settings, categories, footer, partnerRequests, loading, isAuthenticated,
      login, logout,
      addProduct, updateProduct, deleteProduct,
      updateOrderStatus, updateSettings,
      addCategory, updateCategory, deleteCategory,
      saveFooter, updatePartnerRequestStatus, deletePartnerRequest,
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
