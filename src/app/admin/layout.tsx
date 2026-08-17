"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminProvider, useAdmin } from "@/lib/admin-store";
import { useI18n } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";
import { AdminLogin } from "@/components/AdminLogin";

const navItems = [
  { href: "/admin", labelKey: "admin.home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/admin/mahsulotlar", labelKey: "admin.products", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { href: "/admin/katalog", labelKey: "admin.catalog", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
  { href: "/admin/buyurtmalar", labelKey: "admin.orders", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" },
  { href: "/admin/sozlamalar", labelKey: "admin.settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminGate>{children}</AdminGate>
    </AdminProvider>
  );
}

function AdminGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAdmin();

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 16, color: "#64748B" }}>Yuklanmoqda...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return <AdminDashboardShell>{children}</AdminDashboardShell>;
}

function AdminDashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useI18n();
  const { logout } = useAdmin();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }}
          />
        )}

        <aside
          style={{
            width: 260,
            background: "#0F172A",
            color: "#E2E8F0",
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            top: 0,
            left: sidebarOpen ? 0 : -260,
            bottom: 0,
            zIndex: 50,
            transition: "left 0.3s ease",
          }}
          className="admin-sidebar"
        >
          <div style={{ padding: "28px 24px 20px", borderBottom: "1px solid #1E293B" }}>
            <Link href="/admin" style={{ color: "#E2E8F0", textDecoration: "none" }}>
              <h1 style={{ fontSize: 22, margin: 0, fontWeight: 500, fontFamily: "var(--font-brand)", letterSpacing: "0.04em" }}>
                AVERA <span style={{ color: "var(--accent)" }}>Admin</span>
              </h1>
            </Link>
          </div>

          <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderRadius: 10,
                  color: isActive(item.href) ? "#fff" : "#94A3B8",
                  background: isActive(item.href) ? "var(--accent)" : "transparent",
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 500,
                  transition: "all 0.2s",
                }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>

          <div style={{ padding: "16px 12px", borderTop: "1px solid #1E293B", display: "flex", flexDirection: "column", gap: 4 }}>
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 14px",
                borderRadius: 10,
                color: "#94A3B8",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t("admin.back_site")}
            </Link>
            <button
              onClick={logout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 14px",
                borderRadius: 10,
                color: "#EF4444",
                background: "none",
                border: "none",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                width: "100%",
                textAlign: "left",
              }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Chiqish
            </button>
          </div>
        </aside>

        <div style={{ flex: 1, display: "flex", flexDirection: "column" }} className="admin-main">
          <header className="admin-mobile-header" style={{
            height: 60,
            background: "#fff",
            borderBottom: "1px solid #E2E8F0",
            display: "none",
            alignItems: "center",
            padding: "0 16px",
            position: "sticky",
            top: 0,
            zIndex: 30,
          }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 8 }}
            >
              <svg width="24" height="24" fill="none" stroke="#0F172A" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span style={{ fontSize: 18, fontWeight: 500, fontFamily: "var(--font-brand)", letterSpacing: "0.04em", marginLeft: 12 }}>
              AVERA <span style={{ color: "var(--accent)" }}>Admin</span>
            </span>
            <div style={{ marginLeft: "auto" }}>
              <LanguageToggle />
            </div>
          </header>

          <main style={{ flex: 1, padding: 32, background: "#F7F8FA", overflowY: "auto", minHeight: "100vh" }} className="admin-content">
            {children}
          </main>
        </div>
      </div>

      <style>{`
        @media (min-width: 769px) {
          .admin-sidebar { left: 0 !important; }
          .admin-main { margin-left: 260px; }
        }
        @media (max-width: 768px) {
          .admin-mobile-header { display: flex !important; }
          .admin-content { padding: 20px 16px !important; }
        }
      `}</style>
    </>
  );
}
