"use client";

import { observer } from "@legendapp/state/react";
import type { Word } from "@/lib/types";
import { dictionary$ } from "@/lib/state/dictionary-state";

type PanelMode = "word" | "sentence";

interface BottomPanelProps {
  mode: PanelMode;
  lang: string;
  word?: Word | null;
  translation?: string;
  alreadySaved?: boolean;
  onSave?: () => void;
  onClose: () => void;
}

// Inline SVG icons (no lucide-react dependency needed)
function XIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  );
}

const BottomPanel = observer(function BottomPanel({
  mode,
  lang,
  word,
  translation,
  alreadySaved,
  onSave,
  onClose,
}: BottomPanelProps) {
  const isSaved = mode === "sentence" && alreadySaved;
  const isKnown =
    mode === "word" && word
      ? dictionary$[lang]?.[word.targetWord]?.get() === "known"
      : false;

  if (mode === "word" && word) {
    return (
      <div className="w-full px-3">
        <div className="bg-[#1e1e1e] rounded-2xl px-5 py-4 relative min-h-[100px] flex flex-col">
          <button
            type="button"
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-200 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <XIcon />
          </button>

          {/* Native language translation */}
          <div className="flex items-center gap-3 pr-8 mb-3">
            <span className="text-white text-lg font-bold leading-snug">
              {word.nativeWord}
            </span>
          </div>

          {/* Target word with known/unknown toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-white/60 text-lg leading-snug">
                {word.targetWord}
              </span>
            </div>

            <button
              type="button"
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors ${
                isKnown
                  ? "border-emerald-700 bg-emerald-700 text-white"
                  : "border-white text-white hover:border-gray-300 hover:text-gray-200"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onSave?.();
              }}
            >
              <CheckIcon />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Sentence mode
  return (
    <div className="w-full px-3">
      <div className="bg-[#1e1e1e] rounded-2xl px-5 py-4 relative min-h-[100px] flex flex-col">
        <button
          type="button"
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-200 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <XIcon />
        </button>

        <div className="flex items-start gap-3 pr-8 flex-1">
          <span className="text-white text-lg font-medium leading-snug">
            {translation}
          </span>
        </div>

        {/* Bookmark button */}
        <div className="flex justify-end mt-2">
          <button
            type="button"
            className={`transition-colors ${isSaved ? "text-white" : "text-gray-400 hover:text-white"}`}
            onClick={(e) => {
              e.stopPropagation();
              onSave?.();
            }}
          >
            <BookmarkIcon filled={!!isSaved} />
          </button>
        </div>
      </div>
    </div>
  );
});

export { BottomPanel };
export type { PanelMode };
