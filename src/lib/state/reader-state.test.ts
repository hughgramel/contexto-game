import { beforeEach, describe, expect, it } from "vitest";

import { createSampleDocument, SAMPLE_MEDIA_RECORD } from "@/lib/content/sample-media";
import { upsertMediaRecord, resetLibraryState } from "@/lib/state/library-state";
import {
  closeReader,
  getReaderProgress,
  getVisibleWindowForMedia,
  goToNextPage,
  goToPreviousPage,
  markActiveWordKnown,
  openReaderDocument,
  openWordModalForToken,
  readerUiState$,
  resetReaderState,
  setSentenceSelection,
} from "@/lib/state/reader-state";
import { getPageReadSnapshot, getOverviewStats, resetStatsState } from "@/lib/state/stats-state";
import { getWordStatus, resetVocabularyState } from "@/lib/state/vocabulary-state";

import { setLanguage } from "@/lib/state/app-state";

describe("reader state", () => {
  beforeEach(() => {
    localStorage.clear();
    resetLibraryState();
    resetReaderState();
    resetStatsState();
    resetVocabularyState();
    setLanguage("zh");
    upsertMediaRecord(SAMPLE_MEDIA_RECORD);
  });

  it("opens a document and hydrates progress from page zero", () => {
    const document = createSampleDocument();

    openReaderDocument(document);

    expect(readerUiState$.activeMediaId.get()).toBe(document.mediaId);
    expect(readerUiState$.activePageIndex.get()).toBe(0);
    expect(readerUiState$.currentPageWordIds.get()).toEqual(
      document.pages[0]?.tokens.map((token) => token.id),
    );
    expect(getReaderProgress(document.mediaId)?.progressPercent).toBeGreaterThan(0);
  });

  it("clicking a word opens the modal and marks the word as learning", () => {
    const document = createSampleDocument();
    const token = document.pages[0]?.tokens[0];

    expect(token).toBeDefined();
    if (!token) {
      return;
    }

    openReaderDocument(document);
    openWordModalForToken(document, token.id);

    expect(readerUiState$.wordModal.get()?.tokenId).toBe(token.id);
    expect(getWordStatus(token.normalized)).toBe("learning");
  });

  it("marking known closes the modal and updates known progress for the page", () => {
    const document = createSampleDocument();
    const token = document.pages[0]?.tokens[0];

    expect(token).toBeDefined();
    if (!token) {
      return;
    }

    openReaderDocument(document);
    openWordModalForToken(document, token.id);
    const knownAtStart = readerUiState$.knownAtPageStart.get();

    markActiveWordKnown(document);

    expect(getWordStatus(token.normalized)).toBe("known");
    expect(readerUiState$.wordModal.get()).toBeNull();
    expect(readerUiState$.knownAtPageEnd.get()).toBeGreaterThan(knownAtStart);
  });

  it("moves to the next page, saves progress, and records stats", () => {
    const document = createSampleDocument();
    const token = document.pages[0]?.tokens[0];

    expect(token).toBeDefined();
    if (!token) {
      return;
    }

    openReaderDocument(document);
    openWordModalForToken(document, token.id);
    markActiveWordKnown(document);
    setSentenceSelection(document, document.pages[0]!.tokens[0]!.id, document.pages[0]!.tokens[2]!.id);
    goToNextPage(document);

    const progress = getReaderProgress(document.mediaId);
    const snapshot = getPageReadSnapshot(document.mediaId, document.pages[0]!.id);
    const overview = getOverviewStats();

    expect(readerUiState$.activePageIndex.get()).toBe(1);
    expect(progress?.pageIndex).toBe(1);
    expect(snapshot?.wordsRead).toBe(document.pages[0]?.wordCount);
    expect(snapshot?.gainedKnownWords).toBeGreaterThanOrEqual(1);
    expect(overview.wordsRead).toBe(document.pages[0]?.wordCount);
    expect(readerUiState$.selectedSentence.get()).toBeNull();
  });

  it("moves back to the previous page and restores the window neighbors", () => {
    const document = createSampleDocument();

    openReaderDocument(document);
    goToNextPage(document);
    goToPreviousPage(document);

    expect(readerUiState$.activePageIndex.get()).toBe(0);
    expect(getVisibleWindowForMedia(document)).toEqual({
      previousPageIndex: null,
      activePageIndex: 0,
      nextPageIndex: document.pages.length > 1 ? 1 : null,
    });
  });

  it("restores the saved page position after leaving and reopening the reader", () => {
    const document = createSampleDocument();

    openReaderDocument(document);
    goToNextPage(document);
    closeReader();
    openReaderDocument(document);

    expect(readerUiState$.activePageIndex.get()).toBe(1);
    expect(getReaderProgress(document.mediaId)?.pageIndex).toBe(1);
  });
});
