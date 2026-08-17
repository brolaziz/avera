"use client";

import { useState } from "react";
import { useAdmin } from "@/lib/admin-store";

export function AdminLogin() {
  const { login } = useAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const success = await login(email, password);
    if (!success) {
      setError("Email yoki parol noto'g'ri");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#F7F8FA",
      padding: 20,
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 20,
        padding: 40,
        width: "100%",
        maxWidth: 400,
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{
            fontSize: 28,
            fontWeight: 500,
            fontFamily: "var(--font-brand)",
            letterSpacing: "0.04em",
            margin: "0 0 8px",
          }}>
            AVERA <span style={{ color: "var(--accent)" }}>Admin</span>
          </h1>
          <p style={{ fontSize: 14, color: "#64748B", margin: 0 }}>
            Admin paneliga kirish
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#64748B", marginBottom: 6, display: "block" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@avera.uz"
              required
              style={{
                width: "100%",
                height: 48,
                border: "1px solid #E2E8F0",
                borderRadius: 12,
                padding: "0 16px",
                fontSize: 15,
                outline: "none",
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#64748B", marginBottom: 6, display: "block" }}>
              Parol
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: "100%",
                height: 48,
                border: "1px solid #E2E8F0",
                borderRadius: 12,
                padding: "0 16px",
                fontSize: 15,
                outline: "none",
              }}
            />
          </div>

          {error && (
            <div style={{
              padding: "12px 16px",
              background: "#FEF2F2",
              borderRadius: 10,
              color: "#EF4444",
              fontSize: 14,
              fontWeight: 500,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              height: 50,
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              cursor: loading ? "wait" : "pointer",
              opacity: loading ? 0.7 : 1,
              marginTop: 8,
            }}
          >
            {loading ? "Kirish..." : "Kirish"}
          </button>
        </form>
      </div>
    </div>
  );
}
