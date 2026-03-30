import { observable } from "@legendapp/state";
import { persistObservable } from "@legendapp/state/persist";

import type { MediaRecord } from "@/lib/reader/models";

import { readerProgressState$ } from "./reader-state";
import { ensureLocalPersistenceConfigured } from "./persistence";

export const LIBRARY_PERSIST_KEY = "contexto-library-state";

export type LibraryMediaListItem = MediaRecord & {
  progressPercent: number;
  continuePageIndex: number | null;
};

export type LibraryState = {
  mediaById: Record<string, MediaRecord>;
};

export function createInitialLibraryState(): LibraryState {
  return {
    mediaById: {},
  };
}

ensureLocalPersistenceConfigured();

export const libraryState$ = observable(createInitialLibraryState());

persistObservable(libraryState$, {
  local: LIBRARY_PERSIST_KEY,
});

export function resetLibraryState(): void {
  libraryState$.set(createInitialLibraryState());
}

export function upsertMediaRecord(record: MediaRecord): void {
  libraryState$.mediaById[record.id].set(record);
}

export function removeMediaRecord(mediaId: string): void {
  libraryState$.mediaById[mediaId].delete();
}

export function getLibraryMedia(): LibraryMediaListItem[] {
  const progressByMedia = readerProgressState$.get();

  return Object.values(libraryState$.mediaById.get())
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
    .map((record) => {
      const progress = progressByMedia[record.id];

      return {
        ...record,
        progressPercent: progress?.progressPercent ?? 0,
        continuePageIndex: progress?.pageIndex ?? null,
      };
    });
}
