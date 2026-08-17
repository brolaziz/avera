"use client";

import Link from "next/link";
import { type Product } from "@/lib/data";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";

interface ProductCardProps {
  product: Product;
  aspectRatio?: string;
  addButtonStyle?: "icon" | "text";
  hideTag?: boolean;
}

export default function ProductCard({ product, aspectRatio = "1/1", addButtonStyle = "icon", hideTag = false }: ProductCardProps) {
  const { addToCart, lastAdded } = useStore();
  const { t } = useI18n();
  const isAdded = lastAdded === product.slug;

  return (
    <article
      className="product-card"
      style={{ background: "#fff", borderRadius: 20, padding: 14 }}
    >
      <Link href={`/mahsulot/${product.slug}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
        <div style={{ position: "relative", aspectRatio, background: "#F1F3F5", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, overflow: "hidden" }}>
          {product.image ? (
            <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ font: "11px ui-monospace, monospace", color: "#94A3B8" }}>mahsulot surati</span>
          )}
          {!hideTag && product.tag && (
            <div style={{ position: "absolute", left: 10, top: 10, background: "var(--accent)", color: "#fff", fontSize: 11, fontWeight: 600, padding: "5px 9px", borderRadius: 8 }}>
              {product.tag}
            </div>
          )}
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 3 }}>{product.name}</div>
        <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 10 }}>{product.color}</div>
      </Link>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 16, fontWeight: 700 }}>{product.price}</span>
          {product.oldPrice && (
            <span style={{ fontSize: 12.5, color: "#CBD5E1", textDecoration: "line-through" }}>{product.oldPrice}</span>
          )}
        </div>
        {addButtonStyle === "icon" ? (
          <button
            onClick={(e) => { e.stopPropagation(); addToCart(product, product.color, 1); }}
            className="btn-add"
            style={{
              width: 38,
              height: 38,
              border: "none",
              borderRadius: 11,
              background: isAdded ? "var(--accent)" : "#F1F3F5",
              color: isAdded ? "#fff" : "#0F172A",
              fontSize: 18,
              fontWeight: 600,
              cursor: "pointer",
              lineHeight: 1,
              transition: "background .3s, color .3s",
            }}
          >
            {isAdded ? "✓" : "+"}
          </button>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); addToCart(product, product.color, 1); }}
            className="btn-add"
            style={{
              height: 38,
              padding: "0 14px",
              border: "none",
              borderRadius: 11,
              background: isAdded ? "var(--accent)" : "#F1F3F5",
              color: isAdded ? "#fff" : "#0F172A",
              fontSize: 13.5,
              fontWeight: 600,
              cursor: "pointer",
              transition: "background .3s, color .3s",
            }}
          >
            {isAdded ? `✓ ${t("products.added")}` : t("products.add")}
          </button>
        )}
      </div>
    </article>
  );
}
