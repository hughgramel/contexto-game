"use client";

/**
 * Renders the A2 icon at each PWA-required size for screenshotting.
 * Each icon is rendered at exact pixel dimensions with an id for targeting.
 */

const BLUE = "#1489E8";
const WHITE = "#FFFFFF";

const SIZES = [512, 384, 192, 180, 128, 96, 48, 32, 16];

function Icon({ size }: { size: number }) {
  const scale = size / 512;
  const r = (v: number) => Math.round(v * scale);

  return (
    <div
      id={`icon-${size}`}
      style={{
        width: size,
        height: size,
        position: "relative",
        borderRadius: r(110),
        overflow: "hidden",
        backgroundColor: BLUE,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: r(26),
          left: r(26),
          right: r(26),
          bottom: r(90),
          borderRadius: r(86),
          backgroundColor: WHITE,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          paddingLeft: r(86),
          gap: r(30),
        }}
      >
        {[340, 310, 260].map((w, i) => (
          <div
            key={i}
            style={{
              width: r(w),
              height: r(42),
              borderRadius: r(21),
              backgroundColor: BLUE,
              flexShrink: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function RenderPage() {
  return (
    <div style={{ padding: 32, backgroundColor: "#f3f4f6", minHeight: "100vh" }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>PWA Icon Renders — A2</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {SIZES.map((size) => (
          <div key={size} style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Icon size={size} />
            <span style={{ fontSize: 14, color: "#666" }}>{size}x{size}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
