import { beforeEach, describe, expect, it } from "vitest";

import { syncMediaComprehension } from "@/lib/state/stats-state";
import {
  getOverviewStats,
  getPageReadSnapshot,
  recordPageRead,
  resetStatsState,
} from "@/lib/state/stats-state";
import { resetVocabularyState, setWordKnown, setWordLearning } from "@/lib/state/vocabulary-state";

describe("stats state", () => {
  beforeEach(() => {
    localStorage.clear();
    resetStatsState();
    resetVocabularyState();
  });

  it("records page reads and aggregates totals", () => {
    recordPageRead({
      mediaId: "sample-text",
      pageId: "page-0",
      pageIndex: 0,
      wordsRead: 12,
      knownAtPageStart: 1,
      knownAtPageEnd: 3,
      gainedKnownWords: 2,
      progressPercent: 50,
      createdAt: "2026-03-30T00:00:00.000Z",
    });

    const snapshot = getPageReadSnapshot("sample-text", "page-0");
    const overview = getOverviewStats();

    expect(snapshot?.gainedKnownWords).toBe(2);
    expect(overview.wordsRead).toBe(12);
    expect(overview.pagesCompleted).toBe(1);
  });

  it("combines vocabulary counts with media comprehension totals", () => {
    setWordKnown("aurora", "Aurora");
    setWordLearning("tower", "Tower");
    syncMediaComprehension("sample-text", 4, 10, 50);

    const overview = getOverviewStats();
    expect(overview.wordsKnown).toBe(1);
    expect(overview.wordsLearning).toBe(1);
  });
});
