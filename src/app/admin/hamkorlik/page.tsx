"use client";

import { useState } from "react";
import { useAdmin } from "@/lib/admin-store";

const STATUSES = [
  { key: "yangi", label: "Yangi" },
  { key: "korildi", label: "Ko'rildi" },
  { key: "yopildi", label: "Yopildi" },
];

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  yangi: { bg: "var(--accent-tint)", color: "var(--accent)" },
  korildi: { bg: "var(--gold-wash)", color: "#8A6B33" },
  yopildi: { bg: "var(--success-bg)", color: "var(--success)" },
};

export default function AdminPartnersPage() {
  const { partnerRequests, updatePartnerRequestStatus, deletePartnerRequest } = useAdmin();
  const [filter, setFilter] = useState("");

  const visible = filter ? partnerRequests.filter((r) => r.status === filter) : partnerRequests;

  return (
    <div>
      <h1 style={{ fontSize: 28, margin: "0 0 8px", fontWeight: 700 }}>Hamkorlik arizalari</h1>
      <p style={{ margin: "0 0 22px", fontSize: 14.5, color: "var(--text-muted)" }}>
        Saytdagi &laquo;Hamkorlik&raquo; formasi orqali kelgan arizalar.
      </p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
        <FilterChip active={!filter} onClick={() => setFilter("")}>
          Barchasi ({partnerRequests.length})
        </FilterChip>
        {STATUSES.map((s) => (
          <FilterChip key={s.key} active={filter === s.key} onClick={() => setFilter(s.key)}>
            {s.label} ({partnerRequests.filter((r) => r.status === s.key).length})
          </FilterChip>
        ))}
      </div>

      {visible.length === 0 ? (
        <div
          style={{
            background: "var(--bg-surface)", borderRadius: 16, padding: "48px 24px",
            textAlign: "center", color: "var(--text-muted)", border: "1px dashed var(--border-hover)",
          }}
        >
          Hozircha ariza yo&apos;q.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {visible.map((req) => {
            const style = STATUS_STYLE[req.status] || STATUS_STYLE.yangi;
            return (
              <div
                key={req.id}
                style={{
                  background: "var(--bg-surface)", borderRadius: 16, padding: 20,
                  border: "1px solid var(--border-soft)", boxShadow: "var(--shadow-sm)",
                }}
              >
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start", flexWrap: "wrap", marginBottom: 12 }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{req.name}</div>
                    <div style={{ fontSize: 13.5, color: "var(--text-muted)", marginTop: 4, display: "flex", gap: 14, flexWrap: "wrap" }}>
                      <a href={`tel:${req.phone.replace(/[^\d+]/g, "")}`} style={{ color: "var(--accent)" }}>
                        {req.phone}
                      </a>
                      {req.telegram && <span>{req.telegram}</span>}
                      <span>{new Date(req.createdAt).toLocaleString("uz-UZ")}</span>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: 12.5, fontWeight: 600, padding: "6px 12px", borderRadius: 9,
                      background: style.bg, color: style.color, flexShrink: 0,
                    }}
                  >
                    {STATUSES.find((s) => s.key === req.status)?.label || req.status}
                  </span>
                </div>

                {req.message && (
                  <p
                    style={{
                      margin: "0 0 14px", fontSize: 14.5, lineHeight: 1.6, color: "var(--ink-600)",
                      background: "var(--bg-fill-soft)", borderRadius: 12, padding: "12px 14px", whiteSpace: "pre-wrap",
                    }}
                  >
                    {req.message}
                  </p>
                )}

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {STATUSES.filter((s) => s.key !== req.status).map((s) => (
                    <button
                      key={s.key}
                      onClick={() => updatePartnerRequestStatus(req.id, s.key)}
                      style={{
                        height: 38, padding: "0 14px", borderRadius: 10, border: "1px solid var(--border)",
                        background: "var(--bg-surface)", fontSize: 13.5, fontWeight: 600,
                        color: "var(--ink)", cursor: "pointer", fontFamily: "inherit",
                      }}
                    >
                      {s.label} deb belgilash
                    </button>
                  ))}
                  <button
                    onClick={() => deletePartnerRequest(req.id)}
                    style={{
                      height: 38, padding: "0 14px", borderRadius: 10, border: "1px solid var(--border)",
                      background: "transparent", fontSize: 13.5, fontWeight: 600,
                      color: "var(--danger)", cursor: "pointer", marginLeft: "auto", fontFamily: "inherit",
                    }}
                  >
                    O&apos;chirish
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FilterChip({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        height: 38, padding: "0 16px", borderRadius: 999,
        border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
        background: active ? "var(--accent)" : "var(--bg-surface)",
        color: active ? "#fff" : "var(--ink)",
        fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}
