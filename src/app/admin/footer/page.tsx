"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/lib/admin-store";
import type { FooterSection } from "@/lib/api";

export default function AdminFooterPage() {
  const { footer, saveFooter } = useAdmin();
  const [sections, setSections] = useState<FooterSection[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setSections(footer.map((s) => ({ ...s, links: s.links.map((l) => ({ ...l })) })));
  }, [footer]);

  const touch = () => { setSaved(false); setError(""); };

  const updateSection = (i: number, patch: Partial<FooterSection>) => {
    setSections((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
    touch();
  };

  const updateLink = (si: number, li: number, patch: Partial<FooterSection["links"][number]>) => {
    setSections((prev) =>
      prev.map((s, idx) =>
        idx === si ? { ...s, links: s.links.map((l, j) => (j === li ? { ...l, ...patch } : l)) } : s
      )
    );
    touch();
  };

  const addSection = () => {
    setSections((prev) => [...prev, { title: "Yangi bo'lim", visible: true, links: [] }]);
    touch();
  };

  const removeSection = (i: number) => {
    setSections((prev) => prev.filter((_, idx) => idx !== i));
    touch();
  };

  const moveSection = (i: number, dir: -1 | 1) => {
    setSections((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
    touch();
  };

  const addLink = (si: number) => {
    setSections((prev) =>
      prev.map((s, idx) => (idx === si ? { ...s, links: [...s.links, { label: "", url: "#", visible: true }] } : s))
    );
    touch();
  };

  const removeLink = (si: number, li: number) => {
    setSections((prev) =>
      prev.map((s, idx) => (idx === si ? { ...s, links: s.links.filter((_, j) => j !== li) } : s))
    );
    touch();
  };

  const moveLink = (si: number, li: number, dir: -1 | 1) => {
    setSections((prev) =>
      prev.map((s, idx) => {
        if (idx !== si) return s;
        const links = [...s.links];
        const j = li + dir;
        if (j < 0 || j >= links.length) return s;
        [links[li], links[j]] = [links[j], links[li]];
        return { ...s, links };
      })
    );
    touch();
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await saveFooter(sections);
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
      <h1 style={{ fontSize: 28, margin: "0 0 8px", fontWeight: 700 }}>Footer menyulari</h1>
      <p style={{ margin: "0 0 24px", fontSize: 14.5, color: "var(--text-muted)", maxWidth: 680 }}>
        Bo&apos;lim nomlari, havolalar va ularning tartibi shu yerdan boshqariladi. Havola sifatida ichki sahifa
        (masalan <code>/katalog?category=sumkalar</code>) yoki to&apos;liq URL yozish mumkin. <code>#</code> qoldirilsa,
        havola saytda oddiy matn sifatida ko&apos;rinadi.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {sections.map((section, si) => (
          <div
            key={si}
            style={{
              background: "var(--bg-surface)", borderRadius: 16, padding: 20,
              border: "1px solid var(--border-soft)", boxShadow: "var(--shadow-sm)",
              opacity: section.visible === false ? 0.6 : 1,
            }}
          >
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap", marginBottom: 16 }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <label className="field-label">Bo&apos;lim nomi</label>
                <input
                  className="field-input"
                  value={section.title}
                  onChange={(e) => updateSection(si, { title: e.target.value })}
                  placeholder="Do'kon"
                />
              </div>

              <IconBtn label="Yuqoriga" onClick={() => moveSection(si, -1)} disabled={si === 0}>↑</IconBtn>
              <IconBtn label="Pastga" onClick={() => moveSection(si, 1)} disabled={si === sections.length - 1}>↓</IconBtn>
              <ToggleBtn
                active={section.visible !== false}
                onClick={() => updateSection(si, { visible: section.visible === false })}
              />
              <IconBtn label="Bo'limni o'chirish" onClick={() => removeSection(si)} danger>&times;</IconBtn>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {section.links.map((link, li) => (
                <div
                  key={li}
                  style={{
                    display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap",
                    padding: 12, borderRadius: 12, background: "var(--bg-fill-soft)",
                    opacity: link.visible === false ? 0.6 : 1,
                  }}
                >
                  <input
                    className="field-input"
                    style={{ flex: "1 1 160px", height: 40 }}
                    value={link.label}
                    onChange={(e) => updateLink(si, li, { label: e.target.value })}
                    placeholder="Link nomi"
                  />
                  <input
                    className="field-input"
                    style={{ flex: "2 1 220px", height: 40 }}
                    value={link.url}
                    onChange={(e) => updateLink(si, li, { url: e.target.value })}
                    placeholder="/katalog yoki https://..."
                  />
                  <IconBtn label="Yuqoriga" onClick={() => moveLink(si, li, -1)} disabled={li === 0} small>↑</IconBtn>
                  <IconBtn label="Pastga" onClick={() => moveLink(si, li, 1)} disabled={li === section.links.length - 1} small>↓</IconBtn>
                  <ToggleBtn
                    small
                    active={link.visible !== false}
                    onClick={() => updateLink(si, li, { visible: link.visible === false })}
                  />
                  <IconBtn label="O'chirish" onClick={() => removeLink(si, li)} danger small>&times;</IconBtn>
                </div>
              ))}

              <button
                type="button"
                onClick={() => addLink(si)}
                style={{
                  alignSelf: "flex-start", height: 38, padding: "0 16px", borderRadius: 10,
                  border: "1px dashed var(--border-hover)", background: "transparent",
                  color: "var(--text-muted)", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                }}
              >
                + Havola qo&apos;shish
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addSection}
          style={{
            alignSelf: "flex-start", height: 44, padding: "0 20px", borderRadius: 11,
            border: "1px dashed var(--border-hover)", background: "transparent",
            color: "var(--ink)", fontSize: 14.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          }}
        >
          + Bo&apos;lim qo&apos;shish
        </button>

        {error && (
          <div style={{ background: "var(--danger-bg)", color: "var(--danger)", borderRadius: 10, padding: "12px 16px", fontSize: 14 }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button
            onClick={handleSave}
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
    </div>
  );
}

function IconBtn({
  children, onClick, label, disabled, danger, small,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  disabled?: boolean;
  danger?: boolean;
  small?: boolean;
}) {
  const size = small ? 40 : 46;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      style={{
        width: size, height: size, flexShrink: 0, borderRadius: 10,
        border: "1px solid var(--border)", background: "var(--bg-surface)",
        color: danger ? "var(--danger)" : "var(--ink)",
        fontSize: small ? 15 : 17, cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.35 : 1, fontFamily: "inherit",
      }}
    >
      {children}
    </button>
  );
}

function ToggleBtn({ active, onClick, small }: { active: boolean; onClick: () => void; small?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={active ? "Saytda ko'rinadi — yashirish" : "Yashirilgan — ko'rsatish"}
      aria-label={active ? "Yashirish" : "Ko'rsatish"}
      style={{
        height: small ? 40 : 46, padding: "0 14px", flexShrink: 0, borderRadius: 10,
        border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
        background: active ? "var(--accent-tint)" : "var(--bg-surface)",
        color: active ? "var(--accent)" : "var(--text-muted)",
        fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit",
      }}
    >
      {active ? "Ko'rinadi" : "Yashirin"}
    </button>
  );
}
