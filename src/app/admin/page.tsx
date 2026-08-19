"use client";

import Link from "next/link";
import { useAdmin } from "@/lib/admin-store";
import { useI18n } from "@/lib/i18n";

export default function AdminDashboard() {
  const { products, orders } = useAdmin();
  const { t } = useI18n();

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const paidOrders = orders.filter(o => o.status === "tolangan");
  const revenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === "kutilmoqda").length;
  const recentOrders = [...orders].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  const formatPrice = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  const stats = [
    { label: t("admin.products_count"), value: totalProducts.toString(), color: "var(--accent)" },
    { label: t("admin.orders"), value: totalOrders.toString(), color: "var(--success)" },
    { label: t("admin.revenue"), value: formatPrice(revenue) + " so'm", color: "var(--accent)" },
    { label: t("admin.pending_orders"), value: pendingOrders.toString(), color: "#8A6B33" },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, margin: 0, fontWeight: 700 }}>
          {t("admin.dashboard")}
        </h1>
        <Link
          href="/admin/mahsulotlar/yangi"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            background: "var(--accent)",
            color: "var(--bg-surface)",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M12 4v16m8-8H4" />
          </svg>
          {t("admin.add_product")}
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }} className="admin-stats-grid">
        {stats.map((stat, i) => (
          <div
            key={i}
            style={{
              background: "var(--bg-surface)",
              borderRadius: 16,
              padding: "22px 20px",
              boxShadow: "0 2px 8px rgba(42,33,29,0.05)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: stat.color + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: stat.color }} />
              </div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>{stat.value}</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div style={{ background: "var(--bg-surface)", borderRadius: 16, padding: "24px", boxShadow: "0 2px 8px rgba(42,33,29,0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, margin: 0, fontWeight: 700 }}>
            {t("admin.recent_orders")}
          </h2>
          <Link href="/admin/buyurtmalar" style={{ color: "var(--accent)", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
            {t("admin.view_all")}
          </Link>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <th style={{ textAlign: "left", padding: "10px 12px", color: "var(--text-muted)", fontWeight: 600, fontSize: 12, textTransform: "uppercase" }}>{t("admin.order")}</th>
                <th style={{ textAlign: "left", padding: "10px 12px", color: "var(--text-muted)", fontWeight: 600, fontSize: 12, textTransform: "uppercase" }}>{t("admin.customer")}</th>
                <th style={{ textAlign: "left", padding: "10px 12px", color: "var(--text-muted)", fontWeight: 600, fontSize: 12, textTransform: "uppercase" }}>{t("admin.date")}</th>
                <th style={{ textAlign: "left", padding: "10px 12px", color: "var(--text-muted)", fontWeight: 600, fontSize: 12, textTransform: "uppercase" }}>{t("admin.total")}</th>
                <th style={{ textAlign: "left", padding: "10px 12px", color: "var(--text-muted)", fontWeight: 600, fontSize: 12, textTransform: "uppercase" }}>{t("admin.status")}</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "14px 12px", fontWeight: 600 }}>{order.id}</td>
                  <td style={{ padding: "14px 12px" }}>{order.customer}</td>
                  <td style={{ padding: "14px 12px", color: "var(--text-muted)" }}>{order.date}</td>
                  <td style={{ padding: "14px 12px", fontWeight: 600 }}>{formatPrice(order.total)} so'm</td>
                  <td style={{ padding: "14px 12px" }}>
                    <span style={{
                      display: "inline-block",
                      padding: "4px 10px",
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      background: order.status === "tolangan" ? "var(--success-bg)" : order.status === "kutilmoqda" ? "var(--gold-wash)" : order.status === "bekor" ? "var(--danger-bg)" : "var(--accent-tint)",
                      color: order.status === "tolangan" ? "var(--success)" : order.status === "kutilmoqda" ? "#8A6B33" : order.status === "bekor" ? "var(--danger)" : "var(--accent)",
                    }}>
                      {order.status === "tolangan" ? t("admin.status.paid") : order.status === "kutilmoqda" ? t("admin.status.pending") : order.status === "bekor" ? t("admin.status.cancelled") : t("admin.status.transit")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .admin-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .admin-stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
