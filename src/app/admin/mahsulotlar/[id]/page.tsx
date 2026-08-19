"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAdmin } from "@/lib/admin-store";
import { ProductForm, productToForm } from "@/components/ProductForm";

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { products, loading, updateProduct, deleteProduct } = useAdmin();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const product = products.find((p) => p.id === id);

  if (loading) {
    return <div style={{ fontSize: 15, color: "var(--text-muted)" }}>Yuklanmoqda...</div>;
  }

  if (!product) {
    return (
      <div
        style={{
          background: "var(--bg-surface)", borderRadius: 16, padding: "48px 24px",
          textAlign: "center", border: "1px dashed var(--border-hover)",
        }}
      >
        <p style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600 }}>Mahsulot topilmadi</p>
        <button
          onClick={() => router.push("/admin/mahsulotlar")}
          style={{
            height: 44, padding: "0 20px", border: "none", borderRadius: 10,
            background: "var(--accent)", color: "#fff", fontSize: 14.5, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          Mahsulotlarga qaytish
        </button>
      </div>
    );
  }

  return (
    <>
      <ProductForm
        title="Mahsulotni tahrirlash"
        initial={productToForm(product)}
        onSubmit={(payload) => updateProduct(product.id, payload)}
        extraActions={
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            style={{
              width: "100%", height: 48, border: "1px solid var(--border)", borderRadius: 10,
              background: "var(--danger-bg)", color: "var(--danger)", fontSize: 15, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Mahsulotni o&apos;chirish
          </button>
        }
      />

      {confirmDelete && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(42,33,29,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
          <div style={{ background: "var(--bg-surface)", borderRadius: 16, padding: 30, maxWidth: 420, width: "100%" }}>
            <h3 style={{ margin: "0 0 12px", fontSize: 18, fontWeight: 700 }}>Mahsulotni o&apos;chirish</h3>
            <p style={{ margin: "0 0 24px", color: "var(--text-muted)", fontSize: 14.5, lineHeight: 1.6 }}>
              &laquo;{product.name}&raquo; butunlay o&apos;chiriladi. Bu amalni qaytarib bo&apos;lmaydi.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", flexWrap: "wrap" }}>
              <button
                onClick={() => setConfirmDelete(false)}
                style={{
                  padding: "11px 20px", border: "1px solid var(--border)", borderRadius: 10,
                  background: "var(--bg-surface)", fontSize: 14, fontWeight: 600, cursor: "pointer",
                  color: "var(--ink)", fontFamily: "inherit",
                }}
              >
                Bekor qilish
              </button>
              <button
                onClick={async () => {
                  await deleteProduct(product.id);
                  router.push("/admin/mahsulotlar");
                }}
                style={{
                  padding: "11px 20px", border: "none", borderRadius: 10, background: "var(--danger)",
                  color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                }}
              >
                O&apos;chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
