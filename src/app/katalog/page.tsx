"use client";

import ProductCard from "@/components/ProductCard";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";

export default function KatalogPage() {
  const { products } = useStore();
  const { t } = useI18n();

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{
        background: "white", borderRadius: 20, padding: "18px 22px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 16, flexWrap: "wrap", gap: 12,
      }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{t("catalog.title")}</div>
          <div style={{ fontSize: 13.5, color: "#94A3B8", marginTop: 3 }}>
            {products.length} {t("catalog.found")}
          </div>
        </div>
      </div>

      <div className="grid-products-3">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} aspectRatio="4/3" addButtonStyle="text" />
        ))}
      </div>
    </div>
  );
}
