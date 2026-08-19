"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { useSite, telHref, isRealLink } from "@/lib/site";

export function Footer() {
  const { t } = useI18n();
  const { settings, footer } = useSite();

  const socials = [
    settings.telegram && { label: "Telegram", href: settings.telegram },
    settings.instagram && { label: "Instagram", href: settings.instagram },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <footer className="footer-main" id="aloqa">
      <div className="footer-grid">
        <div>
          <div
            style={{
              fontSize: 22, fontWeight: 500, fontFamily: "var(--font-display)", letterSpacing: "0.06em",
              color: "#fff", display: "flex", alignItems: "center", gap: 9, marginBottom: 12,
            }}
          >
            <span style={{ width: 22, height: 22, borderRadius: 6, background: "var(--gold)", display: "inline-block", flexShrink: 0 }} />
            AVERA
          </div>
          {settings.footerAbout && (
            <div style={{ fontSize: 14, lineHeight: 1.65, maxWidth: 280 }}>{settings.footerAbout}</div>
          )}
        </div>

        {footer.map((section) => (
          <div key={section.id || section.title}>
            <div
              style={{
                fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
                color: "#fff", marginBottom: 14,
              }}
            >
              {section.title}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9, fontSize: 14 }}>
              {section.links.map((link) =>
                isRealLink(link.url) ? (
                  <Link
                    key={link.id || link.label}
                    href={link.url}
                    className="footer-link"
                    style={{ color: "inherit" }}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <span key={link.id || link.label} style={{ color: "inherit" }}>
                    {link.label}
                  </span>
                )
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} AVERA. {t("footer.rights")}</span>
        <span style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
              style={{ color: "inherit" }}
            >
              {s.label}
            </a>
          ))}
          {settings.contactPhone && (
            <a href={telHref(settings.contactPhone)} className="footer-link" style={{ color: "inherit" }}>
              {settings.contactPhone}
            </a>
          )}
        </span>
      </div>
    </footer>
  );
}
