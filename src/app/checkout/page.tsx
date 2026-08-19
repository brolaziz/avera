"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useStore, formatPrice } from "@/lib/store";
import { useI18n } from "@/lib/i18n";

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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getPaymentSettings()
      .then(setPayment)
      .catch(() => setPayment(null));
  }, [getPaymentSettings]);

  const formReady = !!(name.trim() && phone.trim() && address.trim());

  const handleConfirmPayment = async () => {
    setSubmitting(true);
    setError("");
    try {
      const id = await placeOrder(name, phone, address);
      setOrderId(id);
      setStep("done");
    } catch {
      setError(t("checkout.error"));
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0 && step !== "done") {
    return (
      <div className="empty-state fade-in" style={{ marginTop: 16 }}>
        <div className="empty-title">{t("cart.empty")}</div>
        <Link
          href="/katalog"
          className="btn-accent"
          style={{
            display: "inline-flex", alignItems: "center", marginTop: 18, height: 48, padding: "0 22px",
            background: "var(--accent)", color: "#fff", borderRadius: 12, fontWeight: 600, fontSize: 15,
          }}
        >
          {t("cart.go_catalog")}
        </Link>
      </div>
    );
  }

  if (step === "done") {
    return (
      <section className="panel fade-up" style={{ marginTop: 16, textAlign: "center", padding: "clamp(36px, 9vw, 64px) 24px" }}>
        <div
          style={{
            width: 64, height: 64, borderRadius: "50%", background: "var(--accent-tint)",
            color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 12 5 5L20 7" />
          </svg>
        </div>
        <h1 style={{ fontSize: "clamp(21px, 5vw, 26px)", fontWeight: 700, margin: "0 0 12px" }}>
          {t("checkout.order_placed")}
        </h1>
        <p style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.6, maxWidth: 440, margin: "0 auto 8px" }}>
          {t("checkout.order_placed_desc")}
        </p>
        <p style={{ fontSize: 14, color: "var(--text-soft)", marginBottom: 28 }}>
          {t("checkout.order_number")}: <strong style={{ color: "var(--ink)" }}>{orderId}</strong>
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/profil"
            className="btn-accent"
            style={{
              height: 48, padding: "0 24px", background: "var(--accent)", color: "#fff",
              borderRadius: 12, fontSize: 15, fontWeight: 600, display: "inline-flex", alignItems: "center",
            }}
          >
            {t("confirm.orders")}
          </Link>
          <Link
            href="/"
            className="btn-outline"
            style={{
              height: 48, padding: "0 24px", border: "1px solid var(--border)", background: "var(--bg-surface)",
              borderRadius: 12, fontSize: 15, fontWeight: 600, color: "var(--text-muted)",
              display: "inline-flex", alignItems: "center",
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
      <div className="grid-checkout fade-up">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {step === "info" && (
            <div className="panel">
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 20px" }}>{t("checkout.delivery")}</h2>
              <div className="grid-checkout-fields">
                <div>
                  <label className="field-label" htmlFor="c-name">{t("checkout.name")}</label>
                  <input id="c-name" className="field-input" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("checkout.name_ph")} />
                </div>
                <div>
                  <label className="field-label" htmlFor="c-phone">{t("checkout.phone")}</label>
                  <input id="c-phone" className="field-input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t("checkout.phone_ph")} />
                </div>
                <div className="span-2" style={{ gridColumn: "span 2" }}>
                  <label className="field-label" htmlFor="c-addr">{t("checkout.address")}</label>
                  <input id="c-addr" className="field-input" value={address} onChange={(e) => setAddress(e.target.value)} placeholder={t("checkout.address_ph")} />
                </div>
              </div>
            </div>
          )}

          {step === "pay" && payment && (
            <div className="panel">
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 20px" }}>{t("checkout.payment")}</h2>

              <div style={{ background: "var(--ink)", borderRadius: 16, padding: 20, marginBottom: 20, color: "#fff" }}>
                <div style={{ fontSize: 12, color: "var(--gold-soft)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                  {t("checkout.card_number")}
                </div>
                <div style={{ fontSize: "clamp(16px, 4vw, 22px)", fontWeight: 600, letterSpacing: "0.06em", marginBottom: 14, fontFamily: "ui-monospace, monospace", wordBreak: "break-all" }}>
                  {payment.cardNumber}
                </div>
                {payment.cardOwner && (
                  <div style={{ fontSize: 14, color: "rgba(245,239,230,0.7)" }}>{payment.cardOwner}</div>
                )}
              </div>

              <div style={{ background: "var(--accent-wash)", border: "1px solid var(--accent-tint-strong)", borderRadius: 14, padding: "18px 20px", marginBottom: 20 }}>
                <div style={{ fontSize: 14, color: "var(--accent-deep)", lineHeight: 1.7 }}>
                  {t("checkout.transfer_instruction")
                    .replace("{amount}", formatPrice(cartTotal))
                    .replace("{telegram}", payment.telegramUsername)}
                </div>
              </div>

              <div
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 16px", background: "var(--bg-fill-soft)", borderRadius: 12,
                  marginBottom: 20, flexWrap: "wrap", gap: 8,
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 600 }}>{t("checkout.pay")}</span>
                <span style={{ fontSize: "clamp(18px, 5vw, 24px)", fontWeight: 700 }}>
                  {formatPrice(cartTotal)} {t("common.sum")}
                </span>
              </div>

              {error && (
                <div style={{ background: "var(--danger-bg)", color: "var(--danger)", borderRadius: 10, padding: "11px 14px", fontSize: 14, marginBottom: 14 }}>
                  {error}
                </div>
              )}

              <button
                onClick={handleConfirmPayment}
                disabled={submitting}
                className="btn-accent"
                style={{
                  width: "100%", height: 52, background: "var(--accent)", color: "#fff",
                  borderRadius: 13, border: "none", fontWeight: 600, fontSize: 15,
                  cursor: submitting ? "default" : "pointer", opacity: submitting ? 0.7 : 1, fontFamily: "inherit",
                }}
              >
                {submitting ? t("partner.sending") : t("checkout.paid_btn")}
              </button>
              <p style={{ fontSize: 13, color: "var(--text-soft)", textAlign: "center", marginTop: 12, marginBottom: 0 }}>
                {t("checkout.paid_hint")}
              </p>
            </div>
          )}
        </div>

        {/* Buyurtma xulosasi */}
        <div className="panel" style={{ position: "sticky", top: 80 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 18px" }}>{t("checkout.order")}</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 }}>
            {cart.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div
                  style={{
                    width: 48, height: 48, borderRadius: 11, background: "var(--bg-fill)",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden",
                  }}
                >
                  {item.product.image ? (
                    <img src={item.product.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-faintest)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 7h12l1 13H5L6 7Z" />
                      <path d="M9 7V5.5a3 3 0 0 1 6 0V7" />
                    </svg>
                  )}
                </div>
                <div style={{ flex: 1, fontSize: 14, fontWeight: 500, minWidth: 0 }}>
                  {item.product.name} <span style={{ color: "var(--text-soft)" }}>&times;{item.qty}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" }}>
                  {formatPrice(item.product.priceNum * item.qty)}
                </div>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: "var(--border-soft)", marginBottom: 16 }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 600 }}>{t("checkout.pay")}</span>
            <span style={{ fontSize: "clamp(18px, 4vw, 24px)", fontWeight: 700 }}>
              {formatPrice(cartTotal)} <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-muted)" }}>{t("common.sum")}</span>
            </span>
          </div>

          {step === "info" && (
            <button
              onClick={() => formReady && setStep("pay")}
              disabled={!formReady}
              className="btn-accent"
              style={{
                width: "100%", height: 52, background: "var(--accent)", color: "#fff",
                borderRadius: 13, border: "none", fontWeight: 600, fontSize: 15,
                cursor: formReady ? "pointer" : "default", opacity: formReady ? 1 : 0.5, fontFamily: "inherit",
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
