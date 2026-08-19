import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "AVERA — ayollar sumkalari va charm aksessuarlar";

/** Ijtimoiy tarmoqlarda ulashilganda ko'rinadigan rasm — sayt palitrasida. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#F5EFE6",
          color: "#2A211D",
          fontFamily: "serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: 14,
            background: "#6B1E2E",
            display: "flex",
          }}
        />
        <div
          style={{
            fontSize: 132,
            letterSpacing: 22,
            fontWeight: 500,
            display: "flex",
            marginLeft: 22,
          }}
        >
          AVERA
        </div>
        <div
          style={{
            width: 120,
            height: 3,
            background: "#B99A6B",
            margin: "34px 0",
            display: "flex",
          }}
        />
        <div style={{ fontSize: 36, color: "#6E6058", display: "flex", letterSpacing: 2 }}>
          Ayollar sumkalari · Tabiiy charm
        </div>
      </div>
    ),
    size
  );
}
