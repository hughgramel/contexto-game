import { batch, observable } from "@legendapp/state";
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
 * Language-keyed vocabulary dictionary.
 * Shape: { [langCode]: { [normalizedWord]: WordStatus } }
 * Words absent from a language map are considered "unknown" (never tapped).
 */
export const dictionary$ = observable<Record<string, Record<string, WordStatus>>>({});

persistObservable(dictionary$, {
  local: "contexto-dictionary",
  pluginLocal: ObservablePersistLocalStorage,
});

/** Number of words marked "known" in the given language. */
export function knownWordsCount(lang: string): number {
  const dict = dictionary$[lang].get() ?? {};
  return Object.values(dict).filter((s) => s === "known").length;
}

/** Number of words marked "learning" in the given language. */
export function learningWordsCount(lang: string): number {
  const dict = dictionary$[lang].get() ?? {};
  return Object.values(dict).filter((s) => s === "learning").length;
}

export function setWordStatus(lang: string, word: string, status: WordStatus): void {
  batch(() => {
    dictionary$[lang][word].set(status);
  });
}

export function removeWord(lang: string, word: string): void {
  batch(() => {
    dictionary$[lang][word].delete();
  });
}

export function getWordStatus(lang: string, word: string): WordStatus | undefined {
  return dictionary$[lang]?.[word]?.get();
}

export function rotateWordStatus(lang: string, word: string): void {
  batch(() => {
    const current = dictionary$[lang]?.[word]?.get();
    if (!current) {
      dictionary$[lang][word].set("learning");
    } else if (current === "learning") {
      dictionary$[lang][word].set("known");
    } else {
      dictionary$[lang][word].delete();
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
