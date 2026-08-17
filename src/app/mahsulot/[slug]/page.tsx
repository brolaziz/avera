"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { products, addToCart, lastAdded } = useStore();
  const { t } = useI18n();
  const product = products.find((p) => p.slug === slug);
  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);

  if (!product) {
    return (
      <div style={{ marginTop: 40, textAlign: "center", fontSize: 18, color: "#64748B" }}>
        {t("products.not_found")} <Link href="/katalog" style={{ color: "var(--accent)" }}>{t("products.back_catalog")}</Link>
      </div>
    );
  }

  const discountTag = product.tag.startsWith("-") ? product.tag : null;
  const isAdded = lastAdded === product.slug;

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ fontSize: "clamp(12px, 3.5vw, 13.5px)", color: "#94A3B8", margin: "14px 0 12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        <Link href="/" style={{ color: "#94A3B8", textDecoration: "none" }}>{t("product.home")}</Link>
        {" / "}
        <Link href="/katalog" style={{ color: "#94A3B8", textDecoration: "none" }}>{t("nav.catalog")}</Link>
        {" / "}
        <span style={{ color: "#0F172A", fontWeight: 600 }}>{product.name}</span>
      </div>

      {/* Main Grid */}
      <section className="grid-product-detail">
        {/* Gallery */}
        <div className="grid-gallery">
          <div className="thumbs-col" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  aspectRatio: "1/1",
                  background: "#fff",
                  border: `1.5px solid ${i === 0 ? "var(--accent)" : "#E2E8F0"}`,
                  borderRadius: 12,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  font: "10px ui-monospace, monospace", color: "#94A3B8", cursor: "pointer",
                }}
              >
                {i + 1}
              </div>
            ))}
          </div>
          <div style={{ aspectRatio: "1/1", background: "#fff", borderRadius: 22, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(115deg, #F1F3F5 0 8px, #FFFFFF 8px 16px)" }} />
            <span style={{ position: "relative", font: "12px ui-monospace, monospace", color: "#94A3B8", background: "#fff", padding: "8px 14px", borderRadius: 6 }}>asosiy mahsulot surati</span>
          </div>
        </div>

        {/* Info Panel */}
        <div className="product-info-panel" style={{ background: "#fff", borderRadius: 22, padding: 28 }}>
          {/* Badge */}
          {product.tag === "Yangi" && (
            <div style={{ marginBottom: 14 }}>
              <span style={{ background: "var(--accent-tint)", color: "var(--accent)", fontSize: 11.5, fontWeight: 600, padding: "5px 10px", borderRadius: 8 }}>{t("product.new")}</span>
            </div>
          )}

          {/* Title */}
          <h1 style={{ margin: "0 0 8px", fontSize: "clamp(22px, 5vw, 32px)", fontWeight: 700, wordBreak: "break-word" }}>{product.name}</h1>

          {/* Description */}
          <p style={{ margin: "0 0 22px", fontSize: 15, lineHeight: 1.65, color: "#64748B" }}>
            {product.description}
          </p>

          {/* Price */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 26, flexWrap: "wrap" }}>
            <span style={{ fontSize: "clamp(24px, 5vw, 30px)", fontWeight: 700 }}>{product.price}</span>
            {product.oldPrice && <span style={{ fontSize: 16, color: "#CBD5E1", textDecoration: "line-through" }}>{product.oldPrice}</span>}
            {discountTag && (
              <span style={{ background: "#0F172A", color: "#fff", fontSize: 12, fontWeight: 600, padding: "5px 9px", borderRadius: 8 }}>{discountTag}</span>
            )}
          </div>

          {/* Color selector */}
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 10 }}>{t("product.color")}</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
            {product.colors.map((c, i) => (
              <div
                key={c.name}
                onClick={() => setSelectedColor(i)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 12px",
                  border: `1.5px solid ${selectedColor === i ? "var(--accent)" : "#E2E8F0"}`,
                  borderRadius: 12, fontSize: 13, fontWeight: 500, cursor: "pointer",
                  background: selectedColor === i ? "var(--accent-tint)" : "transparent",
                }}
              >
                <span style={{ width: 16, height: 16, borderRadius: 5, background: c.hex, border: "1px solid rgba(15,23,42,0.08)", flexShrink: 0 }} />
                {c.name}
              </div>
            ))}
          </div>

          {/* Action row */}
          <div style={{ display: "flex", gap: 12, marginBottom: 22, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 2, border: "1px solid #E2E8F0", borderRadius: 13, height: 50, padding: "0 6px", flexShrink: 0 }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 36, height: 36, border: "none", background: "transparent", fontSize: 18, fontWeight: 600, cursor: "pointer", borderRadius: 10 }}>&#8722;</button>
              <span style={{ minWidth: 28, textAlign: "center", fontSize: 15, fontWeight: 600 }}>{qty}</span>
              <button onClick={() => setQty(qty + 1)} style={{ width: 36, height: 36, border: "none", background: "transparent", fontSize: 18, fontWeight: 600, cursor: "pointer", borderRadius: 10 }}>+</button>
            </div>
            <button
              onClick={() => addToCart(product, product.colors[selectedColor].name, qty)}
              className="btn-accent"
              style={{
                flex: 1, minWidth: 0, height: 50, border: "none",
                background: isAdded ? "#10B981" : "var(--accent)",
                color: "#fff", borderRadius: 13, fontSize: 15, fontWeight: 600, cursor: "pointer",
                transition: "background .3s",
              }}
            >
              {isAdded ? `✓ ${t("product.added_cart")}` : t("product.add_cart")}
            </button>
          </div>

          {/* Specs table */}
          <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "#F1F3F5", borderRadius: 14, overflow: "hidden" }}>
            {product.specs.map((s) => (
              <div key={s.k} style={{ display: "flex", justifyContent: "space-between", background: "#fff", padding: "13px 16px", fontSize: 14, gap: 12 }}>
                <span style={{ color: "#94A3B8", flexShrink: 0 }}>{s.k}</span>
                <span style={{ fontWeight: 600, textAlign: "right", wordBreak: "break-word" }}>{s.v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
