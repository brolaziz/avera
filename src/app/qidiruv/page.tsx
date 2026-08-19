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
    ? products.filter((p) =>
        [p.name, p.description, p.category, p.color]
          .some((field) => (field || "").toLowerCase().includes(q))
      )
    : [];

  return (
    <section style={{ marginTop: 16 }}>
      <div className="panel fade-up" style={{ marginBottom: 16 }}>
        <div
          style={{
            display: "flex", alignItems: "center", gap: 12,
            background: "var(--bg-fill)",
            border: `1.5px solid ${query ? "var(--accent)" : "transparent"}`,
            borderRadius: 14, height: 54, padding: "0 18px",
            boxShadow: query ? "0 0 0 4px rgba(107,30,46,0.07)" : "none",
            transition: "border-color .2s, box-shadow .2s",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={query ? "var(--accent)" : "var(--text-faint)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              flex: 1, border: "none", background: "transparent", fontSize: 16,
              fontWeight: 500, outline: "none", color: "var(--ink)", fontFamily: "inherit", minWidth: 0,
            }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              style={{
                border: "none", background: "transparent", fontSize: 13.5,
                color: "var(--text-soft)", cursor: "pointer", padding: "4px 8px",
                whiteSpace: "nowrap", fontFamily: "inherit",
              }}
            >
              {t("search.clear")} &times;
            </button>
          )}
        </div>
      </div>

      {q.length > 0 && (
        <>
          <div className="section-header">
            <h1 style={{ wordBreak: "break-word", fontSize: "clamp(20px, 4.4vw, 28px)" }}>
              &laquo;{query}&raquo; {t("search.results")} {results.length} {t("search.result_count")}
            </h1>
          </div>

          {results.length > 0 ? (
            <div className="grid-products-4 fade-up">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} hideTag />
              ))}
            </div>
          ) : (
            <div className="empty-state fade-in">
              <div className="empty-title">{t("search.not_found")}</div>
              <div style={{ fontSize: 14.5 }}>{t("search.try_other")}</div>
            </div>
          )}
        </>
      )}

      {q.length === 0 && (
        <div className="empty-state fade-in">
          <div className="empty-title">{t("search.hint")}</div>
        </div>
      )}
    </section>
  );
}
