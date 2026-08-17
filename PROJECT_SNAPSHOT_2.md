# AVERA — Project Snapshot (2-qism: Store, Sahifalar, Komponentlar)

---

## 9. Store Fayllari

### src/lib/store.tsx

```tsx
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
```

### src/lib/admin-store.tsx

```tsx
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
```

### src/lib/i18n.tsx

> **Eslatma:** Bu fayl juda katta (UZ/EN/RU uchta til tarjimalari). To'liq kodi PROJECT_SNAPSHOT_1.md dagi `src/lib/data.ts` dan keyin keladi. Qisqacha tuzilishi:

```tsx
"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type Locale = "uz" | "en" | "ru";

const translations: Record<Locale, Record<string, string>> = {
  uz: {
    "nav.catalog": "Katalog",
    "nav.search": "Mahsulot qidirish...",
    "nav.search_link": "Qidiruv",
    "nav.profile": "Profil",
    "nav.cart": "Savat",
    "hero.badge": "Haftaning tanlovi",
    "hero.title": "Sumkalarga",
    "hero.discount": "chegirma",
    "hero.desc": "Toshkent bo'ylab 24 soatda yetkazamiz. Karta yoki naqd — o'zingiz tanlaysiz.",
    "hero.shop": "Xarid qilish",
    "hero.catalog": "Katalog",
    "hero.new": "Yangi kelganlar",
    "hero.new_desc": "Bu haftada 24 ta yangi model qo'shildi.",
    "perks.delivery": "24 soatda yetkazish",
    "perks.delivery_sub": "Toshkent shahri bo'ylab bepul",
    "perks.return": "30 kun qaytarish",
    "perks.return_sub": "Sababini so'ramaymiz",
    "perks.original": "Original charm",
    "perks.original_sub": "Har mahsulotga sertifikat",
    "products.popular": "Mashhur mahsulotlar",
    "products.all": "Barchasi",
    "products.add": "Savatga",
    "products.added": "Qo'shildi",
    "products.not_found": "Mahsulot topilmadi.",
    "products.back_catalog": "Katalogga qaytish",
    "catalog.title": "Ayollar sumkalari",
    "catalog.found": "mahsulot topildi",
    "cart.title": "Savat",
    "cart.empty": "Savatingiz bo'sh",
    "cart.go_catalog": "Katalogga o'tish",
    "cart.items": "mahsulot",
    "cart.summary": "Buyurtma xulosasi",
    "cart.products": "Mahsulotlar",
    "cart.delivery": "Yetkazib berish",
    "cart.free": "Bepul",
    "cart.total": "Jami",
    "cart.checkout": "To'lovga o'tish",
    "cart.continue": "Xaridni davom ettirish",
    "checkout.delivery": "Yetkazib berish",
    "checkout.name": "Ism",
    "checkout.name_ph": "Ismingiz",
    "checkout.phone": "Telefon",
    "checkout.phone_ph": "+998 90 000 00 00",
    "checkout.address": "Manzil",
    "checkout.address_ph": "Yetkazish manzili",
    "checkout.payment": "To'lov",
    "checkout.card_number": "Karta raqami",
    "checkout.transfer_instruction": "Ushbu kartaga {amount} so'm to'lov qiling va chekni {telegram} telegram akkauntiga yuboring",
    "checkout.order": "Buyurtma",
    "checkout.pay": "To'lanadi",
    "checkout.proceed_payment": "To'lovga o'tish",
    "checkout.paid_btn": "To'lov qildim",
    "checkout.paid_hint": "Tugmani faqat to'lovni amalga oshirib, chekni Telegramga yuborganingizdan keyin bosing",
    "checkout.order_placed": "Buyurtma qabul qilindi!",
    "checkout.order_placed_desc": "To'lovingiz tekshirilmoqda. Admin tasdiqlangandan so'ng buyurtmangiz yo'lga chiqadi.",
    "checkout.order_number": "Buyurtma raqami",
    "checkout.confirm": "Buyurtmani tasdiqlash",
    "confirm.title": "Buyurtma qabul qilindi",
    "confirm.desc": "raqamli buyurtma qabul qilindi. Kuryer 24 soat ichida aloqaga chiqadi.",
    "confirm.orders": "Buyurtmalarim",
    "confirm.close": "Yopish",
    "profile.orders": "Buyurtmalarim",
    "profile.status.pending": "Tasdiqlanishi kutilmoqda",
    "profile.status.transit": "Yo'lda",
    "profile.status.paid": "To'lov qilindi",
    "profile.status.cancelled": "Bekor qilindi",
    "search.clear": "Tozalash",
    "search.results": "bo'yicha",
    "search.result_count": "natija",
    "search.not_found": "Hech narsa topilmadi",
    "search.try_other": "Boshqa so'z bilan qidirib ko'ring",
    "search.hint": "Mahsulot nomini yozing",
    "product.color": "Rang",
    "product.add_cart": "Savatga qo'shish",
    "product.added_cart": "Qo'shildi",
    "product.new": "Yangi",
    "product.home": "Bosh sahifa",
    "footer.shop": "Do'kon",
    "footer.bags": "Sumkalar",
    "footer.backpacks": "Ryukzaklar",
    "footer.wallets": "Hamyonlar",
    "footer.discounts": "Chegirmalar",
    "footer.help": "Yordam",
    "footer.delivery": "Yetkazib berish",
    "footer.returns": "Qaytarish",
    "footer.sizes": "O'lcham jadvali",
    "footer.faq": "Savol-javob",
    "footer.company": "Kompaniya",
    "footer.about": "Biz haqimizda",
    "footer.stores": "Do'konlar",
    "footer.partnership": "Hamkorlik",
    "footer.contact": "Aloqa",
    "footer.rights": "Barcha huquqlar himoyalangan.",
    "footer.description": "AVERA — original charm sumkalar. 2019-yildan buyon 40 000+ mijoz.",
    "admin.dashboard": "Boshqaruv paneli",
    "admin.add_product": "Mahsulot qo'shish",
    "admin.products_count": "Mahsulotlar soni",
    "admin.orders": "Buyurtmalar",
    "admin.revenue": "Daromad",
    "admin.in_transit": "Yo'ldagi buyurtmalar",
    "admin.recent_orders": "Oxirgi buyurtmalar",
    "admin.view_all": "Hammasini ko'rish",
    "admin.order": "Buyurtma",
    "admin.customer": "Mijoz",
    "admin.date": "Sana",
    "admin.total": "Jami",
    "admin.status": "Holat",
    "admin.status.paid": "To'lov qilindi",
    "admin.status.pending": "Kutilmoqda",
    "admin.status.cancelled": "Bekor qilindi",
    "admin.status.transit": "Yo'lda",
    "admin.pending_orders": "Kutilayotgan to'lovlar",
    "admin.home": "Bosh sahifa",
    "admin.products": "Mahsulotlar",
    "admin.catalog": "Katalog",
    "admin.settings": "Sozlamalar",
    "admin.back_site": "Saytga qaytish",
  },
  en: { /* ... ingliz tilidagi tarjimalar (to'liq versiya uchun i18n.tsx fayliga qarang) ... */ },
  ru: { /* ... rus tilidagi tarjimalar (to'liq versiya uchun i18n.tsx fayliga qarang) ... */ },
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("uz");

  useEffect(() => {
    const stored = localStorage.getItem("sumkaxona_locale") as Locale | null;
    if (stored && translations[stored]) {
      setLocaleState(stored);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("sumkaxona_locale", newLocale);
  }, []);

  const t = useCallback((key: string): string => {
    return translations[locale][key] || key;
  }, [locale]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be inside I18nProvider");
  return ctx;
}
```

