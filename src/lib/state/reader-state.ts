import { batch, observable } from "@legendapp/state";
import { persistObservable } from "@legendapp/state/persist";

import { analyzeDocumentComprehension, analyzeWordCounts } from "@/lib/analysis/comprehension";
import type { ReaderDocument, ReaderToken } from "@/lib/content/types";
import type {
  ReaderProgress,
  ReaderUiState,
  ReaderVisibleWindow,
  SentenceSelection,
} from "@/lib/reader/models";

import { ensureLocalPersistenceConfigured } from "./persistence";
import { recordPageRead, syncMediaComprehension } from "./stats-state";
import { getWordStatus, setWordKnown, setWordLearning } from "./vocabulary-state";

export const READER_PROGRESS_PERSIST_KEY = "contexto-reader-progress-state";

export function createInitialReaderUiState(): ReaderUiState {
  return {
    activeMediaId: null,
    activePageIndex: 0,
    currentPageWordIds: [],
    visibleWindow: {
      previousPageIndex: null,
      activePageIndex: 0,
      nextPageIndex: null,
    },
    selectedSentence: null,
    wordModal: null,
    knownAtPageStart: 0,
    knownAtPageEnd: 0,
    pendingGestureDirection: null,
  };
}

ensureLocalPersistenceConfigured();

export const readerUiState$ = observable(createInitialReaderUiState());
export const readerProgressState$ = observable<Record<string, ReaderProgress>>({});

persistObservable(readerProgressState$, {
  local: READER_PROGRESS_PERSIST_KEY,
});

function clampPageIndex(document: ReaderDocument, pageIndex: number): number {
  return Math.min(Math.max(pageIndex, 0), Math.max(document.pages.length - 1, 0));
}

function getProgressPercent(pageIndex: number, totalPages: number): number {
  if (totalPages === 0) {
    return 0;
  }

  return Math.round(((pageIndex + 1) / totalPages) * 100);
}

function getPageWordCounts(
  document: ReaderDocument,
  pageIndex: number,
): Record<string, number> {
  return document.pageWordCounts[pageIndex.toString()] ?? {};
}

function getKnownTokenCount(document: ReaderDocument, pageIndex: number): number {
  return analyzeWordCounts(getPageWordCounts(document, pageIndex)).knownTokens;
}

function findToken(document: ReaderDocument, tokenId: string): ReaderToken | undefined {
  return document.pages.flatMap((page) => page.tokens).find((token) => token.id === tokenId);
}

function buildWordModal(document: ReaderDocument, token: ReaderToken) {
  return {
    mediaId: document.mediaId,
    pageIndex: readerUiState$.activePageIndex.get(),
    tokenId: token.id,
    normalized: token.normalized,
    surface: token.surface,
    isOpen: true,
  };
}

function persistProgress(
  document: ReaderDocument,
  pageIndex: number,
  knownAtPageStart: number,
  knownAtPageEnd: number,
  scrollTop = 0,
  wordsReadOnPage = 0,
): void {
  readerProgressState$[document.mediaId].set({
    mediaId: document.mediaId,
    pageIndex,
    progressPercent: getProgressPercent(pageIndex, document.pages.length),
    scrollTop,
    knownAtPageStart,
    knownAtPageEnd,
    wordsReadOnPage,
    updatedAt: new Date().toISOString(),
  });
}

function syncDocumentStats(document: ReaderDocument, progressPercent: number): void {
  const analysis = analyzeDocumentComprehension(document);
  syncMediaComprehension(
    document.mediaId,
    analysis.knownTokens,
    document.totalWordTokens,
    progressPercent,
  );
}

function resetTransientReaderState(): void {
  readerUiState$.selectedSentence.set(null);
  readerUiState$.wordModal.set(null);
  readerUiState$.pendingGestureDirection.set(null);
}

function setActivePageState(document: ReaderDocument, pageIndex: number): void {
  const safePageIndex = clampPageIndex(document, pageIndex);
  const page = document.pages[safePageIndex];
  const knownTokenCount = getKnownTokenCount(document, safePageIndex);

  batch(() => {
    readerUiState$.activeMediaId.set(document.mediaId);
    readerUiState$.activePageIndex.set(safePageIndex);
    readerUiState$.currentPageWordIds.set(page?.tokens.map((token) => token.id) ?? []);
    readerUiState$.visibleWindow.set(
      getVisibleWindow(document.pages.length, safePageIndex),
    );
    readerUiState$.knownAtPageStart.set(knownTokenCount);
    readerUiState$.knownAtPageEnd.set(knownTokenCount);
    resetTransientReaderState();
  });

  persistProgress(document, safePageIndex, knownTokenCount, knownTokenCount);
  syncDocumentStats(document, getProgressPercent(safePageIndex, document.pages.length));
}

function commitCurrentPage(document: ReaderDocument): void {
  const currentPageIndex = readerUiState$.activePageIndex.get();
  const page = document.pages[currentPageIndex];
  if (!page) {
    return;
  }

  const knownAtPageStart = readerUiState$.knownAtPageStart.get();
  const knownAtPageEnd = readerUiState$.knownAtPageEnd.get();
  const wordsRead = page.wordCount;

  recordPageRead({
    mediaId: document.mediaId,
    pageId: page.id,
    pageIndex: currentPageIndex,
    wordsRead,
    knownAtPageStart,
    knownAtPageEnd,
    gainedKnownWords: Math.max(0, knownAtPageEnd - knownAtPageStart),
    progressPercent: getProgressPercent(currentPageIndex, document.pages.length),
    createdAt: new Date().toISOString(),
  });

  persistProgress(
    document,
    currentPageIndex,
    knownAtPageStart,
    knownAtPageEnd,
    getReaderProgress(document.mediaId)?.scrollTop ?? 0,
    wordsRead,
  );
}

