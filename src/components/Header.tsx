"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export function Header() {
  const { cartCount } = useStore();
  const { t } = useI18n();
  const router = useRouter();
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data))
      .catch(() => {});
  }, []);

  const navItems = [
    { key: "nav.catalog", href: "/katalog" },
    { key: "nav.search_link", href: "/qidiruv" },
  ];

  return (
    <header
      className="site-header"
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRadius: 16,
        padding: "12px 16px",
        boxShadow: "0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)",
        position: "sticky",
        top: 12,
        zIndex: 100,
        border: "1px solid rgba(226,232,240,0.6)",
      }}
    >
      {/* Desktop layout */}
      <div className="header-desktop" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Link href="/" className="header-logo" style={{ fontSize: 22, fontWeight: 500, fontFamily: "var(--font-brand)", letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "#0F172A", flexShrink: 0 }}>
          <span style={{ width: 26, height: 26, borderRadius: 8, background: "linear-gradient(135deg, var(--accent), var(--accent-hover))", display: "inline-block", flexShrink: 0 }} />
          <span className="header-logo-text">AVERA</span>
        </Link>

        <nav className="header-nav">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="nav-link"
              style={{ padding: "8px 13px", borderRadius: 10, fontSize: 14, fontWeight: 500, color: "#64748B", textDecoration: "none" }}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div
          onClick={() => router.push("/qidiruv")}
          className="search-field header-search"
          style={{ cursor: "pointer" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <span style={{ fontSize: 14, color: "#94A3B8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t("nav.search")}</span>
        </div>

        <div className="header-actions" style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0, marginLeft: "auto" }}>
          <LanguageToggle />

          <Link
            href="/profil"
            className="btn-outline btn-profile-text"
            style={{ height: 42, padding: "0 16px", border: "1px solid #E2E8F0", background: "#fff", borderRadius: 12, fontSize: 14, fontWeight: 600, color: "#0F172A", alignItems: "center", textDecoration: "none" }}
          >
            {t("nav.profile")}
          </Link>

          <Link
            href="/profil"
            className="btn-outline btn-profile-icon"
            style={{ width: 42, height: 42, border: "1px solid #E2E8F0", background: "#fff", borderRadius: 12, alignItems: "center", justifyContent: "center", textDecoration: "none" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>

          <Link
            href="/savat"
            className="btn-accent"
            style={{ height: 42, padding: "0 14px", border: "none", background: "var(--accent)", color: "#fff", borderRadius: 12, fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", textDecoration: "none", whiteSpace: "nowrap" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: cartCount > 0 ? 6 : 0, flexShrink: 0 }}>
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartCount > 0 && <span>{cartCount}</span>}
          </Link>
        </div>
      </div>

      {/* Mobile layout — two rows */}
      <div className="header-mobile" style={{ display: "none" }}>
        {/* Row 1: Logo + Hamburger */}
        <div className="header-mobile-row1" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ fontSize: 22, fontWeight: 500, fontFamily: "var(--font-brand)", letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "#0F172A" }}>
            <span style={{ width: 26, height: 26, borderRadius: 8, background: "linear-gradient(135deg, var(--accent), var(--accent-hover))", display: "inline-block", flexShrink: 0 }} />
            <span>AVERA</span>
          </Link>

          <button
            onClick={() => setCatalogOpen(!catalogOpen)}
            aria-label="Katalog"
            style={{
              width: 40,
              height: 40,
              border: "1px solid #E2E8F0",
              background: catalogOpen ? "var(--accent-tint)" : "#fff",
              borderRadius: 10,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="20" height="20" fill="none" stroke={catalogOpen ? "var(--accent)" : "#0F172A"} strokeWidth="2" viewBox="0 0 24 24">
              {catalogOpen ? (
                <path strokeLinecap="round" d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Row 2: Search + Lang + Profile + Cart */}
        <div className="header-mobile-row2" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10, gap: 10 }}>
          <div
            onClick={() => router.push("/qidiruv")}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#F1F3F5",
              border: "1px solid transparent",
              borderRadius: 10,
              height: 40,
              padding: "0 12px",
              cursor: "pointer",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <span style={{ fontSize: 13, color: "#94A3B8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t("nav.search")}</span>
          </div>

          <LanguageToggle />

          <Link
            href="/profil"
            style={{
              width: 40,
              height: 40,
              border: "1px solid #E2E8F0",
              background: "#fff",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>

          <Link
            href="/savat"
            className="mobile-cart-btn"
            style={{
              width: 40,
              height: 40,
              border: "none",
              background: cartCount > 0 ? "var(--accent)" : "#F1F3F5",
              color: cartCount > 0 ? "#fff" : "#0F172A",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              flexShrink: 0,
              position: "relative",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartCount > 0 && (
              <span style={{
                position: "absolute",
                top: -4,
                right: -4,
                width: 18,
                height: 18,
                background: cartCount > 0 ? "#fff" : "var(--accent)",
                color: cartCount > 0 ? "var(--accent)" : "#fff",
                borderRadius: "50%",
                fontSize: 11,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid var(--accent)",
              }}>
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Catalog dropdown — categories only */}
      {catalogOpen && (
        <div
          className="catalog-dropdown"
          style={{
            width: "100%",
            display: "none",
            flexDirection: "column",
            gap: 2,
            paddingTop: 12,
            borderTop: "1px solid #E2E8F0",
            marginTop: 10,
          }}
        >
          <div style={{ padding: "4px 0 8px", fontSize: 12, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {t("nav.catalog")}
          </div>
          {categories.length > 0 ? (
            categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/katalog?category=${cat.slug}`}
                onClick={() => setCatalogOpen(false)}
                style={{
                  padding: "11px 14px",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 500,
                  color: "#0F172A",
                  textDecoration: "none",
                  display: "block",
                  transition: "background 0.15s",
                }}
              >
                {cat.name}
              </Link>
            ))
          ) : (
            <Link
              href="/katalog"
              onClick={() => setCatalogOpen(false)}
              style={{
                padding: "11px 14px",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 500,
                color: "#0F172A",
                textDecoration: "none",
                display: "block",
              }}
            >
              {t("products.all")}
            </Link>
          )}
          <Link
            href="/katalog"
            onClick={() => setCatalogOpen(false)}
            style={{
              padding: "11px 14px",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              color: "var(--accent)",
              textDecoration: "none",
              display: "block",
              marginTop: 4,
            }}
          >
            {t("products.all")} →
          </Link>
        </div>
      )}

      <style>{`
        /* Mobile: show mobile layout, hide desktop */
        @media (max-width: 868px) {
          .header-desktop { display: none !important; }
          .header-mobile { display: block !important; }
          .catalog-dropdown { display: flex !important; }
        }

        /* Desktop: show desktop layout, hide mobile */
        @media (min-width: 869px) {
          .header-desktop { display: flex !important; }
          .header-mobile { display: none !important; }
          .catalog-dropdown { display: none !important; }
        }

        /* Mobile row2 buttons uniform size */
        @media (max-width: 868px) {
          .header-mobile-row2 .lang-toggle-btn {
            height: 40px !important;
            padding: 0 10px !important;
            border-radius: 10px !important;
          }
        }

        /* Extra small phones */
        @media (max-width: 380px) {
          .header-mobile-row2 {
            gap: 6px !important;
          }
          .header-mobile-row2 .lang-toggle-btn {
            height: 36px !important;
            padding: 0 8px !important;
          }
          .header-mobile-row2 .lang-toggle-btn .lang-label {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