---

## 10. Sahifalar (Pages)

### src/app/layout.tsx

```tsx
import type { Metadata } from "next";
import { Inter, Roboto_Condensed } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { I18nProvider } from "@/lib/i18n";
import { LayoutShell } from "@/components/LayoutShell";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

const robotoCondensed = Roboto_Condensed({
  variable: "--font-brand",
  subsets: ["latin", "cyrillic"],
  weight: ["300"],
});

export const metadata: Metadata = {
  title: "AVERA — charm sumkalar do'koni",
  description: "Original charm sumkalar onlayn do'koni. Toshkent bo'ylab 24 soatda yetkazamiz.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="uz"
      className={`${inter.variable} ${robotoCondensed.variable} antialiased`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <I18nProvider>
          <StoreProvider>
            <LayoutShell>
              {children}
            </LayoutShell>
          </StoreProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
```

### src/app/globals.css

> **Eslatma:** CSS fayli juda katta (690+ qator). Asosiy tuzilishi:
> - `:root` CSS variables (colors, spacing)
> - `@theme inline` — Tailwind v4 theme tokens
> - Responsive grid utilities (.grid-hero, .grid-perks, .grid-products-4, .grid-products-3, .grid-product-detail, etc.)
> - Hover/transition effects (.product-card, .btn-accent, .btn-add, etc.)
> - Mobile responsive media queries (down to 320px)
> - Admin panel responsive styles

