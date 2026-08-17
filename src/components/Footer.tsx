"use client";

import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();

  const columns = [
    { title: t("footer.shop"), links: [t("footer.bags"), t("footer.backpacks"), t("footer.wallets"), t("footer.discounts")] },
    { title: t("footer.help"), links: [t("footer.delivery"), t("footer.returns"), t("footer.sizes"), t("footer.faq")] },
    { title: t("footer.company"), links: [t("footer.about"), t("footer.stores"), t("footer.partnership"), t("footer.contact")] },
  ];

  return (
    <footer
      className="footer-main"
      style={{
        marginTop: 44,
        background: "#0F172A",
        borderRadius: "24px 24px 0 0",
        color: "#94A3B8",
      }}
    >
      <div className="footer-grid">
        <div>
          <div style={{ fontSize: 22, fontWeight: 500, fontFamily: "var(--font-brand)", letterSpacing: "0.04em", color: "#fff", display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
            <span style={{ width: 24, height: 24, borderRadius: 8, background: "linear-gradient(135deg, var(--accent), var(--accent-hover))", display: "inline-block", flexShrink: 0 }} />
            AVERA
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.65, maxWidth: 280 }}>
            {t("footer.description")}
          </div>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", color: "#fff", marginBottom: 14 }}>
              {col.title}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9, fontSize: 14 }}>
              {col.links.map((link) => (
                <a key={link} href="#" className="footer-link" style={{ color: "#94A3B8", textDecoration: "none" }}>
                  {link}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <span>&copy; 2026 AVERA. {t("footer.rights")}</span>
        <span style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
          <a href="#" className="footer-link" style={{ color: "#94A3B8", textDecoration: "none" }}>Telegram</a>
          <a href="#" className="footer-link" style={{ color: "#94A3B8", textDecoration: "none" }}>Instagram</a>
          <a href="#" className="footer-link" style={{ color: "#94A3B8", textDecoration: "none" }}>+998 71 200 00 00</a>
        </span>
      </div>
    </footer>
  );
}
