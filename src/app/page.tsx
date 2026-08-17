"use client";

import ProductCard from "@/components/ProductCard";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import Link from "next/link";

export default function HomePage() {
  const { products } = useStore();
  const { t } = useI18n();

  const perks = [
    { title: t("perks.delivery"), sub: t("perks.delivery_sub") },
    { title: t("perks.return"), sub: t("perks.return_sub") },
    { title: t("perks.original"), sub: t("perks.original_sub") },
  ];

  return (
    <div>
      {/* Hero Row */}
      <section className="grid-hero">
        {/* Left dark panel */}
        <div
          className="hero-panel"
          style={{ position: "relative", background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", borderRadius: 24, display: "flex", flexDirection: "column", justifyContent: "flex-end", overflow: "hidden" }}
        >
          <div style={{ position: "absolute", right: 0, top: 0, width: "60%", maxWidth: 460, height: "100%", background: "repeating-linear-gradient(115deg, #1E293B 0 6px, #0F172A 6px 12px)", opacity: 0.5 }} />

          <div style={{ position: "relative", display: "inline-flex", alignSelf: "flex-start", background: "rgba(255,122,26,0.15)", color: "var(--accent-light)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", padding: "7px 13px", borderRadius: 999, marginBottom: 20 }}>
            {t("hero.badge")}
          </div>
          <h1 className="hero-title">
            {t("hero.title")} <span style={{ color: "var(--accent)" }}>30% {t("hero.discount")}</span>
          </h1>
          <p style={{ position: "relative", margin: "0 0 26px", fontSize: "clamp(13px, 3.5vw, 15px)", lineHeight: 1.6, color: "#94A3B8", maxWidth: 400 }}>
            {t("hero.desc")}
          </p>
          <div style={{ position: "relative", display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/katalog" style={{ height: 44, padding: "0 20px", border: "none", background: "var(--accent)", color: "#fff", borderRadius: 14, fontSize: "clamp(13px, 3.5vw, 15px)", fontWeight: 600, display: "flex", alignItems: "center", textDecoration: "none" }}>
              {t("hero.shop")}
            </Link>
            <Link href="/katalog" style={{ height: 44, padding: "0 18px", border: "1px solid #334155", background: "transparent", color: "#fff", borderRadius: 14, fontSize: "clamp(13px, 3.5vw, 15px)", fontWeight: 600, display: "flex", alignItems: "center", textDecoration: "none" }}>
              {t("hero.catalog")}
            </Link>
          </div>
        </div>

        {/* Right column — new arrivals card */}
        <div style={{ background: "#fff", borderRadius: 24, padding: "clamp(16px, 4vw, 24px)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: "clamp(18px, 4vw, 22px)", fontWeight: 700, marginBottom: 6 }}>{t("hero.new")}</div>
            <div style={{ fontSize: "clamp(13px, 3vw, 14.5px)", color: "#64748B", lineHeight: 1.55 }}>{t("hero.new_desc")}</div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <div style={{ flex: 1, height: 92, borderRadius: 14, background: "#F1F3F5", display: "flex", alignItems: "center", justifyContent: "center", font: "11px ui-monospace, monospace", color: "#94A3B8" }}>rasm</div>
            <div style={{ flex: 1, height: 92, borderRadius: 14, background: "#F1F3F5", display: "flex", alignItems: "center", justifyContent: "center", font: "11px ui-monospace, monospace", color: "#94A3B8" }}>rasm</div>
            <Link href="/katalog" style={{ flex: 1, height: 92, borderRadius: 14, background: "var(--accent-tint)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: "var(--accent)", textDecoration: "none" }}>+22</Link>
          </div>
        </div>
      </section>

      {/* Perks Row */}
      <section className="grid-perks">
        {perks.map((perk) => (
          <div
            key={perk.title}
            style={{ background: "#fff", borderRadius: 18, padding: "18px 20px", display: "flex", gap: 14, alignItems: "flex-start" }}
          >
            <span style={{ width: 10, height: 10, borderRadius: 3, background: "var(--accent)", marginTop: 5, flex: "0 0 auto" }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{perk.title}</div>
              <div style={{ fontSize: 13.5, color: "#94A3B8", lineHeight: 1.5 }}>{perk.sub}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Popular Products */}
      <section style={{ marginTop: "clamp(24px, 6vw, 44px)" }}>
        <div className="section-header">
          <h2 style={{ margin: 0, fontSize: "clamp(20px, 5vw, 26px)", fontWeight: 700 }}>{t("products.popular")}</h2>
          <Link href="/katalog" style={{ fontSize: 14, fontWeight: 600, color: "var(--accent)", textDecoration: "none", whiteSpace: "nowrap" }}>{t("products.all")} &rarr;</Link>
        </div>
        <div className="grid-products-4">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.slug} product={product} aspectRatio="1/1" addButtonStyle="icon" />
          ))}
        </div>
      </section>
    </div>
  );
}
