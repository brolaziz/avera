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
    kutilmoqda: { label: t("profile.status.pending"), bg: "var(--gold-wash)", color: "#8A6B33" },
    tolangan: { label: t("profile.status.paid"), bg: "var(--success-bg)", color: "var(--success)" },
    yolda: { label: t("profile.status.transit"), bg: "var(--accent-tint)", color: "var(--accent)" },
    bekor: { label: t("profile.status.cancelled"), bg: "var(--danger-bg)", color: "var(--danger)" },
  };

  return (
    <section style={{ marginTop: 16 }}>
      <div className="panel fade-up" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56, height: 56, borderRadius: 16, background: "var(--accent-tint)",
              color: "var(--accent)", fontSize: 22, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}
          >
            A
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 22 }}>{t("nav.profile")}</h1>
            <div style={{ fontSize: 14, color: "var(--text-soft)", marginTop: 4 }}>
              {orders.length} {t("admin.orders").toLowerCase()}
            </div>
          </div>
        </div>
      </div>

      <div className="panel fade-up delay-1">
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 18px" }}>{t("profile.orders")}</h2>

        {orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-soft)", fontSize: 15 }}>
            {t("search.not_found")}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {orders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.kutilmoqda;
              return (
                <div key={order.id} className="order-item">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="text-ellipsis" style={{ fontSize: 15, fontWeight: 600 }}>
                      {order.items.map((i) => i.name).join(", ")}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text-soft)", marginTop: 2 }}>
                      {order.id} · {order.date}
                    </div>
                  </div>

                  <div
                    style={{
                      fontWeight: 600, fontSize: 12.5, padding: "6px 12px", borderRadius: 9,
                      background: status.bg, color: status.color, flexShrink: 0,
                    }}
                  >
                    {status.label}
                  </div>

                  <div className="order-price" style={{ fontWeight: 700, fontSize: 15.5, minWidth: 100, textAlign: "right" }}>
                    {formatPrice(order.total)} {t("common.sum")}
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
