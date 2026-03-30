"use client";

import { useMemo } from "react";
import { observer } from "@legendapp/state/react";
import type { Word } from "@/lib/types";
import { selectedRange$ } from "@/lib/state/reader-state";
import { useDragToSelect } from "@/hooks/use-drag-to-select";
import { WordSpan, SpaceSpan, COLOR_SELECTION } from "./word-span";

// ---------------------------------------------------------------------------
// Element builder
// ---------------------------------------------------------------------------

/**
 * Build the transcript JSX element array, grouping selected words in a
 * continuous blue highlight wrapper.
 *
 * The wrapper uses `box-decoration-break: clone` so the blue band renders
 * correctly even when the selection wraps across multiple lines.
 */
function buildTranscriptElements(
  words: Word[],
  range: { start: number; end: number } | null,
  handlePointerDown: (index: number, rect: DOMRect) => void,
  keyPrefix: string,
): React.ReactNode[] {
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < words.length) {
    const isInRange = range && i >= range.start && i <= range.end;

    if (isInRange) {
      const selectedContent: React.ReactNode[] = [];
      const startI = i;
      while (range && i <= range.end && i < words.length) {
        const word = words[i];
        const isLastSelected = i === range.end;
        const isLastWord = i === words.length - 1;

        selectedContent.push(
          <WordSpan
            key={`w-${keyPrefix}-${i}`}
            word={word}
            index={i}
            isSelected={true}
            onPointerDown={handlePointerDown}
          />,
        );

        if (!isLastWord && !isLastSelected) {
          selectedContent.push(
            <SpaceSpan key={`s-${keyPrefix}-${i}`} index={i} />,
          );
        }

        i++;
      }

      const lastSelectedI = i - 1;
      const isLastWord = lastSelectedI === words.length - 1;

      elements.push(
        <span
          key={`sel-${startI}-${range!.end}`}
          className="rounded-md"
          style={{
            background: COLOR_SELECTION,
            padding: "6px 0px",
            boxDecorationBreak: "clone",
            WebkitBoxDecorationBreak: "clone",
          } as React.CSSProperties}
        >
          {selectedContent}
        </span>,
      );

      if (!isLastWord) {
        elements.push(
          <SpaceSpan key={`s-${keyPrefix}-${lastSelectedI}`} index={lastSelectedI} />,
        );
      }
    } else {
      const word = words[i];
      const isLast = i === words.length - 1;

      elements.push(
        <WordSpan
          key={`w-${keyPrefix}-${i}`}
          word={word}
          index={i}
          isSelected={false}
          onPointerDown={handlePointerDown}
        />,
      );

      if (!isLast) {
        elements.push(
          <SpaceSpan key={`s-${keyPrefix}-${i}`} index={i} />,
        );
      }

      i++;
    }
  }

  return elements;
}

// ---------------------------------------------------------------------------
// PageWords — renders word spans for a single page of text
// ---------------------------------------------------------------------------

/**
 * Inline word spans for a single article page.
 * Each page gets its own useDragToSelect hook instance.
 */
export const PageWords = observer(function PageWords({
  words,
  keyPrefix,
}: {
  words: Word[];
  keyPrefix: string;
}) {
  const range = selectedRange$.get();
  const { handlePointerDown } = useDragToSelect(words);

  const elements = useMemo(
    () => buildTranscriptElements(words, range, handlePointerDown, keyPrefix),
    [words, range, handlePointerDown, keyPrefix],
  );

  return <>{elements}</>;
});
