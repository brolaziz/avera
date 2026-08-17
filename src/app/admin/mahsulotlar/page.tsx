"use client";

import { useState } from "react";
import Link from "next/link";
import { useAdmin } from "@/lib/admin-store";

export default function ProductsPage() {
  const { products, deleteProduct } = useAdmin();
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const formatPrice = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setDeleteConfirm(null);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <h1 style={{ fontSize: 28, margin: 0, fontWeight: 700 }}>
          Mahsulotlar
        </h1>
        <Link
          href="/admin/mahsulotlar/yangi"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            background: "var(--accent)",
            color: "#fff",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M12 4v16m8-8H4" />
          </svg>
          Yangi mahsulot
        </Link>
      </div>

      {/* Search and view toggle */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
          <svg width="18" height="18" fill="none" stroke="#8B7561" strokeWidth={1.5} viewBox="0 0 24 24"
            style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}>
            <path strokeLinecap="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Mahsulot qidirish..."
            style={{
              width: "100%",
              height: 44,
              border: "1px solid #DDD3C4",
              borderRadius: 10,
              padding: "0 14px 0 42px",
              fontSize: 14,
              background: "#fff",
              outline: "none",
            }}
          />
        </div>
        <div style={{ display: "flex", border: "1px solid #DDD3C4", borderRadius: 10, overflow: "hidden" }}>
          <button
            onClick={() => setViewMode("table")}
            style={{
              padding: "0 14px",
              height: 44,
              border: "none",
              background: viewMode === "table" ? "var(--accent)" : "#fff",
              color: viewMode === "table" ? "#fff" : "#6B5A4C",
              cursor: "pointer",
            }}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode("grid")}
            style={{
              padding: "0 14px",
              height: 44,
              border: "none",
              borderLeft: "1px solid #DDD3C4",
              background: viewMode === "grid" ? "var(--accent)" : "#fff",
              color: viewMode === "grid" ? "#fff" : "#6B5A4C",
              cursor: "pointer",
            }}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Table view */}
      {viewMode === "table" && (
        <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 8px rgba(43,31,23,0.04)" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #E6DCCD" }}>
                  <th style={{ textAlign: "left", padding: "14px 16px", color: "#6B5A4C", fontWeight: 600, fontSize: 12, textTransform: "uppercase" }}>Rasm</th>
                  <th style={{ textAlign: "left", padding: "14px 16px", color: "#6B5A4C", fontWeight: 600, fontSize: 12, textTransform: "uppercase" }}>Nomi</th>
                  <th style={{ textAlign: "left", padding: "14px 16px", color: "#6B5A4C", fontWeight: 600, fontSize: 12, textTransform: "uppercase" }}>Narxi</th>
                  <th style={{ textAlign: "left", padding: "14px 16px", color: "#6B5A4C", fontWeight: 600, fontSize: 12, textTransform: "uppercase" }}>Kategoriya</th>
                  <th style={{ textAlign: "left", padding: "14px 16px", color: "#6B5A4C", fontWeight: 600, fontSize: 12, textTransform: "uppercase" }}>Zaxira</th>
                  <th style={{ textAlign: "left", padding: "14px 16px", color: "#6B5A4C", fontWeight: 600, fontSize: 12, textTransform: "uppercase" }}>Holat</th>
                  <th style={{ textAlign: "right", padding: "14px 16px", color: "#6B5A4C", fontWeight: 600, fontSize: 12, textTransform: "uppercase" }}>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(product => (
                  <tr key={product.id} style={{ borderBottom: "1px solid #E6DCCD" }}>
                    <td style={{ padding: "10px 16px" }}>
                      <div style={{
                        width: 48,
                        height: 48,
                        borderRadius: 8,
                        background: product.image ? `url(${product.image}) center/cover` : product.colors[0]?.hex || "#DDD3C4",
                        border: "1px solid #E6DCCD",
                      }} />
                    </td>
                    <td style={{ padding: "10px 16px", fontWeight: 600 }}>{product.name}</td>
                    <td style={{ padding: "10px 16px" }}>{formatPrice(product.priceNum)} so'm</td>
                    <td style={{ padding: "10px 16px", color: "#6B5A4C" }}>{product.category}</td>
                    <td style={{ padding: "10px 16px" }}>{product.stock} dona</td>
                    <td style={{ padding: "10px 16px" }}>
                      <span style={{
                        display: "inline-block",
                        padding: "4px 10px",
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        background: product.stock > 0 ? "#E4EBDB" : "#F6E3DC",
                        color: product.stock > 0 ? "#4C6B3C" : "#A83A22",
                      }}>
                        {product.stock > 0 ? "Mavjud" : "Tugagan"}
                      </span>
                    </td>
                    <td style={{ padding: "10px 16px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <Link
                          href={`/admin/mahsulotlar/${product.id}`}
                          style={{
                            padding: "6px 12px",
                            border: "1px solid #DDD3C4",
                            borderRadius: 8,
                            fontSize: 13,
                            color: "#2B1F17",
                            textDecoration: "none",
                            fontWeight: 500,
                          }}
                        >
                          Tahrirlash
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(product.id)}
                          style={{
                            padding: "6px 12px",
                            border: "1px solid #F6E3DC",
                            borderRadius: 8,
                            fontSize: 13,
                            color: "#A83A22",
                            background: "#F6E3DC",
                            cursor: "pointer",
                            fontWeight: 500,
                          }}
                        >
                          O'chirish
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div style={{ padding: 40, textAlign: "center", color: "#6B5A4C" }}>
              Mahsulot topilmadi
            </div>
          )}
        </div>
      )}

      {/* Grid view */}
      {viewMode === "grid" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
          {filtered.map(product => (
            <div key={product.id} style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 8px rgba(43,31,23,0.04)" }}>
              <div style={{
                height: 160,
                background: product.image ? `url(${product.image}) center/cover` : product.colors[0]?.hex || "#DDD3C4",
                borderBottom: "1px solid #E6DCCD",
              }} />
              <div style={{ padding: 16 }}>
                <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 600 }}>{product.name}</h3>
                <p style={{ margin: "0 0 4px", fontSize: 14, color: "#6B5A4C" }}>{product.category}</p>
                <p style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700 }}>{formatPrice(product.priceNum)} so'm</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <Link
                    href={`/admin/mahsulotlar/${product.id}`}
                    style={{
                      flex: 1,
                      padding: "8px",
                      border: "1px solid #DDD3C4",
                      borderRadius: 8,
                      fontSize: 13,
                      color: "#2B1F17",
                      textDecoration: "none",
                      textAlign: "center",
                      fontWeight: 500,
                    }}
                  >
                    Tahrirlash
                  </Link>
                  <button
                    onClick={() => setDeleteConfirm(product.id)}
                    style={{
                      padding: "8px 12px",
                      border: "1px solid #F6E3DC",
                      borderRadius: 8,
                      fontSize: 13,
                      color: "#A83A22",
                      background: "#F6E3DC",
                      cursor: "pointer",
                      fontWeight: 500,
                    }}
                  >
                    O'chirish
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: 40, textAlign: "center", color: "#6B5A4C", gridColumn: "1 / -1" }}>
              Mahsulot topilmadi
            </div>
          )}
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, maxWidth: 400, width: "90%" }}>
            <h3 style={{ margin: "0 0 12px", fontSize: 18, fontWeight: 600 }}>Mahsulotni o'chirish</h3>
            <p style={{ margin: "0 0 24px", color: "#6B5A4C", fontSize: 14 }}>
              Haqiqatan ham bu mahsulotni o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{
                  padding: "10px 20px",
                  border: "1px solid #DDD3C4",
                  borderRadius: 10,
                  background: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Bekor qilish
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                style={{
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: 10,
                  background: "#A83A22",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
