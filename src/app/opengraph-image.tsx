import { ImageResponse } from "next/og";

export const alt = "OriginShield AI content detection platform";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          color: "#e2e8f0",
          background:
            "linear-gradient(135deg, #030712 0%, #0f172a 52%, #061826 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            marginBottom: "44px",
          }}
        >
          <div
            style={{
              width: "58px",
              height: "58px",
              borderRadius: "14px",
              background: "#00f0ff",
            }}
          />
          <div style={{ fontSize: 42, fontWeight: 800 }}>
            OriginShield
          </div>
        </div>
        <div style={{ fontSize: 78, fontWeight: 900, lineHeight: 1.05 }}>
          Verify what is authentically human
        </div>
        <div
          style={{
            marginTop: "34px",
            maxWidth: "850px",
            fontSize: 28,
            lineHeight: 1.35,
            color: "#94a3b8",
          }}
        >
          AI detection for text, images, and web content with evidence-backed
          results.
        </div>
      </div>
    ),
    size
  );
}
