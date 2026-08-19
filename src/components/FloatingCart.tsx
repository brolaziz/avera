"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore, formatPrice } from "@/lib/store";
import { useI18n } from "@/lib/i18n";

/** Sahifa bo'ylab scroll qilinganda ham ko'rinib turadigan savatcha. */
export function FloatingCart() {
  const { cartCount, cartTotal } = useStore();
  const { t } = useI18n();
  const pathname = usePathname();

  // Savat va to'lov sahifalarida ortiqcha — u yerda savat allaqachon ko'rinib turadi.
  const hidden = pathname === "/savat" || pathname === "/checkout";
  const isEmpty = cartCount === 0;

  useEffect(() => {
    document.body.classList.toggle("has-floating-cart", !hidden);
    return () => document.body.classList.remove("has-floating-cart");
  }, [hidden]);

  if (hidden) return null;

  if (isEmpty) {
    return (
      <Link
        href="/savat"
        className="floating-cart"
        aria-label={`${t("nav.cart")} — 0`}
        style={{ width: 56, padding: 0, justifyContent: "center", borderRadius: 999, left: "auto", right: 22, bottom: 22 }}
      >
        <CartIcon />
        <span className="fc-count" style={{ left: 34 }}>0</span>
      </Link>
    );
  }

  return (
    <Link href="/savat" className="floating-cart" aria-label={t("cart.checkout")}>
      <span style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <CartIcon />
        <span className="fc-count" style={{ left: 14 }}>{cartCount}</span>
      </span>
      <span style={{ minWidth: 0 }}>
        <span className="fc-label">{t("nav.cart")}</span>
        <span className="fc-total">{formatPrice(cartTotal)} {t("common.sum")}</span>
      </span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginLeft: "auto" }}>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </Link>
  );
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
