import { observable } from "@legendapp/state";
import { persistObservable } from "@legendapp/state/persist";

import type { ReaderDocument, ReaderToken } from "@/lib/content/types";
import type { ReaderProgress, ReaderVisibleWindow, SentenceSelection, WordModalState } from "@/lib/reader/models";

import { ensureLocalPersistenceConfigured } from "./persistence";
import { analyzeWordCounts } from "@/lib/analysis/comprehension";
import { recordPageRead, syncMediaComprehension } from "./stats-state";
import { getKnownWordCount, setWordKnown, setWordLearning } from "./vocabulary-state";

export const READER_PROGRESS_PERSIST_KEY = "contexto-reader-progress";

/** Bounding rect for positioning the floating popup near a word. */
export type PopupAnchor = {
  top: number;
  left: number;
  bottom: number;
  right: number;
  width: number;
  height: number;
};

/** Currently selected word range (drag-to-select). */
export const selectedRange$ = observable<{ start: number; end: number } | null>(null);

/** Whether the drag selection has been finalized (pointer released after drag). */
export const selectionFinalized$ = observable(false);

/** The word currently shown in the single-word translation popup. */
export const wordTranslationWord$ = observable<{ surface: string; normalized: string } | null>(null);

/** Anchor rect for positioning the floating popup. */
export const wordPopupAnchor$ = observable<PopupAnchor | null>(null);

export type ReaderUiState = {
  activeMediaId: string | null;
  activePageIndex: number;
  currentPageWordIds: string[];
  visibleWindow: ReaderVisibleWindow;
  selectedSentence: SentenceSelection | null;
  wordModal: WordModalState | null;
  knownAtPageStart: number;
  knownAtPageEnd: number;
};

function createInitialReaderUiState(): ReaderUiState {
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
  };
}

export const readerUiState$ = observable<ReaderUiState>(createInitialReaderUiState());

ensureLocalPersistenceConfigured();

export const readerProgressState$ = observable<Record<string, ReaderProgress>>({});

persistObservable(readerProgressState$, {
  local: READER_PROGRESS_PERSIST_KEY,
});

export function resetReaderState(): void {
  readerUiState$.set(createInitialReaderUiState());
  readerProgressState$.set({});
  selectedRange$.set(null);
  selectionFinalized$.set(false);
  wordTranslationWord$.set(null);
  wordPopupAnchor$.set(null);
}

function computeVisibleWindow(doc: ReaderDocument, pageIndex: number): ReaderVisibleWindow {
  return {
    previousPageIndex: pageIndex > 0 ? pageIndex - 1 : null,
    activePageIndex: pageIndex,
    nextPageIndex: pageIndex < doc.pages.length - 1 ? pageIndex + 1 : null,
  };
}

function computeProgressPercent(doc: ReaderDocument, pageIndex: number): number {
  if (doc.pages.length === 0) return 0;
  return Math.round(((pageIndex + 1) / doc.pages.length) * 100);
}

function saveProgress(doc: ReaderDocument, pageIndex: number): void {
  const progress: ReaderProgress = {
    mediaId: doc.mediaId,
    pageIndex,
    progressPercent: computeProgressPercent(doc, pageIndex),
    scrollTop: 0,
    knownAtPageStart: readerUiState$.knownAtPageStart.get(),
    knownAtPageEnd: readerUiState$.knownAtPageEnd.get(),
    wordsReadOnPage: doc.pages[pageIndex]?.wordCount ?? 0,
    updatedAt: new Date().toISOString(),
  };
  readerProgressState$[doc.mediaId].set(progress);
}

function hydratePageState(doc: ReaderDocument, pageIndex: number): void {
  const page = doc.pages[pageIndex];
  if (!page) return;

  const knownCount = getKnownWordCount();
  readerUiState$.activePageIndex.set(pageIndex);
  readerUiState$.currentPageWordIds.set(page.tokens.map((t) => t.id));
  readerUiState$.visibleWindow.set(computeVisibleWindow(doc, pageIndex));
  readerUiState$.knownAtPageStart.set(knownCount);
  readerUiState$.knownAtPageEnd.set(knownCount);
  readerUiState$.selectedSentence.set(null);
  readerUiState$.wordModal.set(null);
}

export function openReaderDocument(doc: ReaderDocument): void {
  const savedProgress = readerProgressState$[doc.mediaId]?.get();
  const startPage = savedProgress?.pageIndex ?? 0;

  readerUiState$.activeMediaId.set(doc.mediaId);
  hydratePageState(doc, startPage);
  saveProgress(doc, startPage);
}

