import { batch, observable, computed } from "@legendapp/state";
import { persistObservable } from "@legendapp/state/persist";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";

import { ensureLocalPersistenceConfigured } from "./persistence";

ensureLocalPersistenceConfigured();

// ---------------------------------------------------------------------------
// Vocabulary dictionary
// ---------------------------------------------------------------------------

/** Word learning status: "known" (mastered) or "learning" (seen but not mastered). */
export type WordStatus = "known" | "learning";

/**
 * Per-word learning status. Keys are normalized target-language words.
 * Words absent from the map are considered "unknown" (never tapped).
 */
export const dictionary$ = observable<Record<string, WordStatus>>({});

persistObservable(dictionary$, {
  local: "contexto-dictionary",
  pluginLocal: ObservablePersistLocalStorage,
});

/** Number of words the user has marked as "known". */
export const knownWordsCount$ = computed(() => {
  const dict = dictionary$.get();
  return Object.values(dict).filter((s) => s === "known").length;
});

/** Number of words the user has marked as "learning". */
export const learningWordsCount$ = computed(() => {
  const dict = dictionary$.get();
  return Object.values(dict).filter((s) => s === "learning").length;
});

export function setWordStatus(word: string, status: WordStatus): void {
  batch(() => {
    dictionary$[word].set(status);
  });
}

export function removeWord(word: string): void {
  batch(() => {
    dictionary$[word].delete();
  });
}

export function getWordStatus(word: string): WordStatus | undefined {
  return dictionary$[word].get();
}

export function rotateWordStatus(word: string): void {
  batch(() => {
    const current = dictionary$[word].get();
    if (!current) {
      dictionary$[word].set("learning");
    } else if (current === "learning") {
      dictionary$[word].set("known");
    } else {
      dictionary$[word].delete();
    }
  });
}

// ---------------------------------------------------------------------------
// Saved sentences
// ---------------------------------------------------------------------------

/**
 * Bookmarked sentence translations. Key format: "articleId:startIdx:endIdx".
 * Value is the native-language translation text.
 */
export const savedSentences$ = observable<Record<string, string>>({});

persistObservable(savedSentences$, {
  local: "contexto-saved-sentences",
  pluginLocal: ObservablePersistLocalStorage,
});

export function getSentenceKey(
  articleId: string,
  startIdx: number,
  endIdx: number,
): string {
  return `${articleId}:${startIdx}:${endIdx}`;
}

export function isSentenceSaved(
  articleId: string,
  startIdx: number,
  endIdx: number,
): boolean {
  const key = getSentenceKey(articleId, startIdx, endIdx);
  return savedSentences$[key].get() !== undefined;
}

export function saveSentence(
  articleId: string,
  startIdx: number,
  endIdx: number,
  text: string,
): void {
  const key = getSentenceKey(articleId, startIdx, endIdx);
  savedSentences$[key].set(text);
}

export function removeSentence(
  articleId: string,
  startIdx: number,
  endIdx: number,
): void {
  const key = getSentenceKey(articleId, startIdx, endIdx);
  savedSentences$[key].delete();
}
