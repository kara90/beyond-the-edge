import { ImageResponse } from "next/og";

// Branded social share card (shown when the link is posted anywhere).
// Generated as a static PNG at build time (required for output: export).
export const dynamic = "force-static";
export const alt = "Beyond the Edge Studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0e17",
          color: "#EAEFF8",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* dome arc glow rising from the bottom */}
        <div
          style={{
            position: "absolute",
            bottom: -380,
            width: 960,
            height: 960,
            borderRadius: "50%",
            border: "2px solid rgba(95,212,245,0.55)",
            boxShadow: "0 0 140px 24px rgba(95,212,245,0.35)",
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 30,
            letterSpacing: 10,
            textTransform: "uppercase",
            color: "#94a3b5",
          }}
        >
          Beyond the Edge Studio
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 88,
            fontWeight: 700,
            marginTop: 28,
            letterSpacing: -2,
          }}
        >
          We go beyond the edge.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "#9aa3b5",
            marginTop: 26,
            maxWidth: 820,
            textAlign: "center",
          }}
        >
          Premium websites and cinematic video for brands that refuse to look
          average.
        </div>
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 46,
            fontSize: 24,
            color: "#5fd4f5",
            letterSpacing: 1,
          }}
        >
          beyondtheedgestudio.com
        </div>
      </div>
    ),
    { ...size }
  );
}
