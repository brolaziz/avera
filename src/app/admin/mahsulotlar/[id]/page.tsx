"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAdmin } from "@/lib/admin-store";
import type { Product } from "@/lib/data";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function EditProductPage() {
  const { products, updateProduct, deleteProduct } = useAdmin();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const product = products.find(p => p.id === id);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    oldPrice: "",
    category: "Tote",
    tag: "",
    stock: "",
    image: "",
  });
  const [colors, setColors] = useState<{ name: string; hex: string }[]>([]);
  const [specs, setSpecs] = useState<{ k: string; v: string }[]>([]);
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#8A5A34");
  const [imagePreview, setImagePreview] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        slug: product.slug,
        description: product.description || "",
        price: product.priceNum.toString(),
        oldPrice: product.oldPrice ? product.oldPrice.replace(/\s/g, "") : "",
        category: product.category || "Tote",
        tag: product.tag || "",
        stock: (product.stock || 0).toString(),
        image: product.image || "",
      });
      setColors(product.colors || []);
      setSpecs(product.specs || []);
      setImagePreview(product.image || "");
    }
  }, [product]);

  if (!product) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h2 style={{ margin: "0 0 12px" }}>Mahsulot topilmadi</h2>
        <button onClick={() => router.push("/admin/mahsulotlar")} style={{ padding: "10px 20px", border: "1px solid #DDD3C4", borderRadius: 10, background: "#fff", cursor: "pointer" }}>
          Orqaga qaytish
        </button>
      </div>
    );
  }

  const handleChange = (field: string, value: string) => {
    setForm(prev => {
      const updated = { ...prev, [field]: value };
      if (field === "name") {
        updated.slug = slugify(value);
      }
      return updated;
    });
  };

  const addColor = () => {
    if (newColorName.trim()) {
      setColors(prev => [...prev, { name: newColorName.trim(), hex: newColorHex }]);
      setNewColorName("");
      setNewColorHex("#8A5A34");
    }
  };

  const removeColor = (index: number) => {
    setColors(prev => prev.filter((_, i) => i !== index));
  };

  const addSpec = () => {
    setSpecs(prev => [...prev, { k: "", v: "" }]);
  };

  const updateSpec = (index: number, field: "k" | "v", value: string) => {
    setSpecs(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  const removeSpec = (index: number) => {
    setSpecs(prev => prev.filter((_, i) => i !== index));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      setForm(prev => ({ ...prev, image: base64 }));
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseInt(form.price.replace(/\s/g, "")) || 0;
    const oldPriceNum = form.oldPrice ? parseInt(form.oldPrice.replace(/\s/g, "")) || null : null;
    await updateProduct(id, {
      slug: form.slug || slugify(form.name),
      name: form.name,
      color: colors[0]?.name || product.color,
      priceNum,
      oldPriceNum,
      tag: form.tag,
      colors,
      specs: specs.filter(s => s.k && s.v),
      image: form.image,
      description: form.description,
      stock: parseInt(form.stock) || 0,
      category: form.category,
    } as Record<string, unknown>);
    router.push("/admin/mahsulotlar");
  };

  const handleDelete = async () => {
    await deleteProduct(id);
    router.push("/admin/mahsulotlar");
  };

  const categories = ["Tote", "Crossbody", "Clutch", "Ryukzak", "Hamyon"];
  const tags = ["Yangi", "Hit", "-10%", "-15%", "-20%", "-25%", "-30%"];

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: 44,
    border: "1px solid #DDD3C4",
    borderRadius: 10,
    padding: "0 14px",
    fontSize: 14,
    background: "#fff",
    outline: "none",
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <button
          onClick={() => router.back()}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
        >
          <svg width="20" height="20" fill="none" stroke="#2B1F17" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 style={{ fontSize: 28, margin: 0, fontWeight: 700 }}>
          Mahsulotni tahrirlash
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24, alignItems: "start" }} className="admin-form-grid">
          {/* Main form */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Basic info card */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 8px rgba(43,31,23,0.04)" }}>
              <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 600 }}>Asosiy ma'lumotlar</h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#4A382C", marginBottom: 6 }}>Nomi *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => handleChange("name", e.target.value)}
                    placeholder="Mahsulot nomi"
                    required
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#4A382C", marginBottom: 6 }}>Slug</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={e => handleChange("slug", e.target.value)}
                    placeholder="mahsulot-slug"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#4A382C", marginBottom: 6 }}>Tavsif</label>
                  <textarea
                    value={form.description}
                    onChange={e => handleChange("description", e.target.value)}
                    placeholder="Mahsulot haqida qisqacha ma'lumot"
                    rows={4}
                    style={{ ...inputStyle, height: "auto", padding: "12px 14px", resize: "vertical" }}
                  />
                </div>
              </div>
            </div>

            {/* Pricing card */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 8px rgba(43,31,23,0.04)" }}>
              <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 600 }}>Narx va zaxira</h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#4A382C", marginBottom: 6 }}>Narxi (UZS) *</label>
                  <input
                    type="text"
                    value={form.price}
                    onChange={e => handleChange("price", e.target.value)}
                    placeholder="1240000"
                    required
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#4A382C", marginBottom: 6 }}>Eski narx (UZS)</label>
                  <input
                    type="text"
                    value={form.oldPrice}
                    onChange={e => handleChange("oldPrice", e.target.value)}
                    placeholder="1480000"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#4A382C", marginBottom: 6 }}>Zaxira (dona) *</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={e => handleChange("stock", e.target.value)}
                    placeholder="10"
                    required
                    min="0"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#4A382C", marginBottom: 6 }}>Kategoriya *</label>
                  <select
                    value={form.category}
                    onChange={e => handleChange("category", e.target.value)}
                    style={inputStyle}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Colors card */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 8px rgba(43,31,23,0.04)" }}>
              <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 600 }}>Ranglar</h3>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                {colors.map((c, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 20, background: "#F3EEE5", fontSize: 13 }}>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", background: c.hex, border: "1px solid #DDD3C4" }} />
                    <span>{c.name}</span>
                    <button type="button" onClick={() => removeColor(i)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: "#A83A22", fontSize: 16, lineHeight: 1 }}>
                      x
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="text"
                  value={newColorName}
                  onChange={e => setNewColorName(e.target.value)}
                  placeholder="Rang nomi"
                  style={{ ...inputStyle, flex: 1 }}
                />
                <input
                  type="color"
                  value={newColorHex}
                  onChange={e => setNewColorHex(e.target.value)}
                  style={{ width: 44, height: 44, border: "1px solid #DDD3C4", borderRadius: 10, padding: 2, cursor: "pointer" }}
                />
                <button
                  type="button"
                  onClick={addColor}
                  style={{
                    height: 44,
                    padding: "0 16px",
                    border: "1px solid #DDD3C4",
                    borderRadius: 10,
                    background: "#fff",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Qo'shish
                </button>
              </div>
            </div>

            {/* Specs card */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 8px rgba(43,31,23,0.04)" }}>
              <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 600 }}>Xususiyatlar</h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {specs.map((spec, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      type="text"
                      value={spec.k}
                      onChange={e => updateSpec(i, "k", e.target.value)}
                      placeholder="Kalit (masalan: Material)"
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <input
                      type="text"
                      value={spec.v}
                      onChange={e => updateSpec(i, "v", e.target.value)}
                      placeholder="Qiymat (masalan: Tabiiy charm)"
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <button type="button" onClick={() => removeSpec(i)} style={{ width: 44, height: 44, border: "1px solid #F6E3DC", borderRadius: 10, background: "#F6E3DC", color: "#A83A22", cursor: "pointer", fontSize: 18, fontWeight: 700 }}>
                      x
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addSpec}
                style={{
                  marginTop: 12,
                  padding: "10px 16px",
                  border: "1px dashed #DDD3C4",
                  borderRadius: 10,
                  background: "transparent",
                  fontSize: 14,
                  color: "#6B5A4C",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                + Xususiyat qo'shish
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Image upload */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 8px rgba(43,31,23,0.04)" }}>
              <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 600 }}>Rasm</h3>

              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: "100%",
                  height: 200,
                  border: "2px dashed #DDD3C4",
                  borderRadius: 12,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  background: imagePreview ? `url(${imagePreview}) center/cover` : "#F9F7F4",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {!imagePreview && (
                  <>
                    <svg width="32" height="32" fill="none" stroke="#8B7561" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    <span style={{ marginTop: 8, fontSize: 13, color: "#6B5A4C" }}>Rasm yuklash uchun bosing</span>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
              {imagePreview && (
                <button
                  type="button"
                  onClick={() => { setImagePreview(""); setForm(prev => ({ ...prev, image: "" })); }}
                  style={{ marginTop: 8, padding: "6px 12px", border: "1px solid #F6E3DC", borderRadius: 8, background: "#F6E3DC", color: "#A83A22", fontSize: 13, cursor: "pointer" }}
                >
                  Rasmni o'chirish
                </button>
              )}
            </div>

            {/* Tag */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 8px rgba(43,31,23,0.04)" }}>
              <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 600 }}>Tag (yorliq)</h3>
              <select
                value={form.tag}
                onChange={e => handleChange("tag", e.target.value)}
                style={inputStyle}
              >
                <option value="">Tanlang (ixtiyoriy)</option>
                {tags.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                type="submit"
                style={{
                  width: "100%",
                  height: 48,
                  border: "none",
                  borderRadius: 10,
                  background: "var(--accent)",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Saqlash
              </button>
              <button
                type="button"
                onClick={() => router.push("/admin/mahsulotlar")}
                style={{
                  width: "100%",
                  height: 48,
                  border: "1px solid #DDD3C4",
                  borderRadius: 10,
                  background: "#fff",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                  color: "#2B1F17",
                }}
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirm(true)}
                style={{
                  width: "100%",
                  height: 48,
                  border: "1px solid #F6E3DC",
                  borderRadius: 10,
                  background: "#F6E3DC",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                  color: "#A83A22",
                }}
              >
                O'chirish
              </button>
            </div>
          </div>
        </div>
      </form>

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
                onClick={() => setDeleteConfirm(false)}
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
                onClick={handleDelete}
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

      <style>{`
        @media (max-width: 868px) {
          .admin-form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
