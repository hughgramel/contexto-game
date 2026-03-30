/**
 * Popup state derivation hook for the reader.
 *
 * Reads reader/selection observables to determine which popup mode to display
 * (word or sentence), what content to show, and provides stable save/close
 * handlers that read state at call-time.
 */

import { useCallback } from "react";
import type { Word } from "@/lib/types";
import type { PopupMode } from "@/components/reader/word-popup";
import type { PopupAnchor } from "@/lib/state/reader-state";
import {
  wordTranslationWord$,
  clearWordTranslation,
  selectedRange$,
  selectionFinalized$,
  clearSelection,
  wordPopupAnchor$,
} from "@/lib/state/reader-state";
import {
  savedSentences$,
  getSentenceKey,
  saveSentence,
  removeSentence,
  setWordStatus,
  removeWord,
  dictionary$,
} from "@/lib/state/dictionary-state";

interface PanelState {
  popupMode: PopupMode | null;
  popupAnchor: PopupAnchor | null;
  wordTranslationWord: Word | null;
  translationText: string;
  alreadySaved: boolean;
  handleSave: () => void;
  handleClose: () => void;
}

function derivePopupMode(): PopupMode | null {
  const word = wordTranslationWord$.get();
  const range = selectedRange$.get();
  if (word) return "word";
  if (range && range.start !== range.end && selectionFinalized$.get()) return "sentence";
  return null;
}

export function usePanelState(words: Word[], articleId: string, lang: string): PanelState {
  const wordTranslationWord = wordTranslationWord$.get();
  const range = selectedRange$.get();
  const popupAnchor = wordPopupAnchor$.get();

  let translationText = "";
  let alreadySaved = false;
  if (range && words.length > 0) {
    const selectedWords = words.slice(range.start, range.end + 1);
    translationText = selectedWords.map((w) => w.nativeWord).join(" ");
    const key = getSentenceKey(articleId, range.start, range.end);
    alreadySaved = savedSentences$[key].get() !== undefined;
  }

  let popupMode: PopupMode | null = null;
  if (wordTranslationWord) {
    popupMode = "word";
  } else if (range && range.start !== range.end && selectionFinalized$.get()) {
    popupMode = "sentence";
  }

  const handleSave = useCallback(() => {
    const mode = derivePopupMode();
    const currentRange = selectedRange$.get();
    const currentWord = wordTranslationWord$.get();

    if (mode === "sentence" && currentRange) {
      const key = getSentenceKey(articleId, currentRange.start, currentRange.end);
      const isSaved = savedSentences$[key].get() !== undefined;
      if (isSaved) {
        removeSentence(articleId, currentRange.start, currentRange.end);
      } else {
        if (words.length > 0) {
          const text = words
            .slice(currentRange.start, currentRange.end + 1)
            .map((w) => w.nativeWord)
            .join(" ");
          saveSentence(articleId, currentRange.start, currentRange.end, text);
        }
      }
    } else if (mode === "word" && currentWord) {
      const currentStatus = dictionary$[lang]?.[currentWord.targetWord]?.get();
      if (currentStatus === "known") {
        removeWord(lang, currentWord.targetWord);
      } else {
        setWordStatus(lang, currentWord.targetWord, "known");
      }
    }
  }, [articleId, words, lang]);

  const handleClose = useCallback(() => {
    clearWordTranslation();
    clearSelection();
  }, []);

  return {
    popupMode,
    popupAnchor,
    wordTranslationWord,
    translationText,
    alreadySaved,
    handleSave,
    handleClose,
  };
}
