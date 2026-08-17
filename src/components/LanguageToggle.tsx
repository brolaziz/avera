"use client";

import { useState, useRef, useEffect } from "react";
import { useI18n, type Locale } from "@/lib/i18n";

const languages: { code: Locale; label: string; flag: string }[] = [
  { code: "uz", label: "O'zbekcha", flag: "\u{1F1FA}\u{1F1FF}" },
  { code: "en", label: "English", flag: "\u{1F1EC}\u{1F1E7}" },
  { code: "ru", label: "Русский", flag: "\u{1F1F7}\u{1F1FA}" },
];

export function LanguageToggle() {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = languages.find(l => l.code === locale)!;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        className="lang-toggle-btn"
        style={{
          height: 42,
          padding: "0 12px",
          border: "1px solid var(--border)",
          background: "#fff",
          borderRadius: 12,
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 18, lineHeight: 1 }}>{current.flag}</span>
        <span className="lang-label" style={{ fontSize: 13 }}>{current.code.toUpperCase()}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            background: "#fff",
            borderRadius: 14,
            boxShadow: "0 8px 24px rgba(15,23,42,0.12), 0 2px 6px rgba(15,23,42,0.06)",
            border: "1px solid var(--border)",
            padding: 6,
            zIndex: 100,
            minWidth: 160,
          }}
        >
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => { setLocale(lang.code); setOpen(false); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "10px 12px",
                border: "none",
                background: locale === lang.code ? "var(--accent-tint)" : "transparent",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: locale === lang.code ? 600 : 500,
                cursor: "pointer",
                color: locale === lang.code ? "var(--accent)" : "var(--ink)",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: 18 }}>{lang.flag}</span>
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
