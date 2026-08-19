"use client";

import { useState } from "react";
import { useAdmin, type Order } from "@/lib/admin-store";

export default function OrdersPage() {
  const { orders, updateOrderStatus } = useAdmin();
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filtered = filterStatus === "all"
    ? orders
    : orders.filter(o => o.status === filterStatus);

  const formatPrice = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  const statusLabels: Record<string, string> = {
    kutilmoqda: "Tasdiqlanishi kutilmoqda",
    tolangan: "To'lov qilindi",
    yolda: "Yo'lda",
    bekor: "Bekor qilindi",
  };

  const statusColors: Record<string, { bg: string; color: string }> = {
    kutilmoqda: { bg: "var(--gold-wash)", color: "#8A6B33" },
    tolangan: { bg: "var(--success-bg)", color: "var(--success)" },
    yolda: { bg: "var(--accent-tint)", color: "var(--accent)" },
    bekor: { bg: "var(--danger-bg)", color: "var(--danger)" },
  };

  const tabs = [
    { key: "all", label: "Hammasi", count: orders.length },
    { key: "kutilmoqda", label: "Kutilmoqda", count: orders.filter(o => o.status === "kutilmoqda").length },
    { key: "tolangan", label: "To'lov qilindi", count: orders.filter(o => o.status === "tolangan").length },
    { key: "yolda", label: "Yo'lda", count: orders.filter(o => o.status === "yolda").length },
    { key: "bekor", label: "Bekor qilindi", count: orders.filter(o => o.status === "bekor").length },
  ];

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateOrderStatus(orderId, newStatus);
  };

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 24px" }}>
        Buyurtmalar
      </h1>

      {/* Status tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, overflowX: "auto", paddingBottom: 4, flexWrap: "wrap" }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key)}
            style={{
              padding: "10px 18px",
              borderRadius: 10,
              border: "none",
              background: filterStatus === tab.key ? "var(--accent)" : "var(--bg-surface)",
              color: filterStatus === tab.key ? "var(--bg-surface)" : "var(--ink)",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
              boxShadow: filterStatus === tab.key ? "none" : "0 1px 4px rgba(0,0,0,0.06)",
            }}
          >
            {tab.label} <span style={{ opacity: 0.7, marginLeft: 4 }}>({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Orders table */}
      <div style={{ background: "var(--bg-surface)", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 8px rgba(42,33,29,0.05)" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <th style={{ textAlign: "left", padding: "14px 16px", color: "var(--text-muted)", fontWeight: 600, fontSize: 12, textTransform: "uppercase" }}>№</th>
                <th style={{ textAlign: "left", padding: "14px 16px", color: "var(--text-muted)", fontWeight: 600, fontSize: 12, textTransform: "uppercase" }}>Mijoz</th>
                <th style={{ textAlign: "left", padding: "14px 16px", color: "var(--text-muted)", fontWeight: 600, fontSize: 12, textTransform: "uppercase" }}>Telefon</th>
                <th style={{ textAlign: "left", padding: "14px 16px", color: "var(--text-muted)", fontWeight: 600, fontSize: 12, textTransform: "uppercase" }}>Sana</th>
                <th style={{ textAlign: "left", padding: "14px 16px", color: "var(--text-muted)", fontWeight: 600, fontSize: 12, textTransform: "uppercase" }}>Jami</th>
                <th style={{ textAlign: "left", padding: "14px 16px", color: "var(--text-muted)", fontWeight: 600, fontSize: 12, textTransform: "uppercase" }}>Holat</th>
                <th style={{ textAlign: "right", padding: "14px 16px", color: "var(--text-muted)", fontWeight: 600, fontSize: 12, textTransform: "uppercase" }}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <tr key={order.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "14px 16px", fontWeight: 600 }}>{order.id}</td>
                  <td style={{ padding: "14px 16px" }}>{order.customer}</td>
                  <td style={{ padding: "14px 16px", color: "var(--text-muted)" }}>{order.phone}</td>
                  <td style={{ padding: "14px 16px", color: "var(--text-muted)" }}>{order.date}</td>
                  <td style={{ padding: "14px 16px", fontWeight: 600 }}>{formatPrice(order.total)} so'm</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{
                      display: "inline-block",
                      padding: "4px 10px",
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      background: statusColors[order.status]?.bg || "var(--bg-fill)",
                      color: statusColors[order.status]?.color || "var(--text-muted)",
                    }}>
                      {statusLabels[order.status] || order.status}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", textAlign: "right" }}>
                    {order.status === "kutilmoqda" ? (
                      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                        <button
                          onClick={() => handleStatusChange(order.id, "tolangan")}
                          style={{
                            padding: "6px 14px", border: "none", borderRadius: 8,
                            background: "var(--success-bg)", color: "var(--success)", fontSize: 13,
                            fontWeight: 600, cursor: "pointer",
                          }}
                        >
                          Tasdiqlash
                        </button>
                        <button
                          onClick={() => handleStatusChange(order.id, "bekor")}
                          style={{
                            padding: "6px 14px", border: "none", borderRadius: 8,
                            background: "var(--danger-bg)", color: "var(--danger)", fontSize: 13,
                            fontWeight: 600, cursor: "pointer",
                          }}
                        >
                          Bekor qilish
                        </button>
                      </div>
                    ) : (
                      <select
                        value={order.status}
                        onChange={e => handleStatusChange(order.id, e.target.value as Order["status"])}
                        style={{
                          padding: "6px 10px", border: "1px solid var(--border)",
                          borderRadius: 8, fontSize: 13, background: "var(--bg-surface)",
                          cursor: "pointer", outline: "none",
                        }}
                      >
                        <option value="kutilmoqda">Kutilmoqda</option>
                        <option value="tolangan">To'lov qilindi</option>
                        <option value="yolda">Yo'lda</option>
                        <option value="bekor">Bekor qilindi</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
            Buyurtmalar topilmadi
          </div>
        )}
      </div>
    </div>
  );
}