export function getVisibleWindow(
  totalPages: number,
  activePageIndex: number,
): ReaderVisibleWindow {
  return {
    previousPageIndex: activePageIndex > 0 ? activePageIndex - 1 : null,
    activePageIndex,
    nextPageIndex: activePageIndex < totalPages - 1 ? activePageIndex + 1 : null,
  };
}

export function getVisibleWindowForMedia(
  document: ReaderDocument,
): ReaderVisibleWindow {
  return getVisibleWindow(document.pages.length, readerUiState$.activePageIndex.get());
}

export function getActivePage(document: ReaderDocument) {
  return document.pages[readerUiState$.activePageIndex.get()];
}

export function getReaderProgress(mediaId: string): ReaderProgress | undefined {
  return readerProgressState$[mediaId].get();
}

export function resetReaderState(): void {
  readerUiState$.set(createInitialReaderUiState());
  readerProgressState$.set({});
}

export function openReaderDocument(document: ReaderDocument): void {
  const existingProgress = getReaderProgress(document.mediaId);
  const startPageIndex = clampPageIndex(document, existingProgress?.pageIndex ?? 0);
  setActivePageState(document, startPageIndex);
}

export function openWordModalForToken(
  document: ReaderDocument,
  tokenId: string,
): void {
  const token = findToken(document, tokenId);
  if (!token) {
    return;
  }

  if (getWordStatus(token.normalized) === "unknown") {
    setWordLearning(token.normalized, token.surface);
  }

  readerUiState$.wordModal.set(buildWordModal(document, token));
  readerUiState$.knownAtPageEnd.set(
    getKnownTokenCount(document, readerUiState$.activePageIndex.get()),
  );
}

export function markActiveWordKnown(document: ReaderDocument): void {
  const modal = readerUiState$.wordModal.get();
  if (!modal) {
    return;
  }

  setWordKnown(modal.normalized, modal.surface);
  const knownTokenCount = getKnownTokenCount(
    document,
    readerUiState$.activePageIndex.get(),
  );

  readerUiState$.knownAtPageEnd.set(knownTokenCount);
  readerUiState$.wordModal.set(null);
  persistProgress(
    document,
    readerUiState$.activePageIndex.get(),
    readerUiState$.knownAtPageStart.get(),
    knownTokenCount,
    getReaderProgress(document.mediaId)?.scrollTop ?? 0,
  );
  syncDocumentStats(
    document,
    getProgressPercent(readerUiState$.activePageIndex.get(), document.pages.length),
  );
}

export function setSentenceSelection(
  document: ReaderDocument,
  startTokenId: string,
  endTokenId: string,
): void {
  const page = document.pages[readerUiState$.activePageIndex.get()];
  if (!page) {
    return;
  }

  const startIndex = page.tokens.findIndex((token) => token.id === startTokenId);
  const endIndex = page.tokens.findIndex((token) => token.id === endTokenId);

  if (startIndex === -1 || endIndex === -1) {
    return;
  }

  const [rangeStart, rangeEnd] =
    startIndex <= endIndex ? [startIndex, endIndex] : [endIndex, startIndex];
  const selectionTokens = page.tokens.slice(rangeStart, rangeEnd + 1);
  const selection: SentenceSelection = {
    mediaId: document.mediaId,
    pageIndex: page.index,
    startTokenId: selectionTokens[0]!.id,
    endTokenId: selectionTokens[selectionTokens.length - 1]!.id,
    text: selectionTokens.map((token) => token.surface).join(" "),
  };

  readerUiState$.selectedSentence.set(selection);
}

export function clearSentenceSelection(): void {
  readerUiState$.selectedSentence.set(null);
}

export function closeWordModal(): void {
  readerUiState$.wordModal.set(null);
}

export function setCurrentScrollTop(scrollTop: number): void {
  const activeMediaId = readerUiState$.activeMediaId.get();
  if (!activeMediaId) {
    return;
  }

  const currentProgress = readerProgressState$[activeMediaId].get();
  if (!currentProgress) {
    return;
  }

  readerProgressState$[activeMediaId].set({
    ...currentProgress,
    scrollTop,
    updatedAt: new Date().toISOString(),
  });
}

export function goToNextPage(document: ReaderDocument): void {
  const currentPageIndex = readerUiState$.activePageIndex.get();
  if (currentPageIndex >= document.pages.length - 1) {
    return;
  }

  commitCurrentPage(document);
  setActivePageState(document, currentPageIndex + 1);
}

export function goToPreviousPage(document: ReaderDocument): void {
  const currentPageIndex = readerUiState$.activePageIndex.get();
  if (currentPageIndex <= 0) {
    return;
  }

  setActivePageState(document, currentPageIndex - 1);
}

export function closeReader(): void {
  readerUiState$.set(createInitialReaderUiState());
}
