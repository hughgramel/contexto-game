/**
 * Gesture hook for reader word interactions.
 *
 * Implements a three-mode interaction on word spans:
 * 1. **Quick tap** (< 200ms): show single-word translation popup.
 * 2. **Hold** (>= 200ms, no drag): same as tap — shows word translation.
 * 3. **Hold + drag**: multi-word selection for sentence translation.
 *
 * Adapted from web-feed's useDragToSelect for reading context (no video playback).
 */

import { useRef, useCallback } from "react";
import type { Word } from "@/lib/types";
import {
  selectedRange$,
  selectionFinalized$,
  clearSelection,
  wordTranslationWord$,
  clearWordTranslation,
  wordPopupAnchor$,
} from "@/lib/state/reader-state";
import { dictionary$, setWordStatus } from "@/lib/state/dictionary-state";

/** Hold duration (ms) before switching from tap mode to drag mode. */
const HOLD_THRESHOLD_MS = 200;

export function useDragToSelect(words: Word[] | undefined) {
  const isDragging = useRef(false);
  const dragStart = useRef<number | null>(null);
  const didDrag = useRef(false);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDragActivated = useRef(false);
  const lastTapRect = useRef<DOMRect | null>(null);
  const lastDragRect = useRef<DOMRect | null>(null);

  /**
   * Show the single-word translation popup for a given word index.
   * Also marks unknown words as "learning" on first tap.
   */
  const showWordTranslation = useCallback(
    (index: number) => {
      if (!words) return;
      const word = words[index];
      if (!word) return;

      clearSelection();
      // Auto-promote unknown words to "learning" on first interaction
      const status = dictionary$[word.targetWord].get();
      if (!status) {
        setWordStatus(word.targetWord, "learning");
      }
      wordTranslationWord$.set(word);
      // Position popup near the tapped word
      if (lastTapRect.current) {
        const r = lastTapRect.current;
        wordPopupAnchor$.set({
          top: r.top,
          left: r.left,
          bottom: r.bottom,
          right: r.right,
          width: r.width,
          height: r.height,
        });
      }
    },
    [words],
  );

  /**
   * Pointer-down handler attached to each word span.
   * Receives the word index and the element's bounding rect.
   */
  const handlePointerDown = useCallback(
    (index: number, rect: DOMRect) => {
      isDragging.current = true;
      dragStart.current = index;
      didDrag.current = false;
      isDragActivated.current = false;
      lastTapRect.current = rect;
      lastDragRect.current = rect;
      selectionFinalized$.set(false);

      // After the hold threshold, switch to drag-selection mode
      holdTimer.current = setTimeout(() => {
        if (isDragging.current) {
          isDragActivated.current = true;
          clearWordTranslation();
          selectedRange$.set({ start: index, end: index });
        }
      }, HOLD_THRESHOLD_MS);

      const handlePointerMove = (e: PointerEvent) => {
        if (!isDragging.current || !isDragActivated.current) return;

        const el = document.elementFromPoint(e.clientX, e.clientY);
        if (!el) return;

        const wordEl = (el as HTMLElement).closest?.("[data-word-index]");
        const spaceEl = (el as HTMLElement).closest?.("[data-space-after]");

        let targetIndex: number | null = null;
        if (wordEl) {
          targetIndex = parseInt((wordEl as HTMLElement).dataset.wordIndex!, 10);
          lastDragRect.current = (wordEl as HTMLElement).getBoundingClientRect();
        } else if (spaceEl) {
          targetIndex = parseInt((spaceEl as HTMLElement).dataset.spaceAfter!, 10);
        }

        if (targetIndex !== null && dragStart.current !== null) {
          const start = Math.min(dragStart.current, targetIndex);
          const end = Math.max(dragStart.current, targetIndex);
          if (end !== dragStart.current || start !== dragStart.current) {
            didDrag.current = true;
          }
          selectedRange$.set({ start, end });
        }
      };

      const handlePointerUp = () => {
        isDragging.current = false;
        if (holdTimer.current) {
          clearTimeout(holdTimer.current);
          holdTimer.current = null;
        }
        document.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerup", handlePointerUp);

        if (!isDragActivated.current) {
          showWordTranslation(index);
        } else if (!didDrag.current) {
          showWordTranslation(index);
        } else {
          // Multi-word drag complete — position popup near end of selection
          selectionFinalized$.set(true);
          if (lastDragRect.current) {
            const r = lastDragRect.current;
            wordPopupAnchor$.set({
              top: r.top,
              left: r.left,
              bottom: r.bottom,
              right: r.right,
              width: r.width,
              height: r.height,
            });
          }
        }
      };

      document.addEventListener("pointermove", handlePointerMove);
      document.addEventListener("pointerup", handlePointerUp);
    },
    [words, showWordTranslation],
  );

  return { handlePointerDown };
}
