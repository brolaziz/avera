"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";

export function ConfirmModal() {
  const { confirmOpen, closeConfirm } = useStore();
  const { t } = useI18n();

  if (!confirmOpen) return null;

  return (
    <>
      <div
        onClick={closeConfirm}
        style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.4)", backdropFilter: "blur(4px)", zIndex: 50 }}
      />
      <div
        style={{
          position: "fixed",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 440,
          maxWidth: "90vw",
          background: "#fff",
          borderRadius: 24,
          padding: 34,
          zIndex: 51,
          boxShadow: "0 30px 80px rgba(15,23,42,0.2)",
        }}
      >
        <span
          style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            background: "#ECFDF5",
            color: "#10B981",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            marginBottom: 20,
          }}
        >
          &#10003;
        </span>
        <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 10 }}>
          {t("confirm.title")}
        </div>
        <div style={{ fontSize: 15, lineHeight: 1.6, color: "#64748B", marginBottom: 26 }}>
          &#8470; 10482 {t("confirm.desc")}
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Link
            href="/profil"
            onClick={closeConfirm}
            style={{ flex: 1, height: 50, border: "none", background: "var(--accent)", color: "#fff", borderRadius: 14, fontSize: 15, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}
          >
            {t("confirm.orders")}
          </Link>
          <button
            onClick={closeConfirm}
            style={{ height: 50, padding: "0 22px", border: "1px solid #E2E8F0", background: "#fff", borderRadius: 14, fontSize: 15, fontWeight: 600, color: "#64748B", cursor: "pointer" }}
          >
            {t("confirm.close")}
          </button>
        </div>
      </div>
    </>
  );
}
