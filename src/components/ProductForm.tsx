"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/lib/admin-store";
import { ImageUpload } from "@/components/ImageUpload";
import type { Product } from "@/lib/api";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .trim();
}

const TAGS = ["Yangi", "Hit", "Chegirma"];

export interface ProductFormValues {
  name: string;
  slug: string;
  description: string;
  price: string;
  oldPrice: string;
  categoryId: string;
  tag: string;
  stock: string;
  available: boolean;
  images: string[];
  colors: { name: string; hex: string }[];
  specs: { k: string; v: string }[];
}

export function emptyProductForm(): ProductFormValues {
  return {
    name: "", slug: "", description: "", price: "", oldPrice: "",
    categoryId: "", tag: "", stock: "", available: true,
    images: [], colors: [], specs: [],
  };
}

export function productToForm(p: Product): ProductFormValues {
  return {
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: String(p.priceNum),
    oldPrice: p.oldPriceNum ? String(p.oldPriceNum) : "",
    categoryId: p.categoryId || "",
    tag: p.tag,
    stock: String(p.stock),
    available: p.available,
    images: p.images || [],
    colors: p.colors || [],
    specs: p.specs || [],
  };
}

interface ProductFormProps {
  title: string;
  initial: ProductFormValues;
  /** Mahsulotni saqlaydi — qo'shish yoki tahrirlash sahifasi beradi. */
  onSubmit: (payload: Partial<Product>) => Promise<void>;
  submitLabel?: string;
  extraActions?: React.ReactNode;
}

