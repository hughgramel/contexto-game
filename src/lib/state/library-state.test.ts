import { beforeEach, describe, expect, it } from "vitest";

import { SAMPLE_MEDIA_RECORD } from "@/lib/content/sample-media";
import { createSampleDocument } from "@/lib/content/sample-media";
import {
  getLibraryMedia,
  removeMediaRecord,
  resetLibraryState,
  upsertMediaRecord,
} from "@/lib/state/library-state";
import { goToNextPage, openReaderDocument, resetReaderState } from "@/lib/state/reader-state";
import { resetStatsState } from "@/lib/state/stats-state";
import { resetVocabularyState } from "@/lib/state/vocabulary-state";

describe("library state", () => {
  beforeEach(() => {
    localStorage.clear();
    resetLibraryState();
    resetReaderState();
    resetStatsState();
    resetVocabularyState();
  });

  it("supports media CRUD", () => {
    upsertMediaRecord(SAMPLE_MEDIA_RECORD);

    expect(getLibraryMedia()).toHaveLength(1);

    upsertMediaRecord({
      ...SAMPLE_MEDIA_RECORD,
      title: "Updated Title",
      updatedAt: "2026-03-30T01:00:00.000Z",
    });

    expect(getLibraryMedia()[0]?.title).toBe("Updated Title");

    removeMediaRecord(SAMPLE_MEDIA_RECORD.id);
    expect(getLibraryMedia()).toHaveLength(0);
  });

  it("derives continue-reading data from saved reader progress", () => {
    upsertMediaRecord(SAMPLE_MEDIA_RECORD);
    const document = createSampleDocument();

    openReaderDocument(document);
    goToNextPage(document);

    const media = getLibraryMedia();
    expect(media[0]?.progressPercent).toBeGreaterThan(0);
    expect(media[0]?.continuePageIndex).toBe(1);
  });
});
