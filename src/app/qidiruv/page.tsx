"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";

export default function QidiruvPage() {
  const { products } = useStore();
  const { t } = useI18n();
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const results = q.length > 0
    ? products.filter(p => {
        const name = (p.name || "").toLowerCase();
        const desc = (p.description || "").toLowerCase();
        const cat = (p.category || "").toLowerCase();
        const color = (p.color || "").toLowerCase();
        return name.includes(q) || desc.includes(q) || cat.includes(q) || color.includes(q);
      })
    : [];

  return (
    <section style={{ marginTop: 16 }}>
      {/* Search panel */}
      <div
        style={{
          background: "white",
          borderRadius: 22,
          padding: "20px",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "#F1F3F5",
            border: query ? "1.5px solid var(--accent)" : "1.5px solid transparent",
            borderRadius: 14,
            height: 54,
            padding: "0 18px",
            boxShadow: query ? "0 0 0 4px rgba(255,122,26,0.08)" : "none",
            transition: "border-color .2s, box-shadow .2s",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={query ? "var(--accent)" : "#94A3B8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("nav.search")}
            autoFocus
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              fontSize: 16,
              fontWeight: 500,
              outline: "none",
              color: "#0F172A",
            }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              style={{
                border: "none",
                background: "transparent",
                fontSize: 13.5,
                color: "#94A3B8",
                cursor: "pointer",
                padding: "4px 8px",
              }}
            >
              {t("search.clear")} &times;
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {q.length > 0 && (
        <>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
            <h1 style={{ fontSize: "clamp(16px, 4vw, 22px)", fontWeight: 700, margin: 0, wordBreak: "break-word" }}>
              &laquo;{query}&raquo; {t("search.results")} {results.length} {t("search.result_count")}
            </h1>
          </div>

          {results.length > 0 ? (
            <div className="grid-products-4">
              {results.map((product) => (
                <ProductCard key={product.slug} product={product} aspectRatio="1/1" addButtonStyle="icon" hideTag />
              ))}
            </div>
          ) : (
            <div style={{
              background: "white",
              borderRadius: 22,
              padding: "60px 30px",
              textAlign: "center",
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
                {t("search.not_found")}
              </div>
              <div style={{ fontSize: 14, color: "#94A3B8" }}>
                {t("search.try_other")}
              </div>
            </div>
          )}
        </>
      )}

      {/* Empty state when no query */}
      {q.length === 0 && (
        <div style={{
          background: "white",
          borderRadius: 22,
          padding: "60px 30px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🛍️</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: "#64748B" }}>
            {t("search.hint")}
          </div>
        </div>
      )}
    </section>
  );
}
