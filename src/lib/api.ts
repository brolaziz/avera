const BASE = "/api";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    // Admin o'zgartirishlari mijoz saytida darhol ko'rinishi uchun kesh ishlatilmaydi.
    cache: "no-store",
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Server xatolik" }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

/** Rasm yuklash — FormData yuboriladi, shuning uchun Content-Type qo'lda o'rnatilmaydi. */
async function uploadImage(file: File): Promise<UploadedMedia> {
  const token = getToken();
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${BASE}/upload`, {
    method: "POST",
    body: form,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Rasmni yuklab bo'lmadi" }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Products
  getProducts: () => request<Product[]>("/products"),
  getProduct: (id: string) => request<Product>(`/products/${id}`),
  createProduct: (data: Partial<Product>) => request<Product>("/products", { method: "POST", body: JSON.stringify(data) }),
  updateProduct: (id: string, data: Partial<Product>) => request<Product>(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteProduct: (id: string) => request<{ success: boolean }>(`/products/${id}`, { method: "DELETE" }),

  // Orders
  getOrders: () => request<Order[]>("/orders"),
  createOrder: (data: { customer: string; phone: string; address: string; items: OrderItemInput[] }) =>
    request<Order>("/orders", { method: "POST", body: JSON.stringify(data) }),
  updateOrderStatus: (id: string, status: string) =>
    request<Order>(`/orders/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }),
  getMyOrders: (phone: string) => request<Order[]>(`/my-orders?phone=${encodeURIComponent(phone)}`),

  // Categories — `all` faqat admin panelda ishlatiladi (yashirilganlar bilan birga)
  getCategories: (all = false) => request<Category[]>(`/categories${all ? "?all=1" : ""}`),
  createCategory: (data: CategoryInput) =>
    request<Category>("/categories", { method: "POST", body: JSON.stringify(data) }),
  updateCategory: (id: string, data: CategoryInput) =>
    request<Category>(`/categories/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteCategory: (id: string) => request<{ success: boolean }>(`/categories/${id}`, { method: "DELETE" }),

  // Settings
  getSettings: () => request<SiteSettings>("/settings"),
  updateSettings: (data: Partial<SiteSettings>) => request<SiteSettings>("/settings", { method: "PUT", body: JSON.stringify(data) }),

  // Payment
  getPaymentSettings: () => request<PaymentSettingsType>("/payment-settings"),
  updatePaymentSettings: (data: PaymentSettingsType) =>
    request<PaymentSettingsType>("/payment-settings", { method: "PUT", body: JSON.stringify(data) }),

  // Footer — `all` faqat admin panelda
  getFooter: (all = false) => request<FooterSection[]>(`/footer${all ? "?all=1" : ""}`),
  updateFooter: (sections: FooterSection[]) =>
    request<FooterSection[]>("/footer", { method: "PUT", body: JSON.stringify({ sections }) }),

  // Hamkorlik arizalari
  getPartnerRequests: () => request<PartnerRequest[]>("/partner-requests"),
  createPartnerRequest: (data: { name: string; phone: string; telegram?: string; message?: string }) =>
    request<{ id: string; success: boolean }>("/partner-requests", { method: "POST", body: JSON.stringify(data) }),
  updatePartnerRequestStatus: (id: string, status: string) =>
    request<{ id: string; status: string }>(`/partner-requests/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }),
  deletePartnerRequest: (id: string) =>
    request<{ success: boolean }>(`/partner-requests/${id}`, { method: "DELETE" }),

  // Media
  uploadImage,

  // Auth
  login: (email: string, password: string) =>
    request<{ token: string; admin: { id: string; email: string; name: string } }>("/auth", { method: "POST", body: JSON.stringify({ email, password }) }),

  // Seed
  seed: () => request<{ success: boolean }>("/seed", { method: "POST" }),
};

// Types matching the API responses
export interface Product {
  id: string;
  slug: string;
  name: string;
  color: string;
  price: string;
  priceNum: number;
  oldPrice: string;
  oldPriceNum?: number;
  discount: number;
  tag: string;
  colors: { name: string; hex: string }[];
  specs: { k: string; v: string }[];
  image: string;
  images: string[];
  description: string;
  stock: number;
  /** Admin panelidagi "sotuvda mavjud" belgisi. */
  available: boolean;
  /** Mijoz sotib ola oladimi — available va zaxira birgalikda. */
  inStock: boolean;
  categoryId: string;
  category: string;
  categorySlug: string;
  createdAt: string;
}

export interface OrderItemInput {
  name: string;
  qty: number;
  price: number;
  productId?: string;
}

export interface Order {
  id: string;
  customer: string;
  phone: string;
  address: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  status: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  order: number;
  visible: boolean;
  productCount?: number;
}

export type CategoryInput = { name: string; slug?: string; order?: number; visible?: boolean };

export interface SiteSettings {
  id: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDiscount: string;
  heroImage: string;
  heroCtaText: string;
  heroCtaLink: string;
  featuredTitle: string;
  freeDeliveryMin: number;
  contactPhone: string;
  telegram: string;
  instagram: string;
  address: string;
  workHours: string;
  footerAbout: string;
}

export interface FooterLink {
  id?: string;
  label: string;
  url: string;
  order?: number;
  visible?: boolean;
}

export interface FooterSection {
  id?: string;
  title: string;
  order?: number;
  visible?: boolean;
  links: FooterLink[];
}

export interface PartnerRequest {
  id: string;
  name: string;
  phone: string;
  telegram: string;
  message: string;
  status: string;
  createdAt: string;
}

export interface UploadedMedia {
  id: string;
  url: string;
  mimeType: string;
  size: number;
}

export interface PaymentSettingsType {
  id: string;
  cardNumber: string;
  cardOwner: string;
  telegramUsername: string;
}
