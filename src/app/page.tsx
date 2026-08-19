"use client";

import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { useSite } from "@/lib/site";

export default function HomePage() {
  const { products, productsLoading } = useStore();
  const { settings, categories } = useSite();
  const { t } = useI18n();

  const featured = products.slice(0, 8);
  const hasHeroText = !!(settings.heroTitle || settings.heroSubtitle || settings.heroBadge);

  return (
    <div>
      {/* Hero — matn ham, rasm ham admin paneldan keladi */}
      {(hasHeroText || settings.heroImage) && (
        <section className="grid-hero">
          <div className={`hero-panel fade-up${settings.heroImage ? "" : " no-image"}`}>
            {settings.heroImage && (
              <>
                {/* Sahifadagi eng yirik rasm — birinchi bo'lib yuklanadi */}
                <img className="hero-bg" src={settings.heroImage} alt="" fetchPriority="high" decoding="sync" />
                <div className="hero-scrim" />
              </>
            )}

            <div className="hero-content">
              {settings.heroBadge && <span className="hero-badge">{settings.heroBadge}</span>}

              {settings.heroTitle && (
                <h1 className="hero-title">
                  {settings.heroTitle}
                  {settings.heroDiscount && (
                    <>
                      {" "}
                      <span style={{ color: "var(--gold)" }}>
                        {settings.heroDiscount}
                        {/^\d+$/.test(settings.heroDiscount.trim()) ? "% " : " "}
                        {t("hero.discount")}
                      </span>
                    </>
                  )}
                </h1>
              )}

              {settings.heroSubtitle && <p className="hero-sub">{settings.heroSubtitle}</p>}

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {settings.heroCtaText && (
                  <Link
                    href={settings.heroCtaLink || "/katalog"}
                    className="btn-accent"
                    style={{
                      height: 48, padding: "0 24px", background: "var(--accent)", color: "#fff",
                      borderRadius: 12, fontSize: 15, fontWeight: 600,
                      display: "inline-flex", alignItems: "center", textDecoration: "none",
                    }}
                  >
                    {settings.heroCtaText}
                  </Link>
                )}
                <Link
                  href="/katalog"
                  className="btn-outline"
                  style={{
                    height: 48, padding: "0 22px", border: "1px solid rgba(245,239,230,0.32)",
                    background: "transparent", color: "#fff", borderRadius: 12,
                    fontSize: 15, fontWeight: 600,
                    display: "inline-flex", alignItems: "center", textDecoration: "none",
                  }}
                >
                  {t("hero.catalog")}
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Kategoriyalar — admin paneldan boshqariladi */}
      {categories.length > 0 && (
        <section className="fade-up delay-1" style={{ marginTop: "clamp(20px, 4vw, 32px)" }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {categories.map((cat) => (
              <Link key={cat.id} href={`/katalog?category=${cat.slug}`} className="chip">
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Mahsulotlar — bazada mahsulot bo'lmasa, bo'lim umuman chiqmaydi */}
      {featured.length > 0 && (
        <section className="fade-up delay-2" style={{ marginTop: "clamp(26px, 6vw, 48px)" }}>
          <div className="section-header">
            <h2>{settings.featuredTitle || t("products.popular")}</h2>
            <Link href="/katalog" style={{ fontSize: 14, fontWeight: 600, color: "var(--accent)", whiteSpace: "nowrap" }}>
              {t("products.all")} &rarr;
            </Link>
          </div>
          <div className="grid-products-4">
            {featured.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 4} />
            ))}
          </div>
        </section>
      )}

      {!productsLoading && products.length === 0 && (
        <section className="empty-state fade-in" style={{ marginTop: "clamp(20px, 5vw, 40px)" }}>
          <div className="empty-title">{t("products.none_title")}</div>
          <div style={{ fontSize: 14.5 }}>{t("products.none_desc")}</div>
        </section>
      )}
    </div>
  );
}
