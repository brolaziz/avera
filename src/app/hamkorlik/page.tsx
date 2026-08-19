"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useI18n } from "@/lib/i18n";

export default function HamkorlikPage() {
  const { t } = useI18n();
  const [form, setForm] = useState({ name: "", phone: "", telegram: "", message: "" });
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    setError("");
    try {
      await api.createPartnerRequest(form);
      setState("sent");
    } catch (err) {
      setState("idle");
      setError(err instanceof Error ? err.message : t("partner.error"));
    }
  };

  if (state === "sent") {
    return (
      <div style={{ marginTop: 16 }}>
        <div className="panel fade-up" style={{ textAlign: "center", padding: "clamp(36px, 9vw, 72px) 24px" }}>
          <div
            style={{
              width: 56, height: 56, borderRadius: "50%", background: "var(--accent-tint)",
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px",
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m5 12 5 5L20 7" />
            </svg>
          </div>
          <h1 style={{ margin: "0 0 8px", fontSize: "clamp(20px, 4.5vw, 26px)", fontWeight: 700 }}>
            {t("partner.success_title")}
          </h1>
          <p style={{ margin: 0, fontSize: 15, color: "var(--text-muted)" }}>{t("partner.success_desc")}</p>

          <Link
            href="/"
            className="btn-accent"
            style={{
              display: "inline-flex", alignItems: "center", height: 46, padding: "0 22px",
              marginTop: 24, background: "var(--accent)", color: "#fff", borderRadius: 12,
              fontSize: 14.5, fontWeight: 600,
            }}
          >
            {t("nav.home")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 16 }}>
      <div className="panel fade-up" style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 700, letterSpacing: "-0.015em" }}>
          {t("partner.title")}
        </h1>
        <p style={{ margin: "8px 0 0", fontSize: 15, color: "var(--text-muted)", lineHeight: 1.6, maxWidth: 520 }}>
          {t("partner.desc")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="panel fade-up delay-1" style={{ maxWidth: 620 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label className="field-label" htmlFor="p-name">{t("partner.name")}</label>
            <input id="p-name" className="field-input" value={form.name} onChange={set("name")} placeholder={t("partner.name_ph")} required maxLength={120} />
          </div>

          <div>
            <label className="field-label" htmlFor="p-phone">{t("partner.phone")}</label>
            <input id="p-phone" className="field-input" type="tel" value={form.phone} onChange={set("phone")} placeholder={t("partner.phone_ph")} required maxLength={40} />
          </div>

          <div>
            <label className="field-label" htmlFor="p-tg">{t("partner.telegram")}</label>
            <input id="p-tg" className="field-input" value={form.telegram} onChange={set("telegram")} placeholder={t("partner.telegram_ph")} maxLength={80} />
          </div>

          <div>
            <label className="field-label" htmlFor="p-msg">{t("partner.message")}</label>
            <textarea id="p-msg" className="field-input" value={form.message} onChange={set("message")} placeholder={t("partner.message_ph")} maxLength={2000} />
          </div>

          {error && (
            <div style={{ background: "var(--danger-bg)", color: "var(--danger)", borderRadius: 10, padding: "11px 14px", fontSize: 14 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-accent"
            disabled={state === "sending"}
            style={{
              height: 50, border: "none", borderRadius: 12, background: "var(--accent)", color: "#fff",
              fontSize: 15, fontWeight: 600, cursor: state === "sending" ? "default" : "pointer",
              opacity: state === "sending" ? 0.7 : 1,
            }}
          >
            {state === "sending" ? t("partner.sending") : t("partner.submit")}
          </button>
        </div>
      </form>
    </div>
  );
}
