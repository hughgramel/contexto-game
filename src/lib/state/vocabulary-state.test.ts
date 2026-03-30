import { beforeEach, describe, expect, it } from "vitest";

import {
  getKnownWordCount,
  getLearningWordCount,
  getWordStatus,
  removeTrackedWord,
  resetVocabularyState,
  setWordKnown,
  setWordLearning,
  getVocabularyEntries,
} from "@/lib/state/vocabulary-state";

describe("vocabulary state", () => {
  beforeEach(() => {
    localStorage.clear();
    resetVocabularyState();
  });

  it("treats missing words as unknown", () => {
    expect(getWordStatus("zh", "aurora")).toBe("unknown");
  });

  it("tracks learning and known word transitions within a language", () => {
    setWordLearning("zh", "aurora", "Aurora");
    expect(getWordStatus("zh", "aurora")).toBe("learning");
    expect(getLearningWordCount("zh")).toBe(1);

    setWordKnown("zh", "aurora", "Aurora");
    expect(getWordStatus("zh", "aurora")).toBe("known");
    expect(getKnownWordCount("zh")).toBe(1);
    expect(getLearningWordCount("zh")).toBe(0);
  });

  it("removes tracked words back to unknown", () => {
    setWordKnown("zh", "tower", "Tower");
    removeTrackedWord("zh", "tower");

    expect(getWordStatus("zh", "tower")).toBe("unknown");
    expect(getKnownWordCount("zh")).toBe(0);
  });

  it("isolates vocabulary across languages", () => {
    setWordKnown("zh", "hello", "Hello");
    setWordLearning("es", "hola", "Hola");

    expect(getWordStatus("zh", "hello")).toBe("known");
    expect(getWordStatus("es", "hello")).toBe("unknown");

    expect(getWordStatus("es", "hola")).toBe("learning");
    expect(getWordStatus("zh", "hola")).toBe("unknown");

    expect(getKnownWordCount("zh")).toBe(1);
    expect(getKnownWordCount("es")).toBe(0);
    expect(getLearningWordCount("es")).toBe(1);
    expect(getLearningWordCount("zh")).toBe(0);
  });

  it("returns empty entries for an untracked language", () => {
    expect(getVocabularyEntries("ko")).toEqual({});
    expect(getKnownWordCount("ko")).toBe(0);
    expect(getLearningWordCount("ko")).toBe(0);
  });

  it("does not overwrite known with learning", () => {
    setWordKnown("ja", "sugoi", "sugoi");
    setWordLearning("ja", "sugoi", "sugoi");
    expect(getWordStatus("ja", "sugoi")).toBe("known");
  });
});