To'liq kodi PROJECT_SNAPSHOT_1.md ning 3-bo'limida (globals.css) keltirilmagan. Iltimos birinchi snapshot faylidagi src/app/globals.css qismini ko'ring.

---

## 11. Komponentlar

### src/components/LayoutShell.tsx

```tsx
"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ConfirmModal } from "@/components/ConfirmModal";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="container-main">
        <Header />
        <main>
          {children}
        </main>
        <Footer />
      </div>
      <ConfirmModal />
    </>
  );
}
```

### src/components/Header.tsx

> Header komponenti navigation, search, language toggle, cart badge va mobile menu'ni o'z ichiga oladi. To'liq kodi 228 qator. Asosiy xususiyatlari:
> - Sticky glassmorphism header
> - Desktop: nav links + search bar + profile + cart + language
> - Mobile: hamburger menu + compact buttons
> - Mobile dropdown navigation

### src/components/Footer.tsx

> Dark footer (4 ustunli grid), AVERA brendi, shop/help/company linklari, social media. To'liq kodi 59 qator.

### src/components/ProductCard.tsx

> Mahsulot kartasi: rasm, tag badge, nom, rang, narx, "savatga" tugmasi. To'liq kodi 92 qator. Props: product, aspectRatio, addButtonStyle ("icon"|"text"), hideTag.

### src/components/ConfirmModal.tsx

> Buyurtma tasdiqlangandan keyin chiqadigan modal dialog. To'liq kodi 74 qator.

### src/components/LanguageToggle.tsx

> UZ/EN/RU til almashtirish dropdown. Flag emoji + locale code ko'rsatadi. To'liq kodi 100 qator.

### src/components/AdminLogin.tsx

> Admin panel login formi (email + parol). To'liq kodi 139 qator.

---

## 12. Admin Panel Sahifalari

### src/app/admin/layout.tsx

> Admin layout: sidebar (dark), mobile header, auth gate (login screen agar token yo'q bo'lsa). Navigation: Bosh sahifa, Mahsulotlar, Katalog, Buyurtmalar, Sozlamalar. 210 qator.

### src/app/admin/page.tsx

> Dashboard: 4 ta stat kartasi (mahsulotlar soni, buyurtmalar, daromad, kutilayotganlar), oxirgi buyurtmalar jadvali. 138 qator.

### src/app/admin/mahsulotlar/page.tsx

> Mahsulotlar ro'yxati: table/grid ko'rinish, qidiruv, o'chirish modali. 307 qator.

### src/app/admin/mahsulotlar/yangi/page.tsx

