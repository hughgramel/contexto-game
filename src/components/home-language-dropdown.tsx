"use client";

import { useState } from "react";
import { observer, useSelector } from "@legendapp/state/react";

import { appState$, setLanguage } from "@/lib/state/app-state";
import { getSortedLanguageOptions } from "@/lib/state/vocabulary-state";
import { LANGUAGES } from "@/lib/mock-data";

export const HomeLanguageDropdown = observer(function HomeLanguageDropdown() {
  const [open, setOpen] = useState(false);
  const hasHydrated = appState$.preferences.hasHydrated.get();
  const currentCode = appState$.language.get();
  const effectiveCode = hasHydrated ? currentCode : "zh";
  const current = LANGUAGES.find((l) => l.code === effectiveCode) ?? LANGUAGES[0];
  const options = useSelector(() => getSortedLanguageOptions());

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Select language"
        className="flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-800/60 px-3 py-1.5 text-sm transition hover:bg-slate-700/60"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <svg
          width={12}
          height={12}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="text-slate-400"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-[10rem] rounded-xl border border-white/10 bg-slate-900 py-1 shadow-lg">
          {options.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setOpen(false);
              }}
              className={[
                "flex w-full items-center gap-2 px-3 py-2 text-sm transition hover:bg-white/5",
                lang.code === effectiveCode
                  ? "text-white font-medium"
                  : "text-slate-400",
              ].join(" ")}
            >
              <span className="text-base leading-none">{lang.flag}</span>
              <span className="flex-1 text-left">{lang.label}</span>
              {lang.knownCount > 0 && (
                <span className="text-xs text-emerald-400">{lang.knownCount}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});
