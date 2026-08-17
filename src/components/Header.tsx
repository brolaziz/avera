"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";

export function Header() {
  const { cartCount } = useStore();
  const { t } = useI18n();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { key: "nav.catalog", href: "/katalog" },
    { key: "nav.search_link", href: "/qidiruv" },
  ];

  return (
    <header
      className="site-header"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
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
        flexWrap: "wrap",
      }}
    >
      <Link href="/" className="header-logo" style={{ fontSize: 22, fontWeight: 300, fontFamily: "var(--font-brand)", letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "#0F172A", flexShrink: 0 }}>
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
        {/* Mobile search icon — visible only on small screens where search bar is hidden */}
        <div
          onClick={() => router.push("/qidiruv")}
          className="mobile-search-btn"
          style={{
            display: "none",
            width: 40,
            height: 40,
            border: "1px solid #E2E8F0",
            background: "#fff",
            borderRadius: 10,
            cursor: "pointer",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>

        <LanguageToggle />

        {/* Profile - full text on desktop */}
        <Link
          href="/profil"
          className="btn-outline btn-profile-text"
          style={{ height: 42, padding: "0 16px", border: "1px solid #E2E8F0", background: "#fff", borderRadius: 12, fontSize: 14, fontWeight: 600, color: "#0F172A", alignItems: "center", textDecoration: "none" }}
        >
          {t("nav.profile")}
        </Link>

        {/* Profile - icon only on mobile */}
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

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mobile-menu-btn"
          style={{
            display: "none",
            width: 42,
            height: 42,
            border: "1px solid #E2E8F0",
            background: "#fff",
            borderRadius: 12,
            cursor: "pointer",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="20" height="20" fill="none" stroke="#0F172A" strokeWidth="2" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile navigation dropdown */}
      {mobileMenuOpen && (
        <div
          className="mobile-nav-dropdown"
          style={{
            width: "100%",
            display: "none",
            flexDirection: "column",
            gap: 4,
            paddingTop: 12,
            borderTop: "1px solid #E2E8F0",
            marginTop: 8,
          }}
        >
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                padding: "12px 14px",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 500,
                color: "#0F172A",
                textDecoration: "none",
                display: "block",
              }}
            >
              {t(item.key)}
            </Link>
          ))}
          <div
            onClick={() => { router.push("/qidiruv"); setMobileMenuOpen(false); }}
            style={{
              padding: "12px 14px",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 500,
              color: "#0F172A",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            {t("nav.search")}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 868px) {
          .mobile-menu-btn { display: flex !important; }
          .mobile-nav-dropdown { display: flex !important; }
        }
        @media (max-width: 640px) {
          .mobile-search-btn { display: flex !important; }
          .mobile-nav-dropdown a,
          .mobile-nav-dropdown div {
            padding: 10px 12px !important;
            font-size: 14px !important;
          }
        }
      `}</style>
    </header>
  );
}
