"use client";

import { useRef, useState } from "react";
import { api } from "@/lib/api";
import { optimizeImage } from "@/lib/image-resize";

interface ImageUploadProps {
  /** Hozirgi rasm URL'lari. Bitta rasm uchun ham massiv beriladi. */
  value: string[];
  onChange: (urls: string[]) => void;
  /** Nechta rasm saqlanishi mumkin. 1 bo'lsa — yangi rasm eskisini almashtiradi. */
  max?: number;
  label?: string;
  hint?: string;
  /** Oldindan ko'rish balandligi. */
  previewHeight?: number;
}

export function ImageUpload({ value, onChange, max = 1, label, hint, previewHeight = 160 }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError("");

    try {
      const room = max - (max === 1 ? 0 : value.length);
      const chosen = Array.from(files).slice(0, Math.max(1, room));
      // Yuborishdan oldin har bir rasm kichraytiriladi — sayt mobil internetda ham tez ochilsin.
      const uploaded = await Promise.all(
        chosen.map(async (f) => api.uploadImage(await optimizeImage(f)))
      );
      const urls = uploaded.map((u) => u.url);
      onChange(max === 1 ? urls.slice(0, 1) : [...value, ...urls].slice(0, max));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Rasmni yuklab bo'lmadi");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = (url: string) => onChange(value.filter((u) => u !== url));

  const full = max > 1 && value.length >= max;

  return (
    <div>
      {label && <label className="field-label">{label}</label>}

      {value.length > 0 && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
          {value.map((url) => (
            <div
              key={url}
              style={{
                position: "relative",
                width: max === 1 ? "100%" : 110,
                height: max === 1 ? previewHeight : 110,
                borderRadius: 12,
                overflow: "hidden",
                border: "1px solid var(--border)",
                background: "var(--bg-fill)",
              }}
            >
              <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <button
                type="button"
                onClick={() => remove(url)}
                aria-label="O'chirish"
                style={{
                  position: "absolute", top: 6, right: 6, width: 28, height: 28, borderRadius: 8,
                  border: "none", background: "rgba(42,33,29,0.72)", color: "#fff",
                  fontSize: 16, lineHeight: 1, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        multiple={max > 1}
        onChange={(e) => handleFiles(e.target.files)}
        style={{ display: "none" }}
      />

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy || full}
          className="btn-outline"
          style={{
            height: 42, padding: "0 18px", border: "1px solid var(--border)",
            background: "var(--bg-surface)", borderRadius: 10, fontSize: 14, fontWeight: 600,
            color: "var(--ink)", cursor: busy || full ? "default" : "pointer",
            opacity: busy || full ? 0.6 : 1, fontFamily: "inherit",
            display: "inline-flex", alignItems: "center", gap: 8,
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 16V4M8 8l4-4 4 4" />
            <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
          </svg>
          {busy ? "Yuklanmoqda..." : value.length > 0 && max === 1 ? "Rasmni almashtirish" : "Rasm yuklash"}
        </button>

        {value.length > 0 && max === 1 && (
          <button
            type="button"
            onClick={() => onChange([])}
            style={{
              height: 42, padding: "0 16px", border: "1px solid var(--border)",
              background: "transparent", borderRadius: 10, fontSize: 14, fontWeight: 600,
              color: "var(--danger)", cursor: "pointer", fontFamily: "inherit",
            }}
          >
            O'chirish
          </button>
        )}
      </div>

      {hint && <p style={{ margin: "8px 0 0", fontSize: 12.5, color: "var(--text-soft)" }}>{hint}</p>}
      {error && <p style={{ margin: "8px 0 0", fontSize: 13, color: "var(--danger)" }}>{error}</p>}
    </div>
  );
}
