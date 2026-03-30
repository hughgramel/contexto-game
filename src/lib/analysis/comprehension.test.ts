import { describe, expect, it } from "vitest";

import { createSampleDocument } from "@/lib/content/sample-media";
import {
  analyzeDocumentComprehension,
  analyzeWordCounts,
} from "@/lib/analysis/comprehension";
import {
  getVocabularyEntries,
  resetVocabularyState,
  setWordKnown,
  setWordLearning,
} from "@/lib/state/vocabulary-state";

describe("comprehension analysis", () => {
  it("counts only known words toward comprehension percent", () => {
    resetVocabularyState();
    setWordKnown("zh", "aurora", "Aurora");
    setWordLearning("zh", "tower", "Tower");

    const analysis = analyzeWordCounts(
      {
        aurora: 2,
        tower: 2,
        river: 1,
      },
      getVocabularyEntries("zh"),
    );

    expect(analysis.totalTokens).toBe(5);
    expect(analysis.knownTokens).toBe(2);
    expect(analysis.learningTokens).toBe(2);
    expect(analysis.unknownTokens).toBe(1);
    expect(analysis.comprehensionPercent).toBe(40);
  });

  it("recomputes whole-media comprehension from the saved frequency map", () => {
    resetVocabularyState();
    setWordKnown("zh", "tower", "Tower");
    setWordKnown("zh", "gardens", "gardens");

    const document = createSampleDocument();
    const analysis = analyzeDocumentComprehension(document, "zh");

    expect(analysis.totalTokens).toBe(document.totalWordTokens);
    expect(analysis.knownTokens).toBe(
      document.frequencyByWord.tower + document.frequencyByWord.gardens,
    );
    expect(analysis.learningTokens).toBe(0);
    expect(analysis.comprehensionPercent).toBeGreaterThan(0);
    expect(analysis.comprehensionPercent).toBeLessThanOrEqual(100);
  });
});
