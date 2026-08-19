"use client";

import Link from "next/link";
import { useStore, formatPrice } from "@/lib/store";
import { useI18n } from "@/lib/i18n";

export default function SavatPage() {
  const { cart, cartCount, cartTotal, removeFromCart, updateQty } = useStore();
  const { t } = useI18n();

  if (cart.length === 0) {
    return (
      <div className="empty-state fade-in" style={{ marginTop: 16 }}>
        <div className="empty-title">{t("cart.empty")}</div>
        <Link
          href="/katalog"
          className="btn-accent"
          style={{
            display: "inline-flex", alignItems: "center", marginTop: 18, height: 48, padding: "0 22px",
            background: "var(--accent)", color: "#fff", borderRadius: 12, fontWeight: 600, fontSize: 15,
          }}
        >
          {t("cart.go_catalog")}
        </Link>
      </div>
    );
  }

  return (
    <section className="grid-cart fade-up">
      {/* Mahsulotlar */}
      <div className="panel">
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 8 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: "-0.015em" }}>{t("cart.title")}</h1>
          <span style={{ fontSize: 14, color: "var(--text-soft)" }}>
            {cartCount} {t("cart.items")}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {cart.map((item, index) => (
            <div key={`${item.product.slug}-${item.color}-${index}`} className="cart-item">
              <Link
                href={`/mahsulot/${item.product.slug}`}
                style={{
                  width: 72, height: 72, borderRadius: 12, background: "var(--bg-fill)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, overflow: "hidden",
                }}
              >
                {item.product.image ? (
                  <img src={item.product.image} alt={item.product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-faintest)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 7h12l1 13H5L6 7Z" />
                    <path d="M9 7V5.5a3 3 0 0 1 6 0V7" />
                  </svg>
                )}
              </Link>

              <div style={{ flex: 1, minWidth: 0 }}>
                <Link href={`/mahsulot/${item.product.slug}`} className="text-ellipsis" style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>
                  {item.product.name}
                </Link>
                {item.color && (
                  <div style={{ fontSize: 13, color: "var(--text-soft)", marginTop: 2 }}>{item.color}</div>
                )}
              </div>

              <div className="cart-item-actions" style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 2, border: "1px solid var(--border)", borderRadius: 11, height: 38, padding: "0 4px" }}>
                  <button onClick={() => updateQty(index, item.qty - 1)} style={qtyBtn} aria-label="-">&#8722;</button>
                  <span style={{ minWidth: 22, textAlign: "center", fontWeight: 600, fontSize: 14 }}>{item.qty}</span>
                  <button onClick={() => updateQty(index, item.qty + 1)} style={qtyBtn} aria-label="+">+</button>
                </div>

                <div className="cart-item-price" style={{ fontWeight: 700, fontSize: 15, minWidth: 90, textAlign: "right" }}>
                  {formatPrice(item.product.priceNum * item.qty)}
                </div>

                <button
                  onClick={() => removeFromCart(index)}
                  aria-label="×"
                  style={{
                    width: 34, height: 34, background: "var(--bg-fill)", borderRadius: 10,
                    border: "none", color: "var(--text-soft)", fontSize: 15, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}
                >
                  &times;
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Xulosa */}
      <div className="panel" style={{ position: "sticky", top: 80 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 18px" }}>{t("cart.summary")}</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14.5, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "var(--text-muted)" }}>{t("cart.products")}</span>
            <span style={{ fontWeight: 600 }}>{formatPrice(cartTotal)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "var(--text-muted)" }}>{t("cart.delivery")}</span>
            <span style={{ fontWeight: 600 }}>{t("cart.free")}</span>
          </div>
        </div>

        <div style={{ height: 1, background: "var(--border-soft)", marginBottom: 16 }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontSize: 15, fontWeight: 600 }}>{t("cart.total")}</span>
          <span style={{ fontSize: 22, fontWeight: 700 }}>
            {formatPrice(cartTotal)} <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-muted)" }}>{t("common.sum")}</span>
          </span>
        </div>

        <Link
          href="/checkout"
          className="btn-accent"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: 52,
            background: "var(--accent)", color: "#fff", borderRadius: 13, fontWeight: 600, fontSize: 15,
          }}
        >
          {t("cart.checkout")}
        </Link>

        <Link
          href="/katalog"
          className="btn-outline"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: 48,
            border: "1px solid var(--border)", background: "var(--bg-surface)", borderRadius: 12,
            fontWeight: 600, fontSize: 14, color: "var(--text-muted)", marginTop: 10,
          }}
        >
          {t("cart.continue")}
        </Link>
      </div>
    </section>
  );
}

const qtyBtn: React.CSSProperties = {
  width: 28, height: 28, borderRadius: 8, border: "none",
  background: "transparent", fontSize: 16, fontWeight: 600, cursor: "pointer", color: "var(--ink)",
};
