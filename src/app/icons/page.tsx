"use client";

const BLUE = "#1489E8";
const BLUE_DARK = "#0D6DC4";
const BLUE_LIGHT = "#5AB0F5";
const WHITE = "#FFFFFF";
const INNER_BG = "#F2F7FC";

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
          background: `linear-gradient(180deg, ${BLUE_LIGHT} 0%, ${BLUE} 25%, ${BLUE_DARK} 100%)`,
          boxShadow: `0 12px 32px rgba(20, 137, 232, 0.4), inset 0 2px 0 rgba(255,255,255,0.15)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 26,
            left: 26,
            right: 26,
            bottom: 72,
            borderRadius: 86,
            background: `linear-gradient(180deg, ${WHITE} 0%, ${INNER_BG} 100%)`,
            boxShadow: `inset 0 2px 8px rgba(255,255,255,0.9), 0 4px 8px rgba(0,0,0,0.06)`,
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

/** 1: Open book — two pages side by side */
function OpenBookIcon() {
  return (
    <IconShell label="1 — Open Book">
      <div style={{ position: "relative", width: 320, height: 260 }}>
        {/* Left page */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 8,
            width: 152,
            height: 244,
            borderRadius: "16px 4px 4px 16px",
            border: `10px solid ${BLUE}`,
            borderRight: "none",
          }}
        />
        {/* Right page */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 8,
            width: 152,
            height: 244,
            borderRadius: "4px 16px 16px 4px",
            border: `10px solid ${BLUE}`,
            borderLeft: "none",
          }}
        />
        {/* Spine */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            top: 0,
            width: 12,
            height: 260,
            borderRadius: 6,
            backgroundColor: BLUE,
          }}
        />
        {/* Left text lines */}
        {[0, 1, 2, 3].map((i) => (
          <div
            key={`l${i}`}
            style={{
              position: "absolute",
              left: 28,
              top: 55 + i * 45,
              width: 90 - i * 8,
              height: 16,
              borderRadius: 8,
              backgroundColor: BLUE,
              opacity: 0.45,
            }}
          />
        ))}
        {/* Right text lines */}
        {[0, 1, 2, 3].map((i) => (
          <div
            key={`r${i}`}
            style={{
              position: "absolute",
              left: 178,
              top: 55 + i * 45,
              width: 90 - i * 8,
              height: 16,
              borderRadius: 8,
              backgroundColor: BLUE,
              opacity: 0.45,
            }}
          />
        ))}
      </div>
    </IconShell>
  );
}

/** 2: Horizontal text bars — stacked, decreasing width */
function TextLinesIcon() {
  return (
    <IconShell label="2 — Text Lines">
      <div style={{ display: "flex", flexDirection: "column", gap: 30, alignItems: "flex-start" }}>
        {[260, 230, 250, 180].map((w, i) => (
          <div
            key={i}
            style={{
              width: w,
              height: 24,
              borderRadius: 12,
              backgroundColor: BLUE,
              opacity: 0.85 - i * 0.1,
            }}
          />
        ))}
      </div>
    </IconShell>
  );
}

/** 3: Closed book with spine + bookmark */
function BookmarkIcon() {
  return (
    <IconShell label="3 — Book + Bookmark">
      <div style={{ position: "relative", width: 240, height: 300 }}>
        {/* Book body */}
        <div
          style={{
            width: 240,
            height: 300,
            borderRadius: 18,
            border: `10px solid ${BLUE}`,
          }}
        />
        {/* Spine */}
        <div
          style={{
            position: "absolute",
            left: 50,
            top: 0,
            width: 10,
            height: 300,
            backgroundColor: BLUE,
            borderRadius: 5,
          }}
        />
        {/* Page lines */}
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 82,
              top: 70 + i * 48,
              width: 115 - i * 12,
              height: 16,
              borderRadius: 8,
              backgroundColor: BLUE,
              opacity: 0.45,
            }}
          />
        ))}
        {/* Bookmark */}
        <div
          style={{
            position: "absolute",
            right: 30,
            top: 0,
            width: 36,
            height: 65,
            backgroundColor: BLUE,
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 72%, 0 100%)",
          }}
        />
      </div>
    </IconShell>
  );
}

/** 4: Bold "C" arc with text lines */
function CBrandIcon() {
  return (
    <IconShell label="4 — C + Lines">
      <div style={{ position: "relative", width: 300, height: 280 }}>
        {/* C shape — thick border circle with gap on right */}
        <div
          style={{
            width: 240,
            height: 240,
            borderRadius: "50%",
            border: `28px solid ${BLUE}`,
            borderRight: "28px solid transparent",
            transform: "rotate(-30deg)",
            position: "absolute",
            top: 20,
            left: -10,
          }}
        />
        {/* Three text lines */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              right: 0,
              top: 80 + i * 48,
              width: 140 - i * 16,
              height: 20,
              borderRadius: 10,
              backgroundColor: BLUE,
              opacity: 0.55,
            }}
          />
        ))}
      </div>
    </IconShell>
  );
}

/** 5: Minimal butterfly book — just two curved wings + spine */
function MinimalBookIcon() {
  return (
    <IconShell label="5 — Minimal Book">
      <div style={{ position: "relative", width: 310, height: 250 }}>
        {/* Left wing */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 148,
            height: 240,
            borderRadius: "100px 8px 8px 24px",
            border: `10px solid ${BLUE}`,
            borderRight: "none",
          }}
        />
        {/* Right wing */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: 148,
            height: 240,
            borderRadius: "8px 100px 24px 8px",
            border: `10px solid ${BLUE}`,
            borderLeft: "none",
          }}
        />
        {/* Spine */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            top: -10,
            width: 12,
            height: 262,
            borderRadius: 6,
            backgroundColor: BLUE,
          }}
        />
      </div>
    </IconShell>
  );
}

/** 6: Document with folded corner + text lines */
function PageIcon() {
  return (
    <IconShell label="6 — Document">
      <div style={{ position: "relative", width: 230, height: 290 }}>
        {/* Page body */}
        <div
          style={{
            width: 230,
            height: 290,
            borderRadius: 16,
            border: `10px solid ${BLUE}`,
          }}
        />
        {/* Dog-ear: cover the top-right corner with bg color */}
        <div
          style={{
            position: "absolute",
            top: -2,
            right: -2,
            width: 56,
            height: 56,
            background: `linear-gradient(135deg, ${INNER_BG} 50%, transparent 50%)`,
            borderTopRightRadius: 16,
          }}
        />
        {/* Dog-ear fold line */}
        <div
          style={{
            position: "absolute",
            top: 44,
            right: 0,
            width: 50,
            height: 10,
            borderRadius: "5px 0 0 5px",
            backgroundColor: BLUE,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 44,
            width: 10,
            height: 50,
            borderRadius: "0 0 5px 5px",
            backgroundColor: BLUE,
          }}
        />
        {/* Text lines */}
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 34,
              top: 85 + i * 46,
              width: 145 - i * 14,
              height: 16,
              borderRadius: 8,
              backgroundColor: BLUE,
              opacity: 0.5,
            }}
          />
        ))}
      </div>
    </IconShell>
  );
}

export default function IconsPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6", padding: 32 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Contexto — PWA Icon Variations</h1>
      <p style={{ color: "#888", marginBottom: 32 }}>
        512x512. Pure React/CSS. Blue: {BLUE}. Bottom: 72px thick.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 40 }}>
        <OpenBookIcon />
        <TextLinesIcon />
        <BookmarkIcon />
        <CBrandIcon />
        <MinimalBookIcon />
        <PageIcon />
      </div>
    </div>
  );
}
