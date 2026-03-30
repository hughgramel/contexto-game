import {
  createSampleDocument,
  SAMPLE_MEDIA_ID,
  SAMPLE_MEDIA_RECORD,
  SAMPLE_MEDIA_TEXT,
} from "@/lib/content/sample-media";
import { parseTextToDocument } from "@/lib/content/text-parser";
import type { ReaderDocument } from "@/lib/content/types";
import type { MediaRecord } from "@/lib/reader/models";
import {
  createMediaRepository,
  type MediaRepository,
} from "@/lib/media/media-repository";
import { removeMediaRecord, upsertMediaRecord } from "@/lib/state/library-state";

let mediaRepository: MediaRepository = createMediaRepository();

function createUploadMediaId(filename: string): string {
  const safeName = filename
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${safeName || "media"}-${Date.now().toString(36)}`;
}

function buildUploadedMediaRecord(
  mediaId: string,
  title: string,
  createdAt: string,
): MediaRecord {
  return {
    id: mediaId,
    title,
    kind: "reader",
    sourceType: "upload",
    createdAt,
    updatedAt: createdAt,
    lastOpenedAt: null,
    coverUrl: null,
  };
}

export function getMediaRepository(): MediaRepository {
  return mediaRepository;
}

export function setMediaRepository(repository: MediaRepository): void {
  mediaRepository = repository;
}

export async function ensureBundledSampleMedia(): Promise<void> {
  const existing = await mediaRepository.getDocument(SAMPLE_MEDIA_ID);

  if (!existing) {
    await mediaRepository.saveRawUpload({
      mediaId: SAMPLE_MEDIA_ID,
      filename: "sample-text.txt",
      mimeType: "text/plain",
      content: SAMPLE_MEDIA_TEXT,
      createdAt: SAMPLE_MEDIA_RECORD.createdAt,
    });
    await mediaRepository.saveDocument(SAMPLE_MEDIA_ID, createSampleDocument());
  }

  upsertMediaRecord(SAMPLE_MEDIA_RECORD);
}

export async function importTextMedia(file: File): Promise<MediaRecord> {
  const content = await file.text();
  return importTextContent({
    filename: file.name,
    title: file.name.replace(/\.[^.]+$/, "") || "Uploaded text",
    content,
    mimeType: file.type || "text/plain",
  });
}

export async function importTextContent(input: {
  filename: string;
  title: string;
  content: string;
  mimeType?: string;
}): Promise<MediaRecord> {
  const createdAt = new Date().toISOString();
  const mediaId = createUploadMediaId(input.filename);
  const document = parseTextToDocument(mediaId, input.content, {
    title: input.title,
    chunkSizeTokens: 12,
  });
  const record = buildUploadedMediaRecord(mediaId, input.title, createdAt);

  await mediaRepository.saveRawUpload({
    mediaId,
    filename: input.filename,
    mimeType: input.mimeType ?? "text/plain",
    content: input.content,
    createdAt,
  });
  await mediaRepository.saveDocument(mediaId, document);
  upsertMediaRecord(record);

  return record;
}

export async function loadReaderDocument(
  mediaId: string,
): Promise<ReaderDocument | undefined> {
  if (mediaId === SAMPLE_MEDIA_ID) {
    await ensureBundledSampleMedia();
  }

  return mediaRepository.getDocument(mediaId);
}

export async function deleteMedia(mediaId: string): Promise<void> {
  await mediaRepository.deleteRawUpload(mediaId);
  await mediaRepository.deleteDocument(mediaId);
  removeMediaRecord(mediaId);
}
