"use client";

import { useStore, formatPrice } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import Link from "next/link";

export default function SavatPage() {
  const { cart, cartCount, cartTotal, removeFromCart, updateQty } = useStore();
  const { t } = useI18n();

  if (cart.length === 0) {
    return (
      <section style={{ marginTop: 16, textAlign: "center", padding: "80px 20px" }}>
        <p style={{ fontSize: 24, fontWeight: 700 }}>
          {t("cart.empty")}
        </p>
        <Link
          href="/katalog"
          style={{
            display: "inline-block",
            marginTop: 20,
            height: 48,
            lineHeight: "48px",
            padding: "0 22px",
            background: "var(--accent)",
            color: "white",
            borderRadius: 14,
            fontWeight: 600,
            fontSize: 15,
            textDecoration: "none",
          }}
        >
          {t("cart.go_catalog")}
        </Link>
      </section>
    );
  }

  return (
    <section className="grid-cart">
      {/* Left — Items panel */}
      <div
        style={{
          background: "white",
          borderRadius: 22,
          padding: "clamp(14px, 4vw, 24px)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: 22,
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
            {t("cart.title")}
          </h1>
          <span style={{ fontSize: 14, color: "#94A3B8" }}>
            {cartCount} {t("cart.items")}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {cart.map((item, index) => (
            <div
              key={index}
              className="cart-item"
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 12,
                  background: "#F1F3F5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontFamily: "monospace",
                  color: "#94A3B8",
                  flexShrink: 0,
                }}
              >
                rasm
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {item.product.name}
                </div>
                <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 2 }}>
                  {item.color}
                </div>
              </div>

              <div
                className="cart-item-actions"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  flexShrink: 0,
                }}
              >
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  border: "1px solid #E2E8F0",
                  borderRadius: 11,
                  height: 38,
                  padding: "0 4px",
                }}>
                  <button
                    onClick={() => updateQty(index, item.qty - 1)}
                    style={{
                      width: 28, height: 28, borderRadius: 8, border: "none",
                      background: "transparent", fontSize: 16, fontWeight: 600, cursor: "pointer",
                    }}
                  >
                    &#8722;
                  </button>
                  <span style={{ minWidth: 22, textAlign: "center", fontWeight: 600, fontSize: 14 }}>
                    {item.qty}
                  </span>
                  <button
                    onClick={() => updateQty(index, item.qty + 1)}
                    style={{
                      width: 28, height: 28, borderRadius: 8, border: "none",
                      background: "transparent", fontSize: 16, fontWeight: 600, cursor: "pointer",
                    }}
                  >
                    +
                  </button>
                </div>

                <div className="cart-item-price" style={{ fontWeight: 700, fontSize: 15, minWidth: 90, textAlign: "right" }}>
                  {formatPrice(item.product.priceNum * item.qty)}
                </div>

                <button
                  onClick={() => removeFromCart(index)}
                  style={{
                    width: 34, height: 34, background: "#F1F3F5", borderRadius: 10,
                    border: "none", color: "#94A3B8", fontSize: 15, cursor: "pointer",
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

      {/* Right — Summary panel */}
      <div
        className="cart-summary-panel"
        style={{
          background: "white",
          borderRadius: 22,
          padding: "clamp(16px, 4vw, 24px)",
          position: "sticky",
          top: 80,
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, marginBottom: 18 }}>
          {t("cart.summary")}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14.5, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>{t("cart.products")}</span>
            <span style={{ fontWeight: 600 }}>{formatPrice(cartTotal)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>{t("cart.delivery")}</span>
            <span style={{ fontWeight: 600 }}>{t("cart.free")}</span>
          </div>
        </div>

        <div style={{ height: 1, background: "#E2E8F0", marginBottom: 16 }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontSize: 15, fontWeight: 600 }}>{t("cart.total")}</span>
          <span style={{ fontSize: 22, fontWeight: 700 }}>
            {formatPrice(cartTotal)}
          </span>
        </div>

        <Link
          href="/checkout"
          className="btn-accent"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: "100%", height: 52, background: "var(--accent)", color: "white",
            borderRadius: 14, fontWeight: 600, fontSize: 15, textDecoration: "none",
          }}
        >
          {t("cart.checkout")}
        </Link>

        <Link
          href="/katalog"
          className="btn-outline"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: "100%", height: 48, border: "1px solid #E2E8F0", background: "white",
            borderRadius: 13, fontWeight: 600, fontSize: 14, color: "#64748B",
            textDecoration: "none", marginTop: 10,
          }}
        >
          {t("cart.continue")}
        </Link>
      </div>
    </section>
  );
}
