"use client";

import { useState, useEffect } from "react";
import { useStore, formatPrice } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import Link from "next/link";

interface PaymentInfo {
  cardNumber: string;
  cardOwner: string;
  telegramUsername: string;
}

export default function CheckoutPage() {
  const { cart, cartTotal, placeOrder, getPaymentSettings } = useStore();
  const { t } = useI18n();
  const [payment, setPayment] = useState<PaymentInfo | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [step, setStep] = useState<"info" | "pay" | "done">("info");
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    getPaymentSettings().then(setPayment);
  }, [getPaymentSettings]);

  const handleProceedToPayment = () => {
    if (!name.trim() || !phone.trim() || !address.trim()) return;
    setStep("pay");
  };

  const handleConfirmPayment = async () => {
    const id = await placeOrder(name, phone, address);
    setOrderId(id);
    setStep("done");
  };

  if (cart.length === 0 && step !== "done") {
    return (
      <section style={{ marginTop: 16, textAlign: "center", padding: "80px 20px" }}>
        <p style={{ fontSize: 24, fontWeight: 700 }}>{t("cart.empty")}</p>
        <Link
          href="/katalog"
          style={{
            display: "inline-block", marginTop: 20, height: 48, lineHeight: "48px",
            padding: "0 22px", background: "var(--accent)", color: "white",
            borderRadius: 14, fontWeight: 600, fontSize: 15, textDecoration: "none",
          }}
        >
          {t("cart.go_catalog")}
        </Link>
      </section>
    );
  }

  if (step === "done") {
    return (
      <section style={{ marginTop: 16, textAlign: "center", padding: "60px 20px" }}>
        <div style={{
          width: 64, height: 64, borderRadius: 20, background: "#FFF7ED",
          color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28, margin: "0 auto 20px",
        }}>
          &#10003;
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
          {t("checkout.order_placed")}
        </h2>
        <p style={{ fontSize: 15, color: "#64748B", lineHeight: 1.6, maxWidth: 420, margin: "0 auto 8px" }}>
          {t("checkout.order_placed_desc")}
        </p>
        <p style={{ fontSize: 14, color: "#94A3B8", marginBottom: 28 }}>
          {t("checkout.order_number")}: <strong>{orderId}</strong>
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <Link
            href="/profil"
            style={{
              height: 48, padding: "0 24px", background: "var(--accent)", color: "#fff",
              borderRadius: 12, fontSize: 15, fontWeight: 600, display: "flex",
              alignItems: "center", textDecoration: "none",
            }}
          >
            {t("confirm.orders")}
          </Link>
          <Link
            href="/"
            style={{
              height: 48, padding: "0 24px", border: "1px solid #E2E8F0", background: "#fff",
              borderRadius: 12, fontSize: 15, fontWeight: 600, color: "#64748B",
              display: "flex", alignItems: "center", textDecoration: "none",
            }}
          >
            {t("product.home")}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section style={{ marginTop: 16 }}>
      <div className="grid-checkout">
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {step === "info" && (
            <div style={{ background: "white", borderRadius: 22, padding: "clamp(16px, 4vw, 24px)" }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, marginBottom: 20 }}>
                {t("checkout.delivery")}
              </h2>
              <div className="grid-checkout-fields">
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#64748B", marginBottom: 6 }}>
                    {t("checkout.name")}
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder={t("checkout.name_ph")}
                    style={{
                      width: "100%", height: 48, border: "1px solid #E2E8F0",
                      borderRadius: 12, padding: "0 15px", fontSize: 14.5, outline: "none",
                    }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#64748B", marginBottom: 6 }}>
                    {t("checkout.phone")}
                  </div>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder={t("checkout.phone_ph")}
                    style={{
                      width: "100%", height: 48, border: "1px solid #E2E8F0",
                      borderRadius: 12, padding: "0 15px", fontSize: 14.5, outline: "none",
                    }}
                  />
                </div>
                <div className="span-2" style={{ gridColumn: "span 2" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#64748B", marginBottom: 6 }}>
                    {t("checkout.address")}
                  </div>
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder={t("checkout.address_ph")}
                    style={{
                      width: "100%", height: 48, border: "1px solid #E2E8F0",
                      borderRadius: 12, padding: "0 15px", fontSize: 14.5, outline: "none",
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {step === "pay" && payment && (
            <div style={{ background: "white", borderRadius: 22, padding: "clamp(16px, 4vw, 24px)" }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, marginBottom: 20 }}>
                {t("checkout.payment")}
              </h2>

              <div style={{
                background: "linear-gradient(135deg, #0F172A, #1E293B)",
                borderRadius: 16, padding: "20px", marginBottom: 20, color: "#fff",
              }}>
                <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {t("checkout.card_number")}
                </div>
                <div style={{ fontSize: "clamp(16px, 4vw, 22px)", fontWeight: 600, letterSpacing: "0.05em", marginBottom: 16, fontFamily: "monospace", wordBreak: "break-all" }}>
                  {payment.cardNumber}
                </div>
                {payment.cardOwner && (
                  <div style={{ fontSize: 14, color: "#CBD5E1" }}>
                    {payment.cardOwner}
                  </div>
                )}
              </div>

              <div style={{
                background: "#FFF7ED", borderRadius: 14, padding: "18px 22px", marginBottom: 20,
                border: "1px solid #FFEDD5",
              }}>
                <div style={{ fontSize: 14, color: "#9A3412", lineHeight: 1.7 }}>
                  {t("checkout.transfer_instruction")
                    .replace("{amount}", formatPrice(cartTotal))
                    .replace("{telegram}", payment.telegramUsername)}
                </div>
              </div>

              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 16px", background: "#F8FAFC", borderRadius: 12, marginBottom: 20,
                flexWrap: "wrap", gap: 8,
              }}>
                <span style={{ fontSize: 15, fontWeight: 600 }}>{t("checkout.pay")}</span>
                <span style={{ fontSize: "clamp(18px, 5vw, 24px)", fontWeight: 700 }}>{formatPrice(cartTotal)} so'm</span>
              </div>

              <button
                onClick={handleConfirmPayment}
                style={{
                  width: "100%", height: 52, background: "var(--accent)", color: "white",
                  borderRadius: 14, border: "none", fontWeight: 600, fontSize: 15, cursor: "pointer",
                }}
              >
                {t("checkout.paid_btn")}
              </button>
              <p style={{ fontSize: 13, color: "#94A3B8", textAlign: "center", marginTop: 12 }}>
                {t("checkout.paid_hint")}
              </p>
            </div>
          )}
        </div>

        {/* Right column — Order summary */}
        <div style={{
          background: "white", borderRadius: 22, padding: 24,
          position: "sticky", top: 80,
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, marginBottom: 18 }}>
            {t("checkout.order")}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 }}>
            {cart.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 11, background: "#F1F3F5",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontFamily: "monospace", color: "#94A3B8", flexShrink: 0,
                }}>
                  rasm
                </div>
                <div style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>
                  {item.product.name} <span style={{ color: "#94A3B8" }}>&times;{item.qty}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  {formatPrice(item.product.priceNum * item.qty)}
                </div>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: "#E2E8F0", marginBottom: 16 }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 600 }}>{t("checkout.pay")}</span>
            <span style={{ fontSize: "clamp(18px, 4vw, 24px)", fontWeight: 700 }}>
              {cartTotal > 0 ? formatPrice(cartTotal) : "0"} so'm
            </span>
          </div>

          {step === "info" && (
            <button
              onClick={handleProceedToPayment}
              disabled={!name.trim() || !phone.trim() || !address.trim()}
              className="btn-accent"
              style={{
                width: "100%", height: 52, background: "var(--accent)", color: "white",
                borderRadius: 14, border: "none", fontWeight: 600, fontSize: 15, cursor: "pointer",
                opacity: (!name.trim() || !phone.trim() || !address.trim()) ? 0.5 : 1,
              }}
            >
              {t("checkout.proceed_payment")}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
