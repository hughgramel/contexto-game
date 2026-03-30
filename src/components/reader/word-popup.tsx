"use client";

import { observer } from "@legendapp/state/react";
import type { Word } from "@/lib/types";
import { dictionary$ } from "@/lib/state/dictionary-state";
import type { PopupAnchor } from "@/lib/state/reader-state";

type PopupMode = "word" | "sentence";

interface WordPopupProps {
  mode: PopupMode;
  anchor: PopupAnchor;
  lang: string;
  word?: Word | null;
  translation?: string;
  alreadySaved?: boolean;
  onSave?: () => void;
  onClose: () => void;
}

function CheckIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  );
}

/**
 * Compute popup position relative to the anchor word.
 * Prefers below-right; flips above-right if too close to bottom.
 */
function getPopupStyle(anchor: PopupAnchor): React.CSSProperties {
  const POPUP_HEIGHT_ESTIMATE = 90;
  const GAP = 6;
  const MARGIN = 12;

  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const vw = typeof window !== "undefined" ? window.innerWidth : 400;

  const spaceBelow = vh - anchor.bottom;
  const placeAbove = spaceBelow < POPUP_HEIGHT_ESTIMATE + GAP + MARGIN;

  const top = placeAbove
    ? anchor.top - POPUP_HEIGHT_ESTIMATE - GAP
    : anchor.bottom + GAP;

  // Align to word left, clamp within viewport
  let left = anchor.left;
  const popupWidth = Math.min(260, vw - MARGIN * 2);
  if (left + popupWidth > vw - MARGIN) {
    left = vw - popupWidth - MARGIN;
  }
  if (left < MARGIN) left = MARGIN;

  return {
    position: "fixed",
    top: `${Math.max(MARGIN, top)}px`,
    left: `${left}px`,
    width: `${popupWidth}px`,
    zIndex: 50,
  };
}

const WordPopup = observer(function WordPopup({
  mode,
  anchor,
  lang,
  word,
  translation,
  alreadySaved,
  onSave,
  onClose,
}: WordPopupProps) {
  const isKnown =
    mode === "word" && word
      ? dictionary$[lang]?.[word.targetWord]?.get() === "known"
      : false;
  const isSaved = mode === "sentence" && alreadySaved;

  const style = getPopupStyle(anchor);

  if (mode === "word" && word) {
    return (
      <div style={style} className="bg-white rounded-xl shadow-lg border border-black/10 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-black truncate">{word.nativeWord}</p>
            <p className="text-sm text-black/40 truncate">{word.targetWord}</p>
          </div>
          <button
            type="button"
            className={`w-8 h-8 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
              isKnown
                ? "border-emerald-600 bg-emerald-600 text-white"
                : "border-black/20 text-black/30 hover:border-black/40"
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
    );
  }

  // Sentence mode
  return (
    <div style={style} className="bg-white rounded-xl shadow-lg border border-black/10 px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <p className="flex-1 text-sm text-black leading-snug">{translation}</p>
        <button
          type="button"
          className={`shrink-0 transition-colors ${isSaved ? "text-black" : "text-black/20 hover:text-black/50"}`}
          onClick={(e) => {
            e.stopPropagation();
            onSave?.();
          }}
        >
          <BookmarkIcon filled={!!isSaved} />
        </button>
      </div>
    </div>
  );
});

export { WordPopup };
export type { PopupMode };
