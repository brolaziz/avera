"use client";

import { useState, useEffect } from "react";
import { useAdmin, defaultSettings, type FullSiteSettings } from "@/lib/admin-store";
import { ImageUpload } from "@/components/ImageUpload";

export default function SettingsPage() {
  const { settings, updateSettings } = useAdmin();
  const [form, setForm] = useState<FullSiteSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm({ ...defaultSettings, ...settings, payment: { ...defaultSettings.payment, ...settings.payment } });
  }, [settings]);

  const set = (field: keyof Omit<FullSiteSettings, "payment">) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = field === "freeDeliveryMin" ? parseInt(e.target.value) || 0 : e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
      setSaved(false);
    };

  const setPayment = (field: keyof FullSiteSettings["payment"]) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, payment: { ...prev.payment, [field]: e.target.value } }));
      setSaved(false);
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await updateSettings(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Saqlab bo'lmadi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: 28, margin: "0 0 8px", fontWeight: 700 }}>Sozlamalar</h1>
      <p style={{ margin: "0 0 28px", fontSize: 14.5, color: "var(--text-muted)", maxWidth: 640 }}>
        Bu yerdagi barcha ma&apos;lumotlar bazaga saqlanadi va mijoz saytida darhol ko&apos;rinadi.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="admin-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 24, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Bosh sahifa banneri */}
            <Card title="Bosh sahifa banneri">
              <ImageUpload
                label="Banner rasmi"
                value={form.heroImage ? [form.heroImage] : []}
                onChange={(urls) => { setForm((p) => ({ ...p, heroImage: urls[0] || "" })); setSaved(false); }}
                max={1}
                previewHeight={200}
                hint="Tavsiya etiladi: keng (landscape) rasm, 4 MB gacha. Rasm o'chirilsa, banner sokin gradient bilan ko'rinadi."
              />

              <Field label="Kichik yozuv (badge)" value={form.heroBadge} onChange={set("heroBadge")} placeholder="Haftaning tanlovi" />
              <Field label="Sarlavha" value={form.heroTitle} onChange={set("heroTitle")} placeholder="Tabiiy charm sumkalar kolleksiyasi" />
              <Field label="Qo'shimcha matn" value={form.heroSubtitle} onChange={set("heroSubtitle")} placeholder="Toshkent bo'ylab 24 soatda yetkazamiz" textarea />
              <Field label="Chegirma (masalan: 30)" value={form.heroDiscount} onChange={set("heroDiscount")} placeholder="30" hint="Bo'sh qoldirilsa, sarlavhada chegirma yozuvi ko'rinmaydi." />
              <Field label="Tugma matni" value={form.heroCtaText} onChange={set("heroCtaText")} placeholder="Xarid qilish" />
              <Field label="Tugma havolasi" value={form.heroCtaLink} onChange={set("heroCtaLink")} placeholder="/katalog" hint="Ichki sahifa (/katalog) yoki to'liq havola bo'lishi mumkin." />
            </Card>

            {/* Mahsulotlar bo'limi */}
            <Card title="Mahsulotlar bo'limi">
              <Field label="Bo'lim sarlavhasi" value={form.featuredTitle} onChange={set("featuredTitle")} placeholder="Mashhur mahsulotlar" />
            </Card>

            {/* To'lov */}
            <Card title="To'lov sozlamalari" accent>
              <Field label="Karta raqami" value={form.payment.cardNumber} onChange={setPayment("cardNumber")} placeholder="8600 1234 5678 9012" />
              <Field label="Karta egasi" value={form.payment.cardOwner} onChange={setPayment("cardOwner")} placeholder="AVERA SHOP" />
              <Field label="Telegram username (chek yuborish uchun)" value={form.payment.telegramUsername} onChange={setPayment("telegramUsername")} placeholder="@avera_admin" hint="Mijozlar chekni shu akkauntga yuboradi" />
            </Card>

            {/* Yetkazish */}
            <Card title="Yetkazish">
              <Field
                label="Bepul yetkazish minimal summasi (so'm)"
                value={String(form.freeDeliveryMin)}
                onChange={set("freeDeliveryMin")}
                type="number"
                placeholder="500000"
                hint="Buyurtma summasi shu miqdordan oshsa, yetkazish bepul bo'ladi"
              />
            </Card>

            {/* Aloqa */}
            <Card title="Aloqa ma'lumotlari">
              <Field label="Telefon raqam" value={form.contactPhone} onChange={set("contactPhone")} placeholder="+998 90 123 45 67" hint="Footer va Aloqa sahifasida shu raqam ko'rinadi." />
              <Field label="Telegram havolasi" value={form.telegram} onChange={set("telegram")} placeholder="https://t.me/avera" />
              <Field label="Instagram havolasi" value={form.instagram} onChange={set("instagram")} placeholder="https://instagram.com/avera" />
              <Field label="Manzil" value={form.address} onChange={set("address")} placeholder="Toshkent sh., Amir Temur ko'chasi 1" />
              <Field label="Ish vaqti" value={form.workHours} onChange={set("workHours")} placeholder="Dush–Shan: 10:00 – 20:00" />
            </Card>

            {/* Footer matni */}
            <Card title="Footer">
              <Field label="Do'kon haqida qisqacha" value={form.footerAbout} onChange={set("footerAbout")} placeholder="AVERA — original charm sumkalar." textarea />
              <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)" }}>
                Footer menyulari alohida &laquo;Footer&raquo; bo&apos;limida boshqariladi.
              </p>
            </Card>

            {error && (
              <div style={{ background: "var(--danger-bg)", color: "var(--danger)", borderRadius: 10, padding: "12px 16px", fontSize: 14 }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <button
                type="submit"
                disabled={saving}
                className="btn-accent"
                style={{
                  padding: "13px 32px", border: "none", borderRadius: 10, background: "var(--accent)",
                  color: "#fff", fontSize: 15, fontWeight: 600, cursor: saving ? "default" : "pointer",
                  opacity: saving ? 0.7 : 1, fontFamily: "inherit",
                }}
              >
                {saving ? "Saqlanmoqda..." : "Saqlash"}
              </button>
              {saved && <span style={{ fontSize: 14, color: "var(--success)", fontWeight: 600 }}>Saqlandi!</span>}
            </div>
          </div>

          {/* Oldindan ko'rish */}
          <div style={{ position: "sticky", top: 24 }}>
            <Card title="Oldindan ko'rish">
              <div
                style={{
                  position: "relative", borderRadius: 14, overflow: "hidden", minHeight: 190,
                  display: "flex", alignItems: "flex-end",
                  background: form.heroImage ? "var(--ink)" : "linear-gradient(135deg, #3A2E28 0%, #2A211D 55%, #4A1B26 100%)",
                }}
              >
                {form.heroImage && (
                  <>
                    <img src={form.heroImage} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(42,33,29,0.15), rgba(42,33,29,0.82))" }} />
                  </>
                )}
                <div style={{ position: "relative", padding: 20, width: "100%" }}>
                  {form.heroBadge && (
                    <div style={{ display: "inline-block", fontSize: 10.5, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gold-soft)", border: "1px solid rgba(233,220,200,0.3)", borderRadius: 999, padding: "4px 10px", marginBottom: 10 }}>
                      {form.heroBadge}
                    </div>
                  )}
                  <div style={{ fontWeight: 700, fontSize: 19, color: "#fff", lineHeight: 1.2 }}>
                    {form.heroTitle || "Sarlavha"}
                    {form.heroDiscount && <span style={{ color: "var(--gold)" }}> {form.heroDiscount}%</span>}
                  </div>
                  {form.heroSubtitle && (
                    <div style={{ fontSize: 12.5, color: "rgba(245,239,230,0.8)", marginTop: 6, lineHeight: 1.5 }}>
                      {form.heroSubtitle}
                    </div>
                  )}
                  {form.heroCtaText && (
                    <div style={{ display: "inline-block", marginTop: 12, background: "var(--accent)", color: "#fff", borderRadius: 9, padding: "8px 16px", fontSize: 12.5, fontWeight: 600 }}>
                      {form.heroCtaText}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ fontSize: 13.5, color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: 7 }}>
                <PreviewRow label="Telefon" value={form.contactPhone} />
                <PreviewRow label="Telegram" value={form.telegram} />
                <PreviewRow label="Instagram" value={form.instagram} />
                <PreviewRow label="Manzil" value={form.address} />
                <PreviewRow label="Ish vaqti" value={form.workHours} />
                <PreviewRow label="Karta" value={form.payment.cardNumber} />
                <PreviewRow
                  label="Bepul yetkazish"
                  value={form.freeDeliveryMin ? `${form.freeDeliveryMin.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} so'mdan` : ""}
                />
              </div>
            </Card>
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

function Card({ title, children, accent }: { title: string; children: React.ReactNode; accent?: boolean }) {
  return (
    <div
      style={{
        background: "var(--bg-surface)",
        borderRadius: 16,
        padding: 24,
        border: accent ? "1.5px solid var(--accent-tint-strong)" : "1px solid var(--border-soft)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <h3 style={{ margin: "0 0 18px", fontSize: 16, fontWeight: 700 }}>{title}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{children}</div>
    </div>
  );
}

function Field({
  label, value, onChange, placeholder, hint, textarea, type = "text",
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  hint?: string;
  textarea?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {textarea ? (
        <textarea className="field-input" value={value} onChange={onChange} placeholder={placeholder} style={{ minHeight: 90 }} />
      ) : (
        <input className="field-input" type={type} value={value} onChange={onChange} placeholder={placeholder} />
      )}
      {hint && <p style={{ margin: "6px 0 0", fontSize: 12.5, color: "var(--text-soft)" }}>{hint}</p>}
    </div>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
      <strong style={{ color: "var(--ink-600)", flexShrink: 0 }}>{label}:</strong>
      <span style={{ textAlign: "right", wordBreak: "break-word" }}>{value || "—"}</span>
    </div>
  );
}
