"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { useSite, telHref } from "@/lib/site";

export default function AloqaPage() {
  const { t } = useI18n();
  const { settings, loading } = useSite();

  const items = [
    settings.contactPhone && {
      key: "phone",
      label: t("contact.phone"),
      value: settings.contactPhone,
      href: telHref(settings.contactPhone),
      external: false,
      icon: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />,
    },
    settings.telegram && {
      key: "telegram",
      label: t("contact.telegram"),
      value: settings.telegram.replace(/^https?:\/\/(t\.me\/)?/, "@").replace("@@", "@"),
      href: settings.telegram,
      external: true,
      icon: <path d="m22 2-7 20-4-9-9-4 20-7Z" />,
    },
    settings.instagram && {
      key: "instagram",
      label: t("contact.instagram"),
      value: settings.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, "@").replace(/\/$/, ""),
      href: settings.instagram,
      external: true,
      icon: (
        <>
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
        </>
      ),
    },
    settings.address && {
      key: "address",
      label: t("contact.address"),
      value: settings.address,
      href: "",
      external: false,
      icon: (
        <>
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </>
      ),
    },
    settings.workHours && {
      key: "hours",
      label: t("contact.hours"),
      value: settings.workHours,
      href: "",
      external: false,
      icon: (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </>
      ),
    },
  ].filter(Boolean) as { key: string; label: string; value: string; href: string; external: boolean; icon: React.ReactNode }[];

  return (
    <div style={{ marginTop: 16 }}>
      <div className="panel fade-up" style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 700, letterSpacing: "-0.015em" }}>
          {t("contact.title")}
        </h1>
        <p style={{ margin: "8px 0 0", fontSize: 15, color: "var(--text-muted)", lineHeight: 1.6, maxWidth: 520 }}>
          {t("contact.desc")}
        </p>
      </div>

      {items.length > 0 ? (
        <div className="grid-contact fade-up delay-1">
          {items.map((item) => {
            const body = (
              <>
                <span
                  style={{
                    width: 44, height: 44, borderRadius: 12, background: "var(--accent-tint)",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    {item.icon}
                  </svg>
                </span>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 12.5, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-faint)", marginBottom: 4 }}>
                    {item.label}
                  </span>
                  <span style={{ display: "block", fontSize: 16, fontWeight: 600, color: "var(--ink)", wordBreak: "break-word" }}>
                    {item.value}
                  </span>
                </span>
              </>
            );

            const style: React.CSSProperties = { display: "flex", gap: 14, alignItems: "center" };

            return item.href ? (
              <a
                key={item.key}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="panel link-card"
                style={style}
              >
                {body}
              </a>
            ) : (
              <div key={item.key} className="panel" style={style}>
                {body}
              </div>
            );
          })}
        </div>
      ) : (
        !loading && (
          <div className="empty-state fade-in">
            <div className="empty-title">{t("contact.empty")}</div>
          </div>
        )
      )}

      <div style={{ marginTop: 20 }}>
        <Link
          href="/hamkorlik"
          className="btn-outline"
          style={{
            display: "inline-flex", alignItems: "center", height: 46, padding: "0 20px",
            border: "1px solid var(--border)", background: "var(--bg-surface)", borderRadius: 12,
            fontSize: 14.5, fontWeight: 600, color: "var(--ink)",
          }}
        >
          {t("partner.title")} &rarr;
        </Link>
      </div>
    </div>
  );
}
