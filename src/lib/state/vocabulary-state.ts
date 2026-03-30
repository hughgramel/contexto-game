import { observable } from "@legendapp/state";
import { persistObservable } from "@legendapp/state/persist";

import type { WordEntry } from "@/lib/reader/models";

import { ensureLocalPersistenceConfigured } from "./persistence";

export const VOCABULARY_PERSIST_KEY = "contexto-vocabulary-state";

/**
 * Language-keyed vocabulary state.
 * Shape: { entries: { [langCode]: { [normalizedWord]: WordEntry } } }
 */
export type VocabularyState = {
  entries: Record<string, Record<string, WordEntry>>;
};

export function createInitialVocabularyState(): VocabularyState {
  return {
    entries: {},
  };
}

ensureLocalPersistenceConfigured();

export const vocabularyState$ = observable(createInitialVocabularyState());

persistObservable(vocabularyState$, {
  local: VOCABULARY_PERSIST_KEY,
});

function uniqueSurfaceForms(existing: string[], nextSurface?: string): string[] {
  if (!nextSurface) {
    return existing;
  }

  return Array.from(new Set([...existing, nextSurface]));
}

export function resetVocabularyState(): void {
  vocabularyState$.set(createInitialVocabularyState());
}

export function getVocabularyEntries(lang: string): Record<string, WordEntry> {
  return vocabularyState$.entries[lang].get() ?? {};
}

export function getWordStatus(lang: string, normalized: string): WordEntry["status"] | "unknown" {
  return vocabularyState$.entries[lang]?.[normalized]?.status.get() ?? "unknown";
}

export function setWordLearning(lang: string, normalized: string, surface?: string): void {
  const existing = vocabularyState$.entries[lang]?.[normalized]?.get();

  if (existing?.status === "known") {
    return;
  }

  vocabularyState$.entries[lang][normalized].set({
    normalized,
    status: "learning",
    surfaceForms: uniqueSurfaceForms(existing?.surfaceForms ?? [], surface),
    updatedAt: new Date().toISOString(),
  });
}

export function setWordKnown(lang: string, normalized: string, surface?: string): void {
  const existing = vocabularyState$.entries[lang]?.[normalized]?.get();

  vocabularyState$.entries[lang][normalized].set({
    normalized,
    status: "known",
    surfaceForms: uniqueSurfaceForms(existing?.surfaceForms ?? [], surface),
    updatedAt: new Date().toISOString(),
  });
}

export function removeTrackedWord(lang: string, normalized: string): void {
  vocabularyState$.entries[lang][normalized].delete();
}

export function getKnownWordCount(lang: string): number {
  return Object.values(getVocabularyEntries(lang)).filter(
    (entry) => entry.status === "known",
  ).length;
}

export function getLearningWordCount(lang: string): number {
  return Object.values(getVocabularyEntries(lang)).filter(
    (entry) => entry.status === "learning",
  ).length;
}
