"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { useSite } from "@/lib/site";

export default function KatalogPage() {
  return (
    <Suspense fallback={null}>
      <KatalogContent />
    </Suspense>
  );
}

function KatalogContent() {
  const { products, productsLoading } = useStore();
  const { categories } = useSite();
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const activeSlug = searchParams.get("category") || "";

  const activeCategory = categories.find((c) => c.slug === activeSlug);
  const visible = activeSlug
    ? products.filter((p) => p.categorySlug === activeSlug)
    : products;

  return (
    <div style={{ marginTop: 16 }}>
      <div className="panel fade-up" style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontSize: "clamp(26px, 5vw, 34px)" }}>
          {activeCategory?.name || t("catalog.title")}
        </h1>
        <div style={{ fontSize: 13.5, color: "var(--text-soft)", marginTop: 3 }}>
          {visible.length} {t("catalog.found")}
        </div>

        {categories.length > 0 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
            <Link href="/katalog" className="chip" data-active={!activeSlug}>
              {t("catalog.all_categories")}
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/katalog?category=${cat.slug}`}
                className="chip"
                data-active={activeSlug === cat.slug}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {visible.length > 0 ? (
        <section className="fade-up delay-1">
          <h2 className="sr-only">{t("catalog.title")}</h2>
          <div className="grid-products-3">
            {visible.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 6} />
            ))}
          </div>
        </section>
      ) : (
        !productsLoading && (
          <div className="empty-state fade-in">
            <div className="empty-title">
              {activeSlug ? t("catalog.empty") : t("products.none_title")}
            </div>
            {!activeSlug && <div style={{ fontSize: 14.5 }}>{t("products.none_desc")}</div>}
          </div>
        )
      )}
    </div>
  );
}