export function closeReader(): void {
  readerUiState$.activeMediaId.set(null);
  readerUiState$.wordModal.set(null);
  readerUiState$.selectedSentence.set(null);
}

export function getReaderProgress(mediaId: string): ReaderProgress | undefined {
  return readerProgressState$[mediaId]?.get();
}

export function getActivePage(doc: ReaderDocument) {
  const pageIndex = readerUiState$.activePageIndex.get();
  return doc.pages[pageIndex];
}

export function getVisibleWindowForMedia(doc: ReaderDocument): ReaderVisibleWindow {
  const pageIndex = readerUiState$.activePageIndex.get();
  return computeVisibleWindow(doc, pageIndex);
}

function findToken(doc: ReaderDocument, tokenId: string): ReaderToken | undefined {
  const pageIndex = readerUiState$.activePageIndex.get();
  const page = doc.pages[pageIndex];
  return page?.tokens.find((t) => t.id === tokenId);
}

export function openWordModalForToken(doc: ReaderDocument, tokenId: string): void {
  const token = findToken(doc, tokenId);
  if (!token) return;

  setWordLearning(token.normalized, token.surface);

  readerUiState$.wordModal.set({
    mediaId: doc.mediaId,
    pageIndex: readerUiState$.activePageIndex.get(),
    tokenId: token.id,
    normalized: token.normalized,
    surface: token.surface,
    isOpen: true,
  });
}

export function closeWordModal(): void {
  readerUiState$.wordModal.set(null);
}

export function markActiveWordKnown(doc: ReaderDocument): void {
  const modal = readerUiState$.wordModal.get();
  if (!modal) return;

  setWordKnown(modal.normalized, modal.surface);
  readerUiState$.wordModal.set(null);

  const knownCount = getKnownWordCount();
  readerUiState$.knownAtPageEnd.set(knownCount);

  const pageIndex = readerUiState$.activePageIndex.get();
  const page = doc.pages[pageIndex];
  if (page) {
    const analysis = analyzeWordCounts(doc.pageWordCounts[page.id] ?? {});
    syncMediaComprehension(
      doc.mediaId,
      analysis.knownTokens,
      analysis.totalTokens,
      computeProgressPercent(doc, pageIndex),
    );
  }
}

export function setSentenceSelection(
  doc: ReaderDocument,
  startTokenId: string,
  endTokenId: string,
): void {
  const pageIndex = readerUiState$.activePageIndex.get();
  const page = doc.pages[pageIndex];
  if (!page) return;

  const startIdx = page.tokens.findIndex((t) => t.id === startTokenId);
  const endIdx = page.tokens.findIndex((t) => t.id === endTokenId);
  if (startIdx === -1 || endIdx === -1) return;

  const selectedTokens = page.tokens.slice(
    Math.min(startIdx, endIdx),
    Math.max(startIdx, endIdx) + 1,
  );

  readerUiState$.selectedSentence.set({
    mediaId: doc.mediaId,
    pageIndex,
    startTokenId,
    endTokenId,
    text: selectedTokens.map((t) => t.surface).join(" "),
  });
}

export function goToNextPage(doc: ReaderDocument): void {
  const currentIndex = readerUiState$.activePageIndex.get();
  if (currentIndex >= doc.pages.length - 1) return;

  const currentPage = doc.pages[currentIndex];
  if (currentPage) {
    recordPageRead({
      mediaId: doc.mediaId,
      pageId: currentPage.id,
      pageIndex: currentIndex,
      wordsRead: currentPage.wordCount,
      knownAtPageStart: readerUiState$.knownAtPageStart.get(),
      knownAtPageEnd: readerUiState$.knownAtPageEnd.get(),
      gainedKnownWords: readerUiState$.knownAtPageEnd.get() - readerUiState$.knownAtPageStart.get(),
      progressPercent: computeProgressPercent(doc, currentIndex),
      createdAt: new Date().toISOString(),
    });
  }

  const nextIndex = currentIndex + 1;
  hydratePageState(doc, nextIndex);
  saveProgress(doc, nextIndex);
}

export function goToPreviousPage(doc: ReaderDocument): void {
  const currentIndex = readerUiState$.activePageIndex.get();
  if (currentIndex <= 0) return;

  const prevIndex = currentIndex - 1;
  hydratePageState(doc, prevIndex);
  saveProgress(doc, prevIndex);
}

export function clearSelection(): void {
  selectedRange$.set(null);
  selectionFinalized$.set(false);
  wordPopupAnchor$.set(null);
}

export function clearWordTranslation(): void {
  wordTranslationWord$.set(null);
  wordPopupAnchor$.set(null);
}
