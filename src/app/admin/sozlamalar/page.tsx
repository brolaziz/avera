"use client";

import { useState, useEffect } from "react";
import { useAdmin, type FullSiteSettings } from "@/lib/admin-store";
type SiteSettings = FullSiteSettings;

const defaultPayment = { cardNumber: "", cardOwner: "", telegramUsername: "" };

export default function SettingsPage() {
  const { settings, updateSettings } = useAdmin();
  const [form, setForm] = useState<SiteSettings>(() => ({
    ...settings,
    payment: { ...defaultPayment, ...(settings.payment || {}) },
  }));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm({
      ...settings,
      payment: { ...defaultPayment, ...(settings.payment || {}) },
    });
  }, [settings]);

  const handleChange = (field: keyof SiteSettings, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handlePaymentChange = (field: keyof SiteSettings["payment"], value: string) => {
    setForm(prev => ({
      ...prev,
      payment: { ...defaultPayment, ...(prev.payment || {}), [field]: value },
    }));
    setSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

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
      <h1 style={{ fontSize: 28, margin: "0 0 28px", fontWeight: 700 }}>
        Sozlamalar
      </h1>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 24, alignItems: "start" }} className="admin-form-grid">
          {/* Settings form */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Payment settings */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 8px rgba(43,31,23,0.04)", border: "2px solid var(--accent-tint)" }}>
              <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="20" height="20" fill="none" stroke="var(--accent)" strokeWidth={2} viewBox="0 0 24 24">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
                To'lov sozlamalari
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#4A382C", marginBottom: 6 }}>Karta raqami</label>
                  <input
                    type="text"
                    value={form.payment?.cardNumber ?? ""}
                    onChange={e => handlePaymentChange("cardNumber", e.target.value)}
                    placeholder="8600 1234 5678 9012"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#4A382C", marginBottom: 6 }}>Karta egasi (ixtiyoriy)</label>
                  <input
                    type="text"
                    value={form.payment?.cardOwner ?? ""}
                    onChange={e => handlePaymentChange("cardOwner", e.target.value)}
                    placeholder="AVERA SHOP"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#4A382C", marginBottom: 6 }}>Telegram username (chek yuborish uchun)</label>
                  <input
                    type="text"
                    value={form.payment?.telegramUsername ?? ""}
                    onChange={e => handlePaymentChange("telegramUsername", e.target.value)}
                    placeholder="@avera_admin"
                    style={inputStyle}
                  />
                  <p style={{ margin: "6px 0 0", fontSize: 12, color: "#8B7561" }}>
                    Mijozlar chekni shu akkauntga yuboradi
                  </p>
                </div>
              </div>
            </div>

            {/* Hero section settings */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 8px rgba(43,31,23,0.04)" }}>
              <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 600 }}>Bosh sahifa (Hero)</h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#4A382C", marginBottom: 6 }}>Hero sarlavhasi</label>
                  <input
                    type="text"
                    value={form.heroTitle}
                    onChange={e => handleChange("heroTitle", e.target.value)}
                    placeholder="Tabiiy charm sumkalar kolleksiyasi"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#4A382C", marginBottom: 6 }}>Chegirma foizi (%)</label>
                  <input
                    type="text"
                    value={form.heroDiscount}
                    onChange={e => handleChange("heroDiscount", e.target.value)}
                    placeholder="20"
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* Delivery settings */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 8px rgba(43,31,23,0.04)" }}>
              <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 600 }}>Yetkazish</h3>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#4A382C", marginBottom: 6 }}>Bepul yetkazish minimal summasi (UZS)</label>
                <input
                  type="number"
                  value={form.freeDeliveryMin}
                  onChange={e => handleChange("freeDeliveryMin", parseInt(e.target.value) || 0)}
                  placeholder="500000"
                  style={inputStyle}
                />
                <p style={{ margin: "6px 0 0", fontSize: 12, color: "#8B7561" }}>
                  Buyurtma summasi shu miqdordan oshsa, yetkazish bepul bo'ladi
                </p>
              </div>
            </div>

            {/* Contact settings */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 8px rgba(43,31,23,0.04)" }}>
              <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 600 }}>Aloqa ma'lumotlari</h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#4A382C", marginBottom: 6 }}>Telefon raqam</label>
                  <input
                    type="text"
                    value={form.contactPhone}
                    onChange={e => handleChange("contactPhone", e.target.value)}
                    placeholder="+998 90 123 45 67"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#4A382C", marginBottom: 6 }}>Telegram</label>
                  <input
                    type="text"
                    value={form.telegram}
                    onChange={e => handleChange("telegram", e.target.value)}
                    placeholder="https://t.me/avera"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#4A382C", marginBottom: 6 }}>Instagram</label>
                  <input
                    type="text"
                    value={form.instagram}
                    onChange={e => handleChange("instagram", e.target.value)}
                    placeholder="https://instagram.com/avera"
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* Save button */}
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <button
                type="submit"
                style={{
                  padding: "12px 32px",
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
              {saved && (
                <span style={{ fontSize: 14, color: "#4C6B3C", fontWeight: 500 }}>
                  Sozlamalar saqlandi!
                </span>
              )}
            </div>
          </div>

          {/* Preview */}
          <div style={{ position: "sticky", top: 32 }}>
            <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 8px rgba(43,31,23,0.04)" }}>
              <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 600 }}>Ko'rinish (oldindan ko'rish)</h3>

              {/* Payment preview */}
              <div style={{
                background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
                borderRadius: 12, padding: 20, marginBottom: 16, color: "#fff",
              }}>
                <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 6, textTransform: "uppercase" }}>Karta</div>
                <div style={{ fontSize: 16, fontFamily: "monospace", letterSpacing: "0.06em", marginBottom: 8 }}>
                  {form.payment?.cardNumber || "—"}
                </div>
                <div style={{ fontSize: 13, color: "#CBD5E1" }}>{form.payment?.cardOwner || "—"}</div>
                <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 10 }}>
                  Chek yuborish: {form.payment?.telegramUsername || "—"}
                </div>
              </div>

              {/* Hero preview */}
              <div style={{
                background: "linear-gradient(135deg, #2B1F17 0%, #4A382C 100%)",
                borderRadius: 12, padding: 24, marginBottom: 16,
              }}>
                <div style={{ fontWeight: 700, fontSize: 20, color: "#fff", lineHeight: 1.2, marginBottom: 12 }}>
                  {form.heroTitle || "Sarlavha"}
                </div>
                {form.heroDiscount && (
                  <div style={{
                    display: "inline-block", padding: "6px 14px",
                    background: "var(--accent)", color: "#fff", borderRadius: 8,
                    fontSize: 13, fontWeight: 600,
                  }}>
                    -{form.heroDiscount}% chegirma
                  </div>
                )}
              </div>

              {/* Contact preview */}
              <div style={{ fontSize: 13, color: "#6B5A4C" }}>
                <div style={{ marginBottom: 8 }}><strong>Telefon:</strong> {form.contactPhone || "—"}</div>
                <div style={{ marginBottom: 8 }}><strong>Telegram:</strong> {form.telegram || "—"}</div>
                <div style={{ marginBottom: 8 }}><strong>Instagram:</strong> {form.instagram || "—"}</div>
                <div><strong>Bepul yetkazish:</strong> {form.freeDeliveryMin ? form.freeDeliveryMin.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so'mdan" : "—"}</div>
              </div>
            </div>
          </div>
        </div>
      </form>

      <style>{`
        @media (max-width: 868px) {
          .admin-form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
