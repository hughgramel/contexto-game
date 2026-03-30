import { beforeEach, describe, expect, it } from "vitest";

import {
  getKnownWordCount,
  getLearningWordCount,
  getWordStatus,
  removeTrackedWord,
  resetVocabularyState,
  setWordKnown,
  setWordLearning,
} from "@/lib/state/vocabulary-state";

describe("vocabulary state", () => {
  beforeEach(() => {
    localStorage.clear();
    resetVocabularyState();
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
});