> Yangi mahsulot qo'shish formi: nom, slug, tavsif, narx, zaxira, kategoriya, ranglar, xususiyatlar, rasm upload, tag. 441 qator.

### src/app/admin/mahsulotlar/[id]/page.tsx

> Mahsulotni tahrirlash formi (yangi qo'shish bilan deyarli bir xil). 540 qator.

### src/app/admin/buyurtmalar/page.tsx

> Buyurtmalar boshqaruvi: status tab filterlari, status o'zgartirish (tasdiqlash/bekor qilish), jadval. 163 qator.

### src/app/admin/katalog/page.tsx

> Kategoriyalar boshqaruvi: qo'shish, tahrirlash, o'chirish, tartibni o'zgartirish (yuqoriga/pastga). 252 qator.

### src/app/admin/sozlamalar/page.tsx

> Sayt sozlamalari: to'lov (karta raqami, egasi, telegram), hero section, yetkazish, aloqa. Live preview sidebar. 281 qator.

---

## 13. Ishga Tushirish Qo'llanmasi

### Noldan o'rnatish qadamlari:

```bash
# 1. Loyihani klonlash yoki papka yaratish
mkdir sumkaxona && cd sumkaxona

# 2. package.json yaratish va dependencylarni o'rnatish
npm install

# 3. Environment variables (.env fayl yaratish)
cp .env.example .env
# .env faylda DATABASE_URL ni o'zingizning PostgreSQL bazangizga o'zgartiring

# 4. Prisma client generatsiya qilish
npx prisma generate

# 5. Database schema'ni push qilish (jadvallarni yaratish)
npx prisma db push

# 6. Development serverni ishga tushirish
npm run dev

# 7. Bazaga boshlang'ich ma'lumotlarni qo'shish (server ishlayotgan bo'lishi kerak)
npm run db:seed
# yoki brauzerda: POST http://localhost:3000/api/seed

# 8. Admin panelga kirish
# Brauzerda: http://localhost:3000/admin
# Login: admin@avera.uz / admin123 (yoki .env dagi qiymatlar)
```

### Production uchun build:

```bash
npm run build
npm run start
```

### Muhim eslatmalar:
- PostgreSQL server ishlayotgan bo'lishi kerak
- `DATABASE_URL` to'g'ri format: `postgresql://user:password@host:port/dbname`
- Prisma 7 `@prisma/adapter-pg` driver adapterni talab qiladi
- `prisma.config.ts` faylida datasource URL `process.env.DATABASE_URL` dan olinadi
- Seed qilish uchun server ishlayotgan bo'lishi kerak (API endpoint orqali)
- Admin birinchi marta login qilganda `.env` dagi credentials bilan auto-create bo'ladi

---

## 14. Arxitektura Eslatmalari

### Authentication:
- JWT token (7 kun muddatli) localStorage'da saqlanadi
- Har bir admin API so'rovda `Authorization: Bearer <token>` header yuboriladi
- Birinchi login'da admin record auto-create bo'ladi

### To'lov jarayoni:
1. Mijoz buyurtma beradi (ism, telefon, manzil)
2. Karta raqami ko'rsatiladi (PaymentSettings dan)
3. Mijoz to'lov qilib, chekni Telegram'ga yuboradi
4. Admin buyurtmani tasdiqlaydi (status: kutilmoqda -> tolangan)

### Order statuslari:
- `kutilmoqda` — yangi buyurtma, to'lov kutilmoqda
- `tolangan` — to'lov tasdiqlangan
- `yolda` — yetkazilmoqda
- `bekor` — bekor qilingan

### Internationalization:
- 3 til: O'zbek (default), English, Русский
- localStorage'da saqlanadi (`sumkaxona_locale`)
- Context API orqali `useI18n()` hook

### Data Flow:
- Frontend `src/lib/api.ts` orqali backend API'ga murojaat qiladi
- Backend Prisma ORM orqali PostgreSQL'ga yozadi/o'qiydi
- Admin store har 10 soniyada buyurtmalarni polling qiladi
