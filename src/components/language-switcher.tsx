"use client";

import { useState } from "react";
import { observer } from "@legendapp/state/react";

import { appState$, setLanguage } from "@/lib/state/app-state";
import { LANGUAGES } from "@/lib/mock-data";

export const LanguageSwitcher = observer(function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const hasHydrated = appState$.preferences.hasHydrated.get();
  const currentCode = appState$.language.get();
  // Use the default language until localStorage has hydrated to avoid SSR mismatch
  const effectiveCode = hasHydrated ? currentCode : "zh";
  const current = LANGUAGES.find((l) => l.code === effectiveCode) ?? LANGUAGES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 border border-black/10 px-2.5 py-1.5 text-sm"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="text-black/50">{current.label}</span>
        <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 border border-black/10 bg-white py-1 shadow-sm">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setOpen(false);
              }}
              className={[
                "flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-black/5",
                lang.code === currentCode ? "text-black font-medium" : "text-black/50",
              ].join(" ")}
            >
              <span className="text-base leading-none">{lang.flag}</span>
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});
