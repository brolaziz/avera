"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { useSite } from "@/lib/site";
import { LanguageToggle } from "@/components/LanguageToggle";

export function Header() {
  const { cartCount } = useStore();
  const { categories } = useSite();
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.catalog"), href: "/katalog" },
    { label: t("nav.contact"), href: "/aloqa" },
    { label: t("nav.partnership"), href: "/hamkorlik" },
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className="site-header"
      style={{
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRadius: 16,
        padding: "12px 16px",
        border: "1px solid var(--border-soft)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Desktop */}
      <div className="header-desktop" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Brand />

        <nav className="header-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link"
              style={{
                padding: "8px 13px",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 500,
                color: pathname === item.href ? "var(--accent)" : "var(--text-muted)",
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div onClick={() => router.push("/qidiruv")} className="search-field header-search" style={{ cursor: "pointer" }}>
          <SearchIcon />
          <span style={{ fontSize: 14, color: "var(--text-faint)" }}>{t("nav.search")}</span>
        </div>

        <div className="header-actions" style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0, marginLeft: "auto" }}>
          <LanguageToggle />

          <Link
            href="/profil"
            className="btn-outline btn-profile-text"
            style={{
              height: 42, padding: "0 16px", border: "1px solid var(--border)", background: "var(--bg-surface)",
              borderRadius: 12, fontSize: 14, fontWeight: 600, color: "var(--ink)", alignItems: "center",
            }}
          >
            {t("nav.profile")}
          </Link>

          <Link
            href="/profil"
            className="btn-outline btn-profile-icon"
            style={{
              width: 42, height: 42, border: "1px solid var(--border)", background: "var(--bg-surface)",
              borderRadius: 12, alignItems: "center", justifyContent: "center",
            }}
          >
            <UserIcon />
          </Link>

          <Link
            href="/savat"
            className="btn-accent"
            style={{
              height: 42, padding: "0 14px", border: "none", background: "var(--accent)", color: "#fff",
              borderRadius: 12, fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center",
              gap: cartCount > 0 ? 6 : 0, whiteSpace: "nowrap",
            }}
          >
            <CartIcon />
            {cartCount > 0 && <span>{cartCount}</span>}
          </Link>
        </div>
      </div>

      {/* Mobil — ikki qator */}
      <div className="header-mobile" style={{ display: "none" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Brand />

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={t("nav.menu")}
            aria-expanded={menuOpen}
            style={{
              width: 40, height: 40, border: "1px solid var(--border)",
              background: menuOpen ? "var(--accent-tint)" : "var(--bg-surface)",
              borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <svg width="20" height="20" fill="none" stroke={menuOpen ? "var(--accent)" : "var(--ink)"} strokeWidth="2" viewBox="0 0 24 24">
              {menuOpen ? <path strokeLinecap="round" d="M6 6l12 12M6 18L18 6" /> : <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        <div className="header-mobile-row2" style={{ display: "flex", alignItems: "center", marginTop: 10, gap: 10 }}>
          <div
            onClick={() => router.push("/qidiruv")}
            style={{
              flex: 1, display: "flex", alignItems: "center", gap: 8, background: "var(--bg-fill)",
              border: "1px solid transparent", borderRadius: 10, height: 40, padding: "0 12px",
              cursor: "pointer", minWidth: 0,
            }}
          >
            <SearchIcon />
            <span className="text-ellipsis" style={{ fontSize: 13, color: "var(--text-faint)" }}>{t("nav.search")}</span>
          </div>

          <LanguageToggle />

          <Link
            href="/profil"
            style={{
              width: 40, height: 40, border: "1px solid var(--border)", background: "var(--bg-surface)",
              borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}
          >
            <UserIcon />
          </Link>
        </div>

        {menuOpen && (
          <div
            style={{
              display: "flex", flexDirection: "column", gap: 2, paddingTop: 12,
              borderTop: "1px solid var(--border-soft)", marginTop: 12,
            }}
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="nav-link"
                style={{ padding: "11px 14px", borderRadius: 10, fontSize: 15, fontWeight: 500, color: "var(--ink)" }}
              >
                {item.label}
              </Link>
            ))}

            {categories.length > 0 && (
              <>
                <div style={{ padding: "12px 14px 6px", fontSize: 11.5, fontWeight: 600, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                  {t("nav.categories")}
                </div>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/katalog?category=${cat.slug}`}
                    onClick={closeMenu}
                    className="nav-link"
                    style={{ padding: "11px 14px", borderRadius: 10, fontSize: 15, fontWeight: 500, color: "var(--ink)" }}
                  >
                    {cat.name}
                  </Link>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 868px) {
          .header-desktop { display: none !important; }
          .header-mobile { display: block !important; }
        }
        @media (min-width: 869px) {
          .header-desktop { display: flex !important; }
          .header-mobile { display: none !important; }
        }
        @media (max-width: 868px) {
          .header-mobile-row2 .lang-toggle-btn {
            height: 40px !important;
            padding: 0 10px !important;
            border-radius: 10px !important;
          }
        }
        @media (max-width: 380px) {
          .header-mobile-row2 { gap: 6px !important; }
          .header-mobile-row2 .lang-toggle-btn { height: 36px !important; padding: 0 8px !important; }
          .header-mobile-row2 .lang-toggle-btn .lang-label { display: none !important; }
        }
      `}</style>
    </header>
  );
}

function Brand() {
  return (
    <Link
      href="/"
      style={{
        fontSize: 22, fontWeight: 500, fontFamily: "var(--font-display)", letterSpacing: "0.06em",
        display: "flex", alignItems: "center", gap: 9, color: "var(--ink)", flexShrink: 0,
      }}
    >
      <span style={{ width: 24, height: 24, borderRadius: 7, background: "var(--accent)", display: "inline-block", flexShrink: 0 }} />
      AVERA
    </Link>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
