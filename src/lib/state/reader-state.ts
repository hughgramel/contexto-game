import { observable } from "@legendapp/state";
import type { Word } from "../types";

/** Bounding rect for positioning the floating popup near a word. */
export type PopupAnchor = {
  top: number;
  left: number;
  bottom: number;
  right: number;
  width: number;
  height: number;
};

/** Currently selected word range (drag-to-select). */
export const selectedRange$ = observable<{ start: number; end: number } | null>(null);

/** Whether the drag selection has been finalized (pointer released after drag). */
export const selectionFinalized$ = observable(false);

/** The word currently shown in the single-word translation popup. */
export const wordTranslationWord$ = observable<Word | null>(null);

/** Anchor rect for positioning the floating popup. */
export const wordPopupAnchor$ = observable<PopupAnchor | null>(null);

export function clearSelection(): void {
  selectedRange$.set(null);
  selectionFinalized$.set(false);
  wordPopupAnchor$.set(null);
}

export function clearWordTranslation(): void {
  wordTranslationWord$.set(null);
  wordPopupAnchor$.set(null);
}
