"use client";

import { observer } from "@legendapp/state/react";
import type { Word } from "@/lib/types";
import { dictionary$ } from "@/lib/state/dictionary-state";

// ---------------------------------------------------------------------------
// Word status colors — matched from web-feed
// ---------------------------------------------------------------------------

/** Unknown word — amber background to draw attention. */
const BG_UNKNOWN = "bg-[#FBBA00]";
/** Learning word — softer yellow to show partial progress. */
const BG_LEARNING = "bg-[#FFEBA1]";
/** Selection highlight — blue band wrapping selected words. */
export const COLOR_SELECTION = "#0c92f1";

// ---------------------------------------------------------------------------
// WordSpan
// ---------------------------------------------------------------------------

/**
 * A single word in the reader. Background color reflects learning status.
 *
 * Wrapped in `observer()` so it re-renders only when its own word's dictionary
 * status changes, not when other words change.
 */
export const WordSpan = observer(function WordSpan({
  word,
  isSelected,
  index,
  onPointerDown,
}: {
  word: Word;
  isSelected: boolean;
  index: number;
  onPointerDown: (index: number, rect: DOMRect) => void;
}) {
  const status = dictionary$[word.targetWord].get();

  const bg = isSelected
    ? "bg-transparent"
    : status === "known"
      ? "bg-transparent"
      : status === "learning"
        ? BG_LEARNING
        : BG_UNKNOWN;

  // Light mode: known words blend into white bg with normal dark text
  const textColor = isSelected
    ? "text-white"
    : status === "known"
      ? "text-black/70"
      : "text-[#111827]";

  return (
    <span
      data-word-index={index}
      className="cursor-pointer select-none inline-flex flex-col items-center mb-[9px]"
      style={{ lineHeight: "2" }}
      onPointerDown={(e) => {
        e.preventDefault();
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        onPointerDown(index, rect);
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <span
        className={`${bg} ${textColor} rounded-md font-semibold`}
        style={{ padding: "0px 3px" }}
      >
        {word.displayText}
      </span>
    </span>
  );
});

// ---------------------------------------------------------------------------
// SpaceSpan
// ---------------------------------------------------------------------------

/** Inert whitespace between words. Not wrapped in observer() — reads no observables. */
export function SpaceSpan({ index }: { index: number }) {
  return (
    <span
      data-space-after={index}
      className="select-none"
      style={{ lineHeight: "2" }}
    >
      {" "}
    </span>
  );
}
