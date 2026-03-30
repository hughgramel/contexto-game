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

function Bars({ widths, height, gap, align = "flex-start" }: { widths: number[]; height: number; gap: number; align?: "flex-start" | "center" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap, alignItems: align }}>
      {widths.map((w, i) => (
        <div
          key={i}
          style={{
            width: w,
            height,
            borderRadius: height / 2,
            backgroundColor: BLUE,
          }}
        />
      ))}
    </div>
  );
}

// --- 3-line variations ---

function V1() {
  return (
    <IconShell label="A1 — 3 fat bars">
      <Bars widths={[270, 240, 190]} height={36} gap={32} />
    </IconShell>
  );
}

function V2() {
  return (
    <IconShell label="A2 — 3 extra-fat, wide">
      <Bars widths={[340, 310, 260]} height={42} gap={30} />
    </IconShell>
  );
}

function V3() {
  return (
    <IconShell label="A3 — 3 fat, centered">
      <Bars widths={[340, 290, 220]} height={38} gap={30} align="center" />
    </IconShell>
  );
}

// --- 4-line variations ---

function V4() {
  return (
    <IconShell label="B1 — 4 fat bars, left">
      <Bars widths={[330, 300, 320, 250]} height={34} gap={24} />
    </IconShell>
  );
}

function V5() {
  return (
    <IconShell label="B2 — 4 extra-fat, wide">
      <Bars widths={[360, 330, 350, 280]} height={40} gap={20} />
    </IconShell>
  );
}

function V6() {
  return (
    <IconShell label="B3 — 4 fat, centered">
      <Bars widths={[340, 290, 320, 240]} height={36} gap={22} align="center" />
    </IconShell>
  );
}

function V7() {
  return (
    <IconShell label="B4 — 4 medium, staggered">
      <Bars widths={[300, 340, 270, 320]} height={32} gap={24} />
    </IconShell>
  );
}

function V8() {
  return (
    <IconShell label="B5 — 4 chunky, tight">
      <Bars widths={[350, 320, 340, 260]} height={38} gap={16} />
    </IconShell>
  );
}

function V9() {
  return (
    <IconShell label="B6 — 4 fat, descending">
      <Bars widths={[360, 310, 260, 200]} height={36} gap={22} />
    </IconShell>
  );
}

function V10() {
  return (
    <IconShell label="B7 — 4 fat, centered descending">
      <Bars widths={[350, 300, 250, 190]} height={36} gap={22} align="center" />
    </IconShell>
  );
}

function V11() {
  return (
    <IconShell label="B8 — 4 thicc, minimal gap">
      <Bars widths={[370, 340, 360, 290]} height={42} gap={14} />
    </IconShell>
  );
}

// --- 5-line variations ---

function V12() {
  return (
    <IconShell label="C1 — 5 bars, tight">
      <Bars widths={[340, 310, 330, 290, 240]} height={28} gap={18} />
    </IconShell>
  );
}

function V13() {
  return (
    <IconShell label="C2 — 5 bars, wide + fat">
      <Bars widths={[360, 330, 350, 300, 260]} height={32} gap={14} />
    </IconShell>
  );
}

// --- B2 sub-iterations: same widths [360, 330, 350, 280], varying thickness ---

function B2_1() {
  return (
    <IconShell label="B2.1 — height 28">
      <Bars widths={[360, 330, 350, 280]} height={28} gap={24} />
    </IconShell>
  );
}

function B2_2() {
  return (
    <IconShell label="B2.2 — height 34">
      <Bars widths={[360, 330, 350, 280]} height={34} gap={22} />
    </IconShell>
  );
}

function B2_3() {
  return (
    <IconShell label="B2.3 — height 40 (original)">
      <Bars widths={[360, 330, 350, 280]} height={40} gap={20} />
    </IconShell>
  );
}

function B2_4() {
  return (
    <IconShell label="B2.4 — height 46">
      <Bars widths={[360, 330, 350, 280]} height={46} gap={16} />
    </IconShell>
  );
}

function B2_5() {
  return (
    <IconShell label="B2.5 — height 52">
      <Bars widths={[360, 330, 350, 280]} height={52} gap={12} />
    </IconShell>
  );
}

function B2_6() {
  return (
    <IconShell label="B2.6 — height 58">
      <Bars widths={[360, 330, 350, 280]} height={58} gap={8} />
    </IconShell>
  );
}

export default function IconsPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6", padding: 32 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Contexto — Fat Bar Iterations</h1>
      <p style={{ color: "#888", marginBottom: 32 }}>
        3-line (A), 4-line (B), 5-line (C). Varying thickness, width, alignment, gap.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 40 }}>
        <V1 />
        <V2 />
        <V3 />
        <V4 />
        <V5 />
        <V6 />
        <V7 />
        <V8 />
        <V9 />
        <V10 />
        <V11 />
        <V12 />
        <V13 />
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 60, marginBottom: 8 }}>B2 Sub-iterations — Line Thickness</h2>
      <p style={{ color: "#888", marginBottom: 32 }}>Same widths [360, 330, 350, 280], thickness from 28 to 58.</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 40 }}>
        <B2_1 />
        <B2_2 />
        <B2_3 />
        <B2_4 />
        <B2_5 />
        <B2_6 />
      </div>
    </div>
  );
}
