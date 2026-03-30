import type { MediaRecord } from "@/lib/reader/models";

import { parseTextToDocument } from "./text-parser";

export const SAMPLE_MEDIA_ID = "sample-text";
export const SAMPLE_MEDIA_TITLE = "Aurora City Dreams";
export const SAMPLE_MEDIA_TEXT = `
A soft rain drifts over Aurora Tower while Mira studies a note beside the tram.
The note says every learner should mark bright words before the morning bell.

Mira opens the small book and reads about gardens floating above the river.
She smiles because the gardens appear again and again in every chapter.

At sunset the guide returns to the tower and repeats the same lesson slowly.
Known words feel lighter now, but new words still glow along the final page.
`;
export const SAMPLE_MEDIA_CREATED_AT = "2026-03-30T00:00:00.000Z";

export const SAMPLE_MEDIA_RECORD: MediaRecord = {
  id: SAMPLE_MEDIA_ID,
  title: SAMPLE_MEDIA_TITLE,
  kind: "reader",
  sourceType: "sample",
  createdAt: SAMPLE_MEDIA_CREATED_AT,
  updatedAt: SAMPLE_MEDIA_CREATED_AT,
  lastOpenedAt: null,
  coverUrl: null,
};

export function createSampleDocument() {
  return parseTextToDocument(SAMPLE_MEDIA_ID, SAMPLE_MEDIA_TEXT, {
    title: SAMPLE_MEDIA_TITLE,
    chunkSizeTokens: 12,
  });
}
