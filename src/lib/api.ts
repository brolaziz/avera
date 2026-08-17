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
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Server xatolik" }));
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

  // Categories
  getCategories: () => request<Category[]>("/categories"),
  createCategory: (data: { name: string; slug: string; order?: number }) =>
    request<Category>("/categories", { method: "POST", body: JSON.stringify(data) }),
  updateCategory: (id: string, data: { name: string; slug: string; order?: number }) =>
    request<Category>(`/categories/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteCategory: (id: string) => request<{ success: boolean }>(`/categories/${id}`, { method: "DELETE" }),

  // Settings
  getSettings: () => request<SiteSettings>("/settings"),
  updateSettings: (data: SiteSettings) => request<SiteSettings>("/settings", { method: "PUT", body: JSON.stringify(data) }),

  // Payment
  getPaymentSettings: () => request<PaymentSettingsType>("/payment-settings"),
  updatePaymentSettings: (data: PaymentSettingsType) =>
    request<PaymentSettingsType>("/payment-settings", { method: "PUT", body: JSON.stringify(data) }),

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
  tag: string;
  colors: { name: string; hex: string }[];
  specs: { k: string; v: string }[];
  image: string;
  description: string;
  stock: number;
  category: string;
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
}

export interface SiteSettings {
  id: string;
  heroTitle: string;
  heroDiscount: string;
  freeDeliveryMin: number;
  contactPhone: string;
  telegram: string;
  instagram: string;
}

export interface PaymentSettingsType {
  id: string;
  cardNumber: string;
  cardOwner: string;
  telegramUsername: string;
}
