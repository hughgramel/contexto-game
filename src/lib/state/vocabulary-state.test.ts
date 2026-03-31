import { beforeEach, describe, expect, it } from "vitest";

import {
  getKnownWordCount,
  getKnownWordCountByLanguage,
  getLearningWordCount,
  getSortedLanguageOptions,
  getWordStatus,
  removeTrackedWord,
  resetVocabularyState,
  setWordKnown,
  setWordLearning,
} from "@/lib/state/vocabulary-state";
import { setLanguage } from "@/lib/state/app-state";

describe("vocabulary state", () => {
  beforeEach(() => {
    localStorage.clear();
    resetVocabularyState();
    setLanguage("zh");
  });

  it("treats missing words as unknown", () => {
    expect(getWordStatus("aurora")).toBe("unknown");
  });

  it("tracks learning and known word transitions", () => {
    setWordLearning("aurora", "Aurora");
    expect(getWordStatus("aurora")).toBe("learning");
    expect(getLearningWordCount()).toBe(1);

    setWordKnown("aurora", "Aurora");
    expect(getWordStatus("aurora")).toBe("known");
    expect(getKnownWordCount()).toBe(1);
    expect(getLearningWordCount()).toBe(0);
  });

  it("removes tracked words back to unknown", () => {
    setWordKnown("tower", "Tower");
    removeTrackedWord("tower");

    expect(getWordStatus("tower")).toBe("unknown");
    expect(getKnownWordCount()).toBe(0);
  });

  describe("language-scoped vocabulary", () => {
    it("stores words under the active language", () => {
      setWordKnown("hello", "Hello");
      expect(getKnownWordCount("zh")).toBe(1);
      expect(getKnownWordCount("es")).toBe(0);
    });

    it("keeps vocabularies separate across languages", () => {
      setWordKnown("nihao", "你好", "zh");
      setWordKnown("hola", "Hola", "es");
      setWordKnown("bonjour", "Bonjour", "fr");

      expect(getKnownWordCount("zh")).toBe(1);
      expect(getKnownWordCount("es")).toBe(1);
      expect(getKnownWordCount("fr")).toBe(1);
      expect(getKnownWordCount("ja")).toBe(0);
    });

    it("switches active language for implicit operations", () => {
      setWordKnown("nihao", "你好");
      expect(getKnownWordCount()).toBe(1);

      setLanguage("es");
      expect(getKnownWordCount()).toBe(0);

      setWordKnown("hola", "Hola");
      expect(getKnownWordCount()).toBe(1);

      setLanguage("zh");
      expect(getKnownWordCount()).toBe(1);
    });

    it("returns word status scoped to language", () => {
      setWordKnown("tower", "Tower", "zh");
      setWordLearning("tower", "Tower", "es");

      expect(getWordStatus("tower", "zh")).toBe("known");
      expect(getWordStatus("tower", "es")).toBe("learning");
      expect(getWordStatus("tower", "fr")).toBe("unknown");
    });
  });

  describe("derived selectors", () => {
    it("returns known word counts only for languages with words", () => {
      setWordKnown("a", "A", "zh");
      setWordKnown("b", "B", "zh");
      setWordKnown("c", "C", "es");

      const counts = getKnownWordCountByLanguage();
      expect(counts).toEqual({ zh: 2, es: 1 });
      expect(counts["ja"]).toBeUndefined();
    });

    it("sorts language options by known count descending", () => {
      setWordKnown("a", "A", "es");
      setWordKnown("b", "B", "es");
      setWordKnown("c", "C", "zh");

      const sorted = getSortedLanguageOptions();
      expect(sorted[0].code).toBe("es");
      expect(sorted[0].knownCount).toBe(2);
      expect(sorted[1].code).toBe("zh");
      expect(sorted[1].knownCount).toBe(1);
    });

    it("preserves original order when counts tie", () => {
      const sorted = getSortedLanguageOptions();
      expect(sorted.map((o) => o.code)).toEqual(["zh", "es", "ja", "ko", "fr"]);
    });

    it("preserves original order for languages with equal non-zero counts", () => {
      setWordKnown("a", "A", "zh");
      setWordKnown("b", "B", "ja");

      const sorted = getSortedLanguageOptions();
      const withOne = sorted.filter((o) => o.knownCount === 1);
      expect(withOne.map((o) => o.code)).toEqual(["zh", "ja"]);
    });
  });
});
