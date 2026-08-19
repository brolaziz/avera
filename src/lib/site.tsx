"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, type SiteSettings, type FooterSection, type Category } from "./api";

/**
 * Mijoz sayti ko'radigan barcha boshqariladigan kontent shu yerdan keladi.
 * Hech qanday matn, telefon yoki menyu frontendda hardcode qilinmaydi —
 * boshlang'ich qiymatlar faqat API javob bermaguncha bo'sh o'rin tutadi.
 */
const emptySettings: SiteSettings = {
  id: "default",
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
};

interface SiteContextType {
  settings: SiteSettings;
  footer: FooterSection[];
  categories: Category[];
  loading: boolean;
  reload: () => void;
}

const SiteContext = createContext<SiteContextType | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(emptySettings);
  const [footer, setFooter] = useState<FooterSection[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    Promise.allSettled([api.getSettings(), api.getFooter(), api.getCategories()]).then(
      ([settingsRes, footerRes, categoriesRes]) => {
        if (cancelled) return;
        if (settingsRes.status === "fulfilled") setSettings({ ...emptySettings, ...settingsRes.value });
        if (footerRes.status === "fulfilled") setFooter(footerRes.value);
        if (categoriesRes.status === "fulfilled") setCategories(categoriesRes.value);
        setLoading(false);
      }
    );

    return () => {
      cancelled = true;
    };
  }, [tick]);

  return (
    <SiteContext.Provider value={{ settings, footer, categories, loading, reload: () => setTick((t) => t + 1) }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be inside SiteProvider");
  return ctx;
}

/** Telefon raqamidan tel: havolasi yasaydi. */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** "#" yoki bo'sh havola — bosiladigan link emas. */
export function isRealLink(url: string | undefined): boolean {
  return !!url && url !== "#";
}
