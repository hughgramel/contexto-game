"use client";

import type { ReactNode } from "react";

type SafeAreaShellProps = {
  children: ReactNode;
  className?: string;
};

export function SafeAreaShell({ children, className }: SafeAreaShellProps) {
  return (
    <div
      className={`min-h-[100svh] w-full overflow-hidden bg-slate-950 text-slate-50 ${className ?? ""}`}
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
      }}
    >
      {children}
    </div>
  );
}