export function ProductForm({ title, initial, onSubmit, submitLabel = "Saqlash", extraActions }: ProductFormProps) {
  const { categories } = useAdmin();
  const router = useRouter();

  const [form, setForm] = useState<ProductFormValues>(initial);
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#6B1E2E");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof ProductFormValues>(field: K, value: ProductFormValues[K]) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      // Slug faqat u hali qo'lda o'zgartirilmagan bo'lsa avtomatik to'ldiriladi
      if (field === "name" && (!prev.slug || prev.slug === slugify(prev.name))) {
        updated.slug = slugify(String(value));
      }
      return updated;
    });
    setError("");
  };

  const toNumber = (v: string) => parseInt(v.replace(/\s/g, ""), 10) || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = toNumber(form.price);
    if (!form.name.trim() || priceNum <= 0) {
      setError("Mahsulot nomi va narxi to'ldirilishi kerak");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await onSubmit({
        slug: form.slug || slugify(form.name),
        name: form.name.trim(),
        priceNum,
        oldPriceNum: form.oldPrice ? toNumber(form.oldPrice) : undefined,
        tag: form.tag,
        colors: form.colors,
        specs: form.specs.filter((s) => s.k && s.v),
        image: form.images[0] || "",
        images: form.images,
        description: form.description,
        stock: toNumber(form.stock),
        available: form.available,
        categoryId: form.categoryId,
      });
      router.push("/admin/mahsulotlar");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Saqlab bo'lmadi");
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button
          type="button"
          onClick={() => router.push("/admin/mahsulotlar")}
          aria-label="Orqaga"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
        >
          <svg width="20" height="20" fill="none" stroke="var(--ink)" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 style={{ fontSize: 28, margin: 0, fontWeight: 700 }}>{title}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Card title="Asosiy ma'lumotlar">
              <div>
                <label className="field-label">Nomi *</label>
                <input className="field-input" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Mahsulot nomi" required />
              </div>
              <div>
                <label className="field-label">Slug (havoladagi nom)</label>
                <input className="field-input" value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="mahsulot-slug" />
              </div>
              <div>
                <label className="field-label">Tavsif</label>
                <textarea className="field-input" value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Mahsulot haqida qisqacha ma'lumot" />
              </div>
            </Card>

            <Card title="Narx, zaxira va kategoriya">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label className="field-label">Narxi (so&apos;m) *</label>
                  <input className="field-input" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="1240000" required />
                </div>
                <div>
                  <label className="field-label">Eski narx (so&apos;m)</label>
                  <input className="field-input" value={form.oldPrice} onChange={(e) => set("oldPrice", e.target.value)} placeholder="1480000" />
                  <p style={{ margin: "6px 0 0", fontSize: 12.5, color: "var(--text-soft)" }}>
                    Kiritilsa, chegirma foizi avtomatik hisoblanadi.
                  </p>
                </div>
                <div>
                  <label className="field-label">Zaxira (dona)</label>
                  <input className="field-input" type="number" min="0" value={form.stock} onChange={(e) => set("stock", e.target.value)} placeholder="10" />
                </div>
                <div>
                  <label className="field-label">Kategoriya</label>
                  <select className="field-input" value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)}>
                    <option value="">Kategoriyasiz</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  {categories.length === 0 && (
                    <p style={{ margin: "6px 0 0", fontSize: 12.5, color: "var(--text-soft)" }}>
                      Avval &laquo;Kategoriyalar&raquo; bo&apos;limida kategoriya qo&apos;shing.
                    </p>
                  )}
                </div>
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14.5, fontWeight: 500 }}>
                <input
                  type="checkbox"
                  checked={form.available}
                  onChange={(e) => set("available", e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: "var(--accent)", cursor: "pointer" }}
                />
                Sotuvda mavjud
                <span style={{ fontSize: 12.5, color: "var(--text-soft)", fontWeight: 400 }}>
                  (belgilanmasa yoki zaxira 0 bo&apos;lsa, saytda &laquo;Mavjud emas&raquo; deb ko&apos;rinadi)
                </span>
              </label>
            </Card>

            <Card title="Ranglar">
              {form.colors.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {form.colors.map((c, i) => (
                    <span key={i} style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 12px", borderRadius: 999, background: "var(--bg-fill)", fontSize: 13.5 }}>
                      <span style={{ width: 15, height: 15, borderRadius: "50%", background: c.hex, border: "1px solid var(--border-hover)" }} />
                      {c.name}
                      <button
                        type="button"
                        onClick={() => set("colors", form.colors.filter((_, j) => j !== i))}
                        aria-label="O'chirish"
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "var(--danger)", fontSize: 16, lineHeight: 1 }}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <input
                  className="field-input"
                  style={{ flex: "1 1 160px" }}
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  placeholder="Rang nomi"
                />
                <input
                  type="color"
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  style={{ width: 46, height: 46, border: "1px solid var(--border)", borderRadius: 10, padding: 2, cursor: "pointer", flexShrink: 0 }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newColorName.trim()) return;
                    set("colors", [...form.colors, { name: newColorName.trim(), hex: newColorHex }]);
                    setNewColorName("");
                  }}
                  style={{
                    height: 46, padding: "0 18px", border: "1px solid var(--border)", borderRadius: 10,
                    background: "var(--bg-surface)", fontSize: 14, fontWeight: 600, cursor: "pointer",
                    fontFamily: "inherit", flexShrink: 0,
                  }}
                >
                  Qo&apos;shish
                </button>
              </div>
            </Card>

            <Card title="Xususiyatlar">
              {form.specs.map((spec, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <input
                    className="field-input"
                    style={{ flex: "1 1 140px" }}
                    value={spec.k}
                    onChange={(e) => set("specs", form.specs.map((s, j) => (j === i ? { ...s, k: e.target.value } : s)))}
                    placeholder="Material"
                  />
                  <input
                    className="field-input"
                    style={{ flex: "1 1 140px" }}
                    value={spec.v}
                    onChange={(e) => set("specs", form.specs.map((s, j) => (j === i ? { ...s, v: e.target.value } : s)))}
                    placeholder="Tabiiy charm"
                  />
                  <button
                    type="button"
                    onClick={() => set("specs", form.specs.filter((_, j) => j !== i))}
                    aria-label="O'chirish"
                    style={{
                      width: 46, height: 46, border: "1px solid var(--border)", borderRadius: 10,
                      background: "var(--danger-bg)", color: "var(--danger)", cursor: "pointer",
                      fontSize: 18, flexShrink: 0, fontFamily: "inherit",
                    }}
                  >
                    &times;
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => set("specs", [...form.specs, { k: "", v: "" }])}
                style={{
                  padding: "11px 16px", border: "1px dashed var(--border-hover)", borderRadius: 10,
                  background: "transparent", fontSize: 14, color: "var(--text-muted)", cursor: "pointer",
                  width: "100%", fontFamily: "inherit",
                }}
              >
                + Xususiyat qo&apos;shish
              </button>
            </Card>
          </div>

          {/* Yon panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Card title="Rasmlar">
              <ImageUpload
                value={form.images}
                onChange={(urls) => set("images", urls)}
                max={5}
                hint="Birinchi rasm asosiy rasm sifatida ishlatiladi. 5 tagacha rasm, har biri 4 MB gacha."
              />
            </Card>

            <Card title="Yorliq (tag)">
              <select className="field-input" value={form.tag} onChange={(e) => set("tag", e.target.value)}>
                <option value="">Yo&apos;q</option>
                {TAGS.map((tg) => (
                  <option key={tg} value={tg}>{tg}</option>
                ))}
              </select>
              <p style={{ margin: 0, fontSize: 12.5, color: "var(--text-soft)" }}>
                Eski narx kiritilgan bo&apos;lsa, kartada chegirma foizi yorliqdan ustun ko&apos;rsatiladi.
              </p>
            </Card>

            {error && (
              <div style={{ background: "var(--danger-bg)", color: "var(--danger)", borderRadius: 10, padding: "12px 16px", fontSize: 14 }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                type="submit"
                disabled={saving}
                className="btn-accent"
                style={{
                  width: "100%", height: 48, border: "none", borderRadius: 10, background: "var(--accent)",
                  color: "#fff", fontSize: 15, fontWeight: 600, cursor: saving ? "default" : "pointer",
                  opacity: saving ? 0.7 : 1, fontFamily: "inherit",
                }}
              >
                {saving ? "Saqlanmoqda..." : submitLabel}
              </button>
              <button
                type="button"
                onClick={() => router.push("/admin/mahsulotlar")}
                style={{
                  width: "100%", height: 48, border: "1px solid var(--border)", borderRadius: 10,
                  background: "var(--bg-surface)", fontSize: 15, fontWeight: 600, cursor: "pointer",
                  color: "var(--ink)", fontFamily: "inherit",
                }}
              >
                Bekor qilish
              </button>
              {extraActions}
            </div>
          </div>
        </div>
      </form>

      <style>{`
        @media (max-width: 1024px) {
          .admin-form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--bg-surface)", borderRadius: 16, padding: 24, border: "1px solid var(--border-soft)", boxShadow: "var(--shadow-sm)" }}>
      <h3 style={{ margin: "0 0 18px", fontSize: 16, fontWeight: 700 }}>{title}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{children}</div>
    </div>
  );
}
