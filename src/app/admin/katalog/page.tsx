"use client";

import { useState } from "react";
import { useAdmin, type Category } from "@/lib/admin-store";

export default function CatalogPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useAdmin();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [newName, setNewName] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const sorted = [...categories].sort((a, b) => a.order - b.order);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    await addCategory({
      name: newName.trim(),
      slug: newName.trim().toLowerCase().replace(/\s+/g, "-"),
      order: categories.length + 1,
    });
    setNewName("");
  };

  const handleStartEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const handleSaveEdit = async (cat: Category) => {
    if (!editName.trim()) return;
    await updateCategory(cat.id, {
      name: editName.trim(),
      slug: editName.trim().toLowerCase().replace(/\s+/g, "-"),
      order: cat.order,
    });
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    await deleteCategory(id);
    setDeleteConfirm(null);
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const above = sorted[index - 1];
    const current = sorted[index];
    await updateCategory(current.id, { name: current.name, slug: current.slug, order: above.order });
    await updateCategory(above.id, { name: above.name, slug: above.slug, order: current.order });
  };

  const handleMoveDown = async (index: number) => {
    if (index === sorted.length - 1) return;
    const below = sorted[index + 1];
    const current = sorted[index];
    await updateCategory(current.id, { name: current.name, slug: current.slug, order: below.order });
    await updateCategory(below.id, { name: below.name, slug: below.slug, order: current.order });
  };

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 24px" }}>
        Katalog va kategoriyalar
      </h1>

      {/* Add new category */}
      <div style={{ background: "#fff", borderRadius: 16, padding: 24, marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600 }}>Yangi kategoriya qo'shish</h3>
        <div style={{ display: "flex", gap: 12 }}>
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAdd()}
            placeholder="Kategoriya nomi"
            style={{
              flex: 1,
              height: 44,
              border: "1px solid #E2E8F0",
              borderRadius: 10,
              padding: "0 14px",
              fontSize: 14,
              outline: "none",
            }}
          />
          <button
            onClick={handleAdd}
            style={{
              height: 44,
              padding: "0 20px",
              border: "none",
              borderRadius: 10,
              background: "var(--accent)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Qo'shish
          </button>
        </div>
      </div>

      {/* Categories list */}
      <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #E2E8F0" }}>
          <span style={{ fontSize: 13, color: "#64748B", fontWeight: 600 }}>
            {categories.length} ta kategoriya
          </span>
        </div>
        {sorted.map((cat, index) => (
          <div
            key={cat.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 24px",
              borderBottom: "1px solid #E2E8F0",
            }}
          >
            {/* Order arrows */}
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <button
                onClick={() => handleMoveUp(index)}
                disabled={index === 0}
                style={{
                  width: 24, height: 24, border: "none", borderRadius: 6,
                  background: index === 0 ? "#F1F3F5" : "#F1F3F5",
                  cursor: index === 0 ? "default" : "pointer",
                  opacity: index === 0 ? 0.3 : 1,
                  fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                ▲
              </button>
              <button
                onClick={() => handleMoveDown(index)}
                disabled={index === sorted.length - 1}
                style={{
                  width: 24, height: 24, border: "none", borderRadius: 6,
                  background: "#F1F3F5",
                  cursor: index === sorted.length - 1 ? "default" : "pointer",
                  opacity: index === sorted.length - 1 ? 0.3 : 1,
                  fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                ▼
              </button>
            </div>

            {/* Name */}
            <div style={{ flex: 1 }}>
              {editingId === cat.id ? (
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSaveEdit(cat)}
                  autoFocus
                  style={{
                    width: "100%",
                    height: 38,
                    border: "1px solid var(--accent)",
                    borderRadius: 8,
                    padding: "0 12px",
                    fontSize: 14,
                    outline: "none",
                  }}
                />
              ) : (
                <div>
                  <span style={{ fontSize: 15, fontWeight: 600 }}>{cat.name}</span>
                  <span style={{ fontSize: 12, color: "#94A3B8", marginLeft: 8 }}>/{cat.slug}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 8 }}>
              {editingId === cat.id ? (
                <>
                  <button
                    onClick={() => handleSaveEdit(cat)}
                    style={{ padding: "6px 12px", border: "none", borderRadius: 8, background: "var(--accent)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                  >
                    Saqlash
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    style={{ padding: "6px 12px", border: "1px solid #E2E8F0", borderRadius: 8, background: "#fff", fontSize: 13, cursor: "pointer" }}
                  >
                    Bekor
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleStartEdit(cat)}
                    style={{ padding: "6px 12px", border: "1px solid #E2E8F0", borderRadius: 8, background: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer" }}
                  >
                    Tahrirlash
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(cat.id)}
                    style={{ padding: "6px 12px", border: "1px solid #FEF2F2", borderRadius: 8, background: "#FEF2F2", color: "#EF4444", fontSize: 13, fontWeight: 500, cursor: "pointer" }}
                  >
                    O'chirish
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div style={{ padding: 40, textAlign: "center", color: "#64748B" }}>
            Kategoriyalar topilmadi
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, maxWidth: 400, width: "90%" }}>
            <h3 style={{ margin: "0 0 12px", fontSize: 18, fontWeight: 600 }}>Kategoriyani o'chirish</h3>
            <p style={{ margin: "0 0 24px", color: "#64748B", fontSize: 14 }}>
              Haqiqatan ham bu kategoriyani o'chirmoqchimisiz?
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{ padding: "10px 20px", border: "1px solid #E2E8F0", borderRadius: 10, background: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
              >
                Bekor qilish
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                style={{ padding: "10px 20px", border: "none", borderRadius: 10, background: "#EF4444", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
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
