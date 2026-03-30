import { beforeEach, describe, expect, it } from "vitest";

import {
  dictionary$,
  knownWordsCount,
  learningWordsCount,
  setWordStatus,
  getWordStatus,
  removeWord,
  rotateWordStatus,
} from "@/lib/state/dictionary-state";

describe("dictionary state", () => {
  beforeEach(() => {
    localStorage.clear();
    dictionary$.set({});
  });

  it("treats missing words as undefined (unknown)", () => {
    expect(getWordStatus("zh", "aurora")).toBeUndefined();
  });

  it("sets and gets word status within a language", () => {
    setWordStatus("zh", "aurora", "learning");
    expect(getWordStatus("zh", "aurora")).toBe("learning");

    setWordStatus("zh", "aurora", "known");
    expect(getWordStatus("zh", "aurora")).toBe("known");
  });

  it("removes a word from a language", () => {
    setWordStatus("zh", "tower", "known");
    removeWord("zh", "tower");
    expect(getWordStatus("zh", "tower")).toBeUndefined();
  });

  it("rotates word status: unknown → learning → known → unknown", () => {
    rotateWordStatus("es", "hola");
    expect(getWordStatus("es", "hola")).toBe("learning");

    rotateWordStatus("es", "hola");
    expect(getWordStatus("es", "hola")).toBe("known");

    rotateWordStatus("es", "hola");
    expect(getWordStatus("es", "hola")).toBeUndefined();
  });

  it("counts known and learning words per language", () => {
    setWordStatus("zh", "a", "known");
    setWordStatus("zh", "b", "learning");
    setWordStatus("zh", "c", "known");
    setWordStatus("es", "x", "learning");

    expect(knownWordsCount("zh")).toBe(2);
    expect(learningWordsCount("zh")).toBe(1);
    expect(knownWordsCount("es")).toBe(0);
    expect(learningWordsCount("es")).toBe(1);
  });

  it("isolates vocabulary across languages", () => {
    setWordStatus("zh", "hello", "known");
    setWordStatus("es", "hello", "learning");

    expect(getWordStatus("zh", "hello")).toBe("known");
    expect(getWordStatus("es", "hello")).toBe("learning");
    expect(getWordStatus("ja", "hello")).toBeUndefined();
  });

  it("returns zero counts for untracked languages", () => {
    expect(knownWordsCount("ko")).toBe(0);
    expect(learningWordsCount("ko")).toBe(0);
  });
});
