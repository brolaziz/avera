"use client";

import { useState } from "react";
import { useAdmin, type Category } from "@/lib/admin-store";

export default function CatalogPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useAdmin();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [newName, setNewName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [error, setError] = useState("");

  const sorted = [...categories].sort((a, b) => a.order - b.order);

  const run = async (fn: () => Promise<void>) => {
    setError("");
    try {
      await fn();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Amalni bajarib bo'lmadi");
    }
  };

  const handleAdd = () =>
    run(async () => {
      if (!newName.trim()) return;
      await addCategory({ name: newName.trim(), order: categories.length + 1 });
      setNewName("");
    });

  const handleStartEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditSlug(cat.slug);
    setError("");
  };

  const handleSaveEdit = (cat: Category) =>
    run(async () => {
      if (!editName.trim() || !editSlug.trim()) return;
      await updateCategory(cat.id, { name: editName.trim(), slug: editSlug.trim(), order: cat.order });
      setEditingId(null);
    });

  const toggleVisible = (cat: Category) =>
    run(() => updateCategory(cat.id, { name: cat.name, slug: cat.slug, order: cat.order, visible: !cat.visible }));

  const move = (index: number, dir: -1 | 1) =>
    run(async () => {
      const other = sorted[index + dir];
      const current = sorted[index];
      if (!other) return;
      await updateCategory(current.id, { name: current.name, slug: current.slug, order: other.order, visible: current.visible });
      await updateCategory(other.id, { name: other.name, slug: other.slug, order: current.order, visible: other.visible });
    });

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 8px" }}>Kategoriyalar</h1>
      <p style={{ margin: "0 0 24px", fontSize: 14.5, color: "var(--text-muted)", maxWidth: 640 }}>
        Kategoriya yashirilsa, u mijoz saytidagi menyu va filtrlarda ko&apos;rinmaydi. O&apos;chirilganda unga tegishli
        mahsulotlar saqlanib qoladi — ular kategoriyasiz bo&apos;ladi.
      </p>

      <div style={{ background: "var(--bg-surface)", borderRadius: 16, padding: 24, marginBottom: 20, border: "1px solid var(--border-soft)", boxShadow: "var(--shadow-sm)" }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700 }}>Yangi kategoriya</h3>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <input
            className="field-input"
            style={{ flex: "1 1 240px" }}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Kategoriya nomi (masalan: Sumkalar)"
          />
          <button
            onClick={handleAdd}
            className="btn-accent"
            style={{
              height: 46, padding: "0 24px", border: "none", borderRadius: 10,
              background: "var(--accent)", color: "#fff", fontSize: 14.5, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Qo&apos;shish
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: "var(--danger-bg)", color: "var(--danger)", borderRadius: 10, padding: "12px 16px", fontSize: 14, marginBottom: 16 }}>
          {error}
        </div>
      )}

      <div style={{ background: "var(--bg-surface)", borderRadius: 16, overflow: "hidden", border: "1px solid var(--border-soft)", boxShadow: "var(--shadow-sm)" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border-soft)" }}>
          <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>
            {categories.length} ta kategoriya
          </span>
        </div>

        {sorted.map((cat, index) => (
          <div
            key={cat.id}
            style={{
              display: "flex", alignItems: "center", gap: 12, padding: "14px 24px",
              borderBottom: "1px solid var(--border-soft)", flexWrap: "wrap",
              opacity: cat.visible ? 1 : 0.55,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <ArrowBtn onClick={() => move(index, -1)} disabled={index === 0}>▲</ArrowBtn>
              <ArrowBtn onClick={() => move(index, 1)} disabled={index === sorted.length - 1}>▼</ArrowBtn>
            </div>

            <div style={{ flex: 1, minWidth: 180 }}>
              {editingId === cat.id ? (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <input
                    className="field-input"
                    style={{ flex: "1 1 140px", height: 40 }}
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    autoFocus
                    placeholder="Nomi"
                  />
                  <input
                    className="field-input"
                    style={{ flex: "1 1 140px", height: 40 }}
                    value={editSlug}
                    onChange={(e) => setEditSlug(e.target.value)}
                    placeholder="slug"
                  />
                </div>
              ) : (
                <div>
                  <span style={{ fontSize: 15, fontWeight: 600 }}>{cat.name}</span>
                  <span style={{ fontSize: 12.5, color: "var(--text-soft)", marginLeft: 8 }}>/{cat.slug}</span>
                  {typeof cat.productCount === "number" && (
                    <span style={{ fontSize: 12.5, color: "var(--text-soft)", marginLeft: 8 }}>
                      · {cat.productCount} ta mahsulot
                    </span>
                  )}
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {editingId === cat.id ? (
                <>
                  <SmallBtn primary onClick={() => handleSaveEdit(cat)}>Saqlash</SmallBtn>
                  <SmallBtn onClick={() => setEditingId(null)}>Bekor</SmallBtn>
                </>
              ) : (
                <>
                  <SmallBtn onClick={() => toggleVisible(cat)}>
                    {cat.visible ? "Yashirish" : "Ko'rsatish"}
                  </SmallBtn>
                  <SmallBtn onClick={() => handleStartEdit(cat)}>Tahrirlash</SmallBtn>
                  <SmallBtn danger onClick={() => setDeleteTarget(cat)}>O&apos;chirish</SmallBtn>
                </>
              )}
            </div>
          </div>
        ))}

        {categories.length === 0 && (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
            Kategoriyalar hali qo&apos;shilmagan
          </div>
        )}
      </div>

      {deleteTarget && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(42,33,29,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
          <div style={{ background: "var(--bg-surface)", borderRadius: 16, padding: 30, maxWidth: 420, width: "100%" }}>
            <h3 style={{ margin: "0 0 12px", fontSize: 18, fontWeight: 700 }}>Kategoriyani o&apos;chirish</h3>
            <p style={{ margin: "0 0 24px", color: "var(--text-muted)", fontSize: 14.5, lineHeight: 1.6 }}>
              &laquo;{deleteTarget.name}&raquo; o&apos;chiriladi.
              {!!deleteTarget.productCount && ` Undagi ${deleteTarget.productCount} ta mahsulot saqlanib qoladi, lekin kategoriyasiz bo'ladi.`}
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", flexWrap: "wrap" }}>
              <SmallBtn onClick={() => setDeleteTarget(null)}>Bekor qilish</SmallBtn>
              <button
                onClick={() => run(async () => { await deleteCategory(deleteTarget.id); setDeleteTarget(null); })}
                style={{
                  padding: "10px 20px", border: "none", borderRadius: 10, background: "var(--danger)",
                  color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                }}
              >
                O&apos;chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ArrowBtn({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 24, height: 24, border: "none", borderRadius: 6, background: "var(--bg-fill)",
        cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.3 : 1, fontSize: 11,
        display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink)",
      }}
    >
      {children}
    </button>
  );
}

function SmallBtn({
  children, onClick, primary, danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "9px 14px", borderRadius: 9, fontSize: 13.5, fontWeight: 600, cursor: "pointer",
        fontFamily: "inherit", whiteSpace: "nowrap",
        border: primary ? "none" : "1px solid var(--border)",
        background: primary ? "var(--accent)" : danger ? "var(--danger-bg)" : "var(--bg-surface)",
        color: primary ? "#fff" : danger ? "var(--danger)" : "var(--ink)",
      }}
    >
      {children}
    </button>
  );
}
