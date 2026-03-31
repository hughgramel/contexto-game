import { observable } from "@legendapp/state";
import { persistObservable } from "@legendapp/state/persist";

import type { MediaStats, PageReadSnapshot } from "@/lib/reader/models";

import { ensureLocalPersistenceConfigured } from "./persistence";
import { getKnownWordCount, getLearningWordCount } from "./vocabulary-state";

export const STATS_PERSIST_KEY = "contexto-stats-state";

export type StatsState = {
  totalWordsRead: number;
  pageSnapshotsById: Record<string, PageReadSnapshot>;
  mediaStatsById: Record<string, MediaStats>;
};

export type RecordPageReadInput = PageReadSnapshot;

export function createInitialStatsState(): StatsState {
  return {
    totalWordsRead: 0,
    pageSnapshotsById: {},
    mediaStatsById: {},
  };
}

ensureLocalPersistenceConfigured();

export const statsState$ = observable(createInitialStatsState());

persistObservable(statsState$, {
  local: STATS_PERSIST_KEY,
});

function getPageSnapshotKey(mediaId: string, pageId: string): string {
  return `${mediaId}:${pageId}`;
}

function createInitialMediaStats(mediaId: string): MediaStats {
  return {
    mediaId,
    wordsRead: 0,
    pagesCompleted: 0,
    currentProgressPercent: 0,
    knownTokenCount: 0,
    totalTokenCount: 0,
    lastReadAt: null,
  };
}

export function resetStatsState(): void {
  statsState$.set(createInitialStatsState());
}

export function recordPageRead(snapshot: RecordPageReadInput): void {
  const key = getPageSnapshotKey(snapshot.mediaId, snapshot.pageId);
  const existing = statsState$.pageSnapshotsById[key].get();
  const currentMediaStats =
    statsState$.mediaStatsById[snapshot.mediaId].get() ??
    createInitialMediaStats(snapshot.mediaId);

  statsState$.pageSnapshotsById[key].set(snapshot);
  statsState$.totalWordsRead.set((value) => value + snapshot.wordsRead);
  statsState$.mediaStatsById[snapshot.mediaId].set({
    ...currentMediaStats,
    wordsRead: currentMediaStats.wordsRead + snapshot.wordsRead,
    pagesCompleted: existing
      ? currentMediaStats.pagesCompleted
      : currentMediaStats.pagesCompleted + 1,
    currentProgressPercent: snapshot.progressPercent,
    lastReadAt: snapshot.createdAt,
  });
}

export function syncMediaComprehension(
  mediaId: string,
  knownTokenCount: number,
  totalTokenCount: number,
  progressPercent: number,
): void {
  const currentMediaStats =
    statsState$.mediaStatsById[mediaId].get() ?? createInitialMediaStats(mediaId);

  statsState$.mediaStatsById[mediaId].set({
    ...currentMediaStats,
    currentProgressPercent: progressPercent,
    knownTokenCount,
    totalTokenCount,
  });
}

export function getPageReadSnapshot(
  mediaId: string,
  pageId: string,
): PageReadSnapshot | undefined {
  return statsState$.pageSnapshotsById[getPageSnapshotKey(mediaId, pageId)].get();
}

export function getMediaStats(mediaId: string): MediaStats | undefined {
  return statsState$.mediaStatsById[mediaId].get();
}

export function getOverviewStats(): {
  wordsRead: number;
  wordsKnown: number;
  wordsLearning: number;
  pagesCompleted: number;
} {
  return {
    wordsRead: statsState$.totalWordsRead.get(),
    wordsKnown: getKnownWordCount(),
    wordsLearning: getLearningWordCount(),
    pagesCompleted: Object.keys(statsState$.pageSnapshotsById.get()).length,
  };
}
