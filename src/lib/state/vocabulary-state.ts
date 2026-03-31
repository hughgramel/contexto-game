import { observable } from "@legendapp/state";
import { persistObservable } from "@legendapp/state/persist";

import type { WordEntry } from "@/lib/reader/models";
import { LANGUAGES } from "@/lib/mock-data";

import { appState$ } from "./app-state";
import { ensureLocalPersistenceConfigured } from "./persistence";

export const VOCABULARY_PERSIST_KEY = "contexto-vocabulary-state";

export type VocabularyState = {
  byLanguage: Record<string, Record<string, WordEntry>>;
};

export function createInitialVocabularyState(): VocabularyState {
  return {
    byLanguage: {},
  };
}

ensureLocalPersistenceConfigured();

export const vocabularyState$ = observable(createInitialVocabularyState());

persistObservable(vocabularyState$, {
  local: VOCABULARY_PERSIST_KEY,
});

function getActiveLanguage(): string {
  return appState$.language.get();
}

function languageEntries(lang: string): Record<string, WordEntry> {
  return vocabularyState$.byLanguage[lang].get() ?? {};
}

function uniqueSurfaceForms(existing: string[], nextSurface?: string): string[] {
  if (!nextSurface) {
    return existing;
  }

  return Array.from(new Set([...existing, nextSurface]));
}

export function resetVocabularyState(): void {
  vocabularyState$.set(createInitialVocabularyState());
}

export function getVocabularyEntries(lang?: string): Record<string, WordEntry> {
  return languageEntries(lang ?? getActiveLanguage());
}

export function getWordStatus(normalized: string, lang?: string): WordEntry["status"] | "unknown" {
  const l = lang ?? getActiveLanguage();
  return vocabularyState$.byLanguage[l]?.[normalized]?.status.get() ?? "unknown";
}

export function setWordLearning(normalized: string, surface?: string, lang?: string): void {
  const l = lang ?? getActiveLanguage();
  const existing = vocabularyState$.byLanguage[l]?.[normalized]?.get();

  if (existing?.status === "known") {
    return;
  }

  vocabularyState$.byLanguage[l][normalized].set({
    normalized,
    status: "learning",
    surfaceForms: uniqueSurfaceForms(existing?.surfaceForms ?? [], surface),
    updatedAt: new Date().toISOString(),
  });
}

export function setWordKnown(normalized: string, surface?: string, lang?: string): void {
  const l = lang ?? getActiveLanguage();
  const existing = vocabularyState$.byLanguage[l]?.[normalized]?.get();

  vocabularyState$.byLanguage[l][normalized].set({
    normalized,
    status: "known",
    surfaceForms: uniqueSurfaceForms(existing?.surfaceForms ?? [], surface),
    updatedAt: new Date().toISOString(),
  });
}

export function removeTrackedWord(normalized: string, lang?: string): void {
  const l = lang ?? getActiveLanguage();
  vocabularyState$.byLanguage[l][normalized].delete();
}

export function getKnownWordCount(lang?: string): number {
  return Object.values(getVocabularyEntries(lang)).filter(
    (entry) => entry.status === "known",
  ).length;
}

export function getLearningWordCount(lang?: string): number {
  return Object.values(getVocabularyEntries(lang)).filter(
    (entry) => entry.status === "learning",
  ).length;
}

export function getKnownWordCountByLanguage(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const lang of LANGUAGES) {
    const count = getKnownWordCount(lang.code);
    if (count > 0) {
      counts[lang.code] = count;
    }
  }
  return counts;
}

export type SortedLanguageOption = {
  code: string;
  label: string;
  flag: string;
  knownCount: number;
};

export function getSortedLanguageOptions(): SortedLanguageOption[] {
  return LANGUAGES.map((lang) => ({
    ...lang,
    knownCount: getKnownWordCount(lang.code),
  })).sort((a, b) => b.knownCount - a.knownCount);
}
