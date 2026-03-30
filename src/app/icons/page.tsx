"use client";

const BLUE = "#1489E8";
const WHITE = "#FFFFFF";

function IconShell({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div
        style={{
          width: 512,
          height: 512,
          position: "relative",
          borderRadius: 110,
          overflow: "hidden",
          backgroundColor: BLUE,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 26,
            left: 26,
            right: 26,
            bottom: 90,
            borderRadius: 86,
            backgroundColor: WHITE,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {children}
        </div>
      </div>
      <span style={{ fontSize: 14, fontWeight: 500, color: "#666" }}>{label}</span>
    </div>
  );
}

/** 1: Four thick bars, decreasing width */
function Variation1() {
  return (
    <IconShell label="1 — Thick bars, 4 lines">
      <div style={{ display: "flex", flexDirection: "column", gap: 28, alignItems: "flex-start" }}>
        {[260, 230, 250, 180].map((w, i) => (
          <div
            key={i}
            style={{
              width: w,
              height: 26,
              borderRadius: 13,
              backgroundColor: BLUE,
            }}
          />
        ))}
      </div>
    </IconShell>
  );
}

/** 2: Five thinner bars */
function Variation2() {
  return (
    <IconShell label="2 — Thin bars, 5 lines">
      <div style={{ display: "flex", flexDirection: "column", gap: 22, alignItems: "flex-start" }}>
        {[250, 220, 260, 200, 160].map((w, i) => (
          <div
            key={i}
            style={{
              width: w,
              height: 16,
              borderRadius: 8,
              backgroundColor: BLUE,
            }}
          />
        ))}
      </div>
    </IconShell>
  );
}

/** 3: Three fat bars */
function Variation3() {
  return (
    <IconShell label="3 — Fat bars, 3 lines">
      <div style={{ display: "flex", flexDirection: "column", gap: 32, alignItems: "flex-start" }}>
        {[270, 240, 190].map((w, i) => (
          <div
            key={i}
            style={{
              width: w,
              height: 36,
              borderRadius: 18,
              backgroundColor: BLUE,
            }}
          />
        ))}
      </div>
    </IconShell>
  );
}

/** 4: Squiggly snake lines — wavy using multiple small circles/segments */
function WavyLine({ width, amplitude, periods, thickness }: { width: number; amplitude: number; periods: number; thickness: number }) {
  const points = 60;
  return (
    <div style={{ position: "relative", width, height: amplitude * 2 + thickness }}>
      {Array.from({ length: points }).map((_, i) => {
        const x = (i / (points - 1)) * width;
        const y = Math.sin((i / (points - 1)) * Math.PI * 2 * periods) * amplitude + amplitude;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - thickness / 2,
              top: y,
              width: thickness + 2,
              height: thickness,
              borderRadius: thickness / 2,
              backgroundColor: BLUE,
            }}
          />
        );
      })}
    </div>
  );
}

function Variation4() {
  return (
    <IconShell label="4 — Squiggly, thick">
      <div style={{ display: "flex", flexDirection: "column", gap: 18, alignItems: "flex-start" }}>
        <WavyLine width={260} amplitude={12} periods={3} thickness={20} />
        <WavyLine width={230} amplitude={12} periods={2.5} thickness={20} />
        <WavyLine width={250} amplitude={12} periods={3} thickness={20} />
        <WavyLine width={190} amplitude={12} periods={2} thickness={20} />
      </div>
    </IconShell>
  );
}

/** 5: Squiggly thin, more lines */
function Variation5() {
  return (
    <IconShell label="5 — Squiggly, thin, 5 lines">
      <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
        <WavyLine width={260} amplitude={8} periods={3.5} thickness={12} />
        <WavyLine width={240} amplitude={8} periods={3} thickness={12} />
        <WavyLine width={255} amplitude={8} periods={3.5} thickness={12} />
        <WavyLine width={220} amplitude={8} periods={2.5} thickness={12} />
        <WavyLine width={170} amplitude={8} periods={2} thickness={12} />
      </div>
    </IconShell>
  );
}

/** 6: Squiggly medium, gentle wave */
function Variation6() {
  return (
    <IconShell label="6 — Gentle wave, 4 lines">
      <div style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: "flex-start" }}>
        <WavyLine width={270} amplitude={10} periods={2} thickness={18} />
        <WavyLine width={240} amplitude={10} periods={1.5} thickness={18} />
        <WavyLine width={260} amplitude={10} periods={2} thickness={18} />
        <WavyLine width={200} amplitude={10} periods={1.5} thickness={18} />
      </div>
    </IconShell>
  );
}

export default function IconsPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6", padding: 32 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Contexto — PWA Icon Variations</h1>
      <p style={{ color: "#888", marginBottom: 32 }}>
        512x512. Flat blue. Bottom: 90px shelf. All text-line variations.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 40 }}>
        <Variation1 />
        <Variation2 />
        <Variation3 />
        <Variation4 />
        <Variation5 />
        <Variation6 />
      </div>
    </div>
  );
}
