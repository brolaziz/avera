"use client";

import Link from "next/link";
import { type Product } from "@/lib/api";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";

interface ProductCardProps {
  product: Product;
  /** Rasm nisbati — kartalar katta va bir xil balandlikda ko'rinishi uchun. */
  aspectRatio?: string;
  hideTag?: boolean;
  /** Ro'yxatdagi birinchi kartalar uchun — rasm darhol yuklanadi. */
  priority?: boolean;
}

export default function ProductCard({
  product,
  aspectRatio = "3/4",
  hideTag = false,
  priority = false,
}: ProductCardProps) {
  const { addToCart, lastAdded } = useStore();
  const { t } = useI18n();
  const isAdded = lastAdded === product.slug;
  const badge = product.discount > 0 ? `-${product.discount}%` : product.tag;

  return (
    <article className="product-card">
      <Link href={`/mahsulot/${product.slug}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
        <div className="product-media" style={{ aspectRatio }}>
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              loading={priority ? "eager" : "lazy"}
              decoding={priority ? "sync" : "async"}
              fetchPriority={priority ? "high" : "auto"}
            />
          ) : (
            <BagPlaceholder />
          )}

          {!hideTag && badge && (
            <span
              style={{
                position: "absolute",
                left: 10,
                top: 10,
                background: product.discount > 0 ? "var(--accent)" : "var(--gold)",
                color: product.discount > 0 ? "#fff" : "var(--ink)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.02em",
                padding: "5px 9px",
                borderRadius: 7,
              }}
            >
              {badge}
            </span>
          )}

          {!product.inStock && (
            <span
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(250, 246, 240, 0.72)",
                color: "var(--ink)",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {t("products.out_of_stock")}
            </span>
          )}
        </div>

        <h3 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 4px", lineHeight: 1.3 }}>
          {product.name}
        </h3>

        <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          <span style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--font-sans), sans-serif" }}>
            {product.price}
          </span>
          {product.oldPrice && (
            <span style={{ fontSize: 13, color: "var(--text-faint)", textDecoration: "line-through" }}>
              {product.oldPrice}
            </span>
          )}
        </div>
      </Link>

      <div className="card-footer" style={{ display: "flex", alignItems: "center" }}>
        {product.inStock ? (
          <button
            onClick={(e) => { e.stopPropagation(); addToCart(product, product.color, 1); }}
            className="btn-add"
            style={{
              width: "100%",
              height: 44,
              border: "none",
              borderRadius: 11,
              background: isAdded ? "var(--accent)" : "var(--bg-fill)",
              color: isAdded ? "#fff" : "var(--ink)",
              fontSize: 13.5,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {isAdded ? `✓ ${t("products.added")}` : t("product.add_cart")}
          </button>
        ) : (
          <span
            style={{
              width: "100%",
              height: 44,
              borderRadius: 11,
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--text-soft)",
              fontSize: 13.5,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {t("products.out_of_stock")}
          </span>
        )}
      </div>
    </article>
  );
}

/** Rasm bo'lmasa — matnli "placeholder" emas, sokin belgi. */
function BagPlaceholder() {
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--text-faintest)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 7h12l1 13H5L6 7Z" />
        <path d="M9 7V5.5a3 3 0 0 1 6 0V7" />
      </svg>
    </div>
  );
}
