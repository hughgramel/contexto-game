import { observable } from "@legendapp/state";
import { persistObservable } from "@legendapp/state/persist";

import type { WordEntry } from "@/lib/reader/models";

import { ensureLocalPersistenceConfigured } from "./persistence";

export const VOCABULARY_PERSIST_KEY = "contexto-vocabulary-state";

export type VocabularyState = {
  entries: Record<string, WordEntry>;
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

export function getVocabularyEntries(): Record<string, WordEntry> {
  return vocabularyState$.entries.get();
}

export function getWordStatus(normalized: string): WordEntry["status"] | "unknown" {
  return vocabularyState$.entries[normalized].status.get() ?? "unknown";
}

export function setWordLearning(normalized: string, surface?: string): void {
  const existing = vocabularyState$.entries[normalized].get();

  if (existing?.status === "known") {
    return;
  }

  vocabularyState$.entries[normalized].set({
    normalized,
    status: "learning",
    surfaceForms: uniqueSurfaceForms(existing?.surfaceForms ?? [], surface),
    updatedAt: new Date().toISOString(),
  });
}

export function setWordKnown(normalized: string, surface?: string): void {
  const existing = vocabularyState$.entries[normalized].get();

  vocabularyState$.entries[normalized].set({
    normalized,
    status: "known",
    surfaceForms: uniqueSurfaceForms(existing?.surfaceForms ?? [], surface),
    updatedAt: new Date().toISOString(),
  });
}

export function removeTrackedWord(normalized: string): void {
  vocabularyState$.entries[normalized].delete();
}

export function getKnownWordCount(): number {
  return Object.values(getVocabularyEntries()).filter(
    (entry) => entry.status === "known",
  ).length;
}

export function getLearningWordCount(): number {
  return Object.values(getVocabularyEntries()).filter(
    (entry) => entry.status === "learning",
  ).length;
}
