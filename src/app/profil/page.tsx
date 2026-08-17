"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { useStore, formatPrice } from "@/lib/store";
import type { Order } from "@/lib/api";

export default function ProfilPage() {
  const { t } = useI18n();
  const { getMyOrders } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    getMyOrders().then(setOrders);

    const interval = setInterval(() => {
      getMyOrders().then(setOrders);
    }, 10000);
    return () => clearInterval(interval);
  }, [getMyOrders]);

  const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
    kutilmoqda: { label: t("profile.status.pending"), bg: "#FEF3C7", color: "#D97706" },
    tolangan: { label: t("profile.status.paid"), bg: "#ECFDF5", color: "#10B981" },
    yolda: { label: t("profile.status.transit"), bg: "var(--accent-tint)", color: "var(--accent)" },
    bekor: { label: t("profile.status.cancelled"), bg: "#FEE2E2", color: "#EF4444" },
  };

  return (
    <section style={{ marginTop: 16 }}>
      {/* Profile info card */}
      <div style={{ background: "white", borderRadius: 22, padding: "24px", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: "var(--accent-tint)", color: "var(--accent)",
            fontSize: 22, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            A
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>AVERA Mijoz</div>
            <div style={{ fontSize: 14, color: "#94A3B8", marginTop: 4 }}>
              {orders.length} {t("admin.orders").toLowerCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Orders panel */}
      <div style={{ background: "white", borderRadius: 22, padding: "24px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, marginBottom: 18 }}>
          {t("profile.orders")}
        </h2>

        {orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#94A3B8" }}>
            <p style={{ fontSize: 15 }}>Buyurtmalar mavjud emas</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {orders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.kutilmoqda;
              return (
                <div
                  key={order.id}
                  className="order-item"
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {order.items.map(i => i.name).join(", ")}
                    </div>
                    <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 2 }}>
                      {order.id} · {order.date}
                    </div>
                  </div>

                  <div style={{
                    fontWeight: 600, fontSize: 12.5,
                    padding: "6px 12px", borderRadius: 9,
                    background: status.bg, color: status.color,
                    flexShrink: 0,
                  }}>
                    {status.label}
                  </div>

                  <div className="order-price" style={{ fontWeight: 700, fontSize: 15.5, minWidth: 100, textAlign: "right" }}>
                    {formatPrice(order.total)} so'm
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
