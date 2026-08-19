"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { products, productsLoading, addToCart, lastAdded } = useStore();
  const { t } = useI18n();
  const product = products.find((p) => p.slug === slug);
  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);
  const [activeImage, setActiveImage] = useState(0);

  if (productsLoading) {
    return (
      <div style={{ marginTop: 48, textAlign: "center", fontSize: 15, color: "var(--text-muted)" }}>
        {t("common.loading")}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="empty-state" style={{ marginTop: 24 }}>
        <div className="empty-title">{t("products.not_found")}</div>
        <Link href="/katalog" style={{ color: "var(--accent)", fontWeight: 600 }}>
          {t("products.back_catalog")}
        </Link>
      </div>
    );
  }

  const isAdded = lastAdded === product.slug;
  const images = product.images.length > 0 ? product.images : [];
  const mainImage = images[activeImage] || images[0] || "";
  const colorName = product.colors[selectedColor]?.name || product.color;

  return (
    <div>
      <nav
        className="text-ellipsis"
        style={{ fontSize: "clamp(12px, 3.5vw, 13.5px)", color: "var(--text-soft)", margin: "14px 0 12px" }}
      >
        <Link href="/" style={{ color: "inherit" }}>{t("product.home")}</Link>
        {" / "}
        <Link href="/katalog" style={{ color: "inherit" }}>{t("nav.catalog")}</Link>
        {" / "}
        <span style={{ color: "var(--ink)", fontWeight: 600 }}>{product.name}</span>
      </nav>

      <section className="grid-product-detail fade-up">
        {/* Galereya */}
        <div className={images.length > 1 ? "grid-gallery" : ""}>
          {images.length > 1 && (
            <div className="thumbs-col" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {images.map((src, i) => (
                <div
                  key={src + i}
                  onClick={() => setActiveImage(i)}
                  style={{
                    aspectRatio: "1/1",
                    background: "var(--bg-fill)",
                    border: `1.5px solid ${i === activeImage ? "var(--accent)" : "var(--border)"}`,
                    borderRadius: 12,
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={src}
                    alt={`${product.name} — ${i + 1}-rasm`}
                    loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>
          )}

          <div
            style={{
              aspectRatio: "1/1",
              background: "var(--bg-surface)",
              border: "1px solid var(--border-soft)",
              borderRadius: 22,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {mainImage ? (
              <img src={mainImage} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--text-faintest)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 7h12l1 13H5L6 7Z" />
                <path d="M9 7V5.5a3 3 0 0 1 6 0V7" />
              </svg>
            )}
          </div>
        </div>

        {/* Ma'lumot paneli */}
        <div
          className="product-info-panel"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border-soft)", borderRadius: 22, padding: 28 }}
        >
          {product.tag && (
            <div style={{ marginBottom: 14 }}>
              <span style={{ background: "var(--gold-wash)", color: "var(--ink-600)", fontSize: 11.5, fontWeight: 600, padding: "5px 10px", borderRadius: 8, border: "1px solid var(--gold-soft)" }}>
                {product.tag}
              </span>
            </div>
          )}

          <h1 style={{ margin: "0 0 8px", fontSize: "clamp(22px, 5vw, 32px)", fontWeight: 700, wordBreak: "break-word", letterSpacing: "-0.015em" }}>
            {product.name}
          </h1>

          {product.description && (
            <p style={{ margin: "0 0 22px", fontSize: 15, lineHeight: 1.65, color: "var(--text-muted)" }}>
              {product.description}
            </p>
          )}

          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 26, flexWrap: "wrap" }}>
            <span style={{ fontSize: "clamp(24px, 5vw, 30px)", fontWeight: 700 }}>
              {product.price} <span style={{ fontSize: "0.55em", fontWeight: 600, color: "var(--text-muted)" }}>{t("common.sum")}</span>
            </span>
            {product.oldPrice && (
              <span style={{ fontSize: 16, color: "var(--text-faint)", textDecoration: "line-through" }}>{product.oldPrice}</span>
            )}
            {product.discount > 0 && (
              <span style={{ background: "var(--accent)", color: "#fff", fontSize: 12, fontWeight: 700, padding: "5px 9px", borderRadius: 8 }}>
                -{product.discount}%
              </span>
            )}
          </div>

          {product.colors.length > 0 && (
            <>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-faint)", marginBottom: 10 }}>
                {t("product.color")}
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
                {product.colors.map((c, i) => (
                  <button
                    key={c.name + i}
                    onClick={() => setSelectedColor(i)}
                    style={{
                      display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
                      border: `1.5px solid ${selectedColor === i ? "var(--accent)" : "var(--border)"}`,
                      borderRadius: 12, fontSize: 13, fontWeight: 500, cursor: "pointer",
                      background: selectedColor === i ? "var(--accent-tint)" : "transparent",
                      color: "var(--ink)", fontFamily: "inherit",
                    }}
                  >
                    <span style={{ width: 16, height: 16, borderRadius: 5, background: c.hex, border: "1px solid rgba(42,33,29,0.12)", flexShrink: 0 }} />
                    {c.name}
                  </button>
                ))}
              </div>
            </>
          )}

          {product.inStock ? (
            <div style={{ display: "flex", gap: 12, marginBottom: 22, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 2, border: "1px solid var(--border)", borderRadius: 13, height: 50, padding: "0 6px", flexShrink: 0 }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} style={qtyBtn}>&#8722;</button>
                <span style={{ minWidth: 28, textAlign: "center", fontSize: 15, fontWeight: 600 }}>{qty}</span>
                <button onClick={() => setQty(qty + 1)} style={qtyBtn}>+</button>
              </div>
              <button
                onClick={() => addToCart(product, colorName, qty)}
                className="btn-accent"
                style={{
                  flex: 1, minWidth: 0, height: 50, border: "none",
                  background: isAdded ? "var(--success)" : "var(--accent)",
                  color: "#fff", borderRadius: 13, fontSize: 15, fontWeight: 600, cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {isAdded ? `✓ ${t("product.added_cart")}` : t("product.add_cart")}
              </button>
            </div>
          ) : (
            <div
              style={{
                marginBottom: 22, padding: "14px 16px", borderRadius: 13,
                background: "var(--bg-fill)", color: "var(--text-muted)", fontSize: 14.5, fontWeight: 500,
              }}
            >
              {t("product.unavailable")}
            </div>
          )}

          {product.specs.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "var(--border-soft)", borderRadius: 14, overflow: "hidden" }}>
              {product.specs.map((s, i) => (
                <div key={s.k + i} style={{ display: "flex", justifyContent: "space-between", background: "var(--bg-surface)", padding: "13px 16px", fontSize: 14, gap: 12 }}>
                  <span style={{ color: "var(--text-soft)", flexShrink: 0 }}>{s.k}</span>
                  <span style={{ fontWeight: 600, textAlign: "right", wordBreak: "break-word" }}>{s.v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

const qtyBtn: React.CSSProperties = {
  width: 36, height: 36, border: "none", background: "transparent",
  fontSize: 18, fontWeight: 600, cursor: "pointer", borderRadius: 10, color: "var(--ink)",
};
