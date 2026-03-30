import { describe, expect, it } from "vitest";

import { parseTextToDocument } from "../content/text-parser";
import {
  createMemoryMediaRepository,
  MediaRepository,
  RawMediaUpload,
} from "./media-repository";

const SAMPLE_TEXT = "Hello context. Second sentence for testing.";

describe("InMemoryMediaRepository", () => {
  let repository: MediaRepository;
  const mediaId = "memory-doc";

  beforeEach(() => {
    repository = createMemoryMediaRepository();
  });

  it("persists raw uploads", async () => {
    const upload: RawMediaUpload = {
      mediaId,
      filename: "book.txt",
      mimeType: "text/plain",
      content: SAMPLE_TEXT,
      createdAt: new Date().toISOString(),
    };

    await repository.saveRawUpload(upload);
    expect(await repository.getRawUpload(mediaId)).toEqual(upload);

    await repository.deleteRawUpload(mediaId);
    expect(await repository.getRawUpload(mediaId)).toBeUndefined();
  });

  it("persists parsed documents and lists them", async () => {
    const document = parseTextToDocument(mediaId, SAMPLE_TEXT, {
      title: "Memory Document",
    });

    await repository.saveDocument(mediaId, document);
    expect(await repository.getDocument(mediaId)).toEqual(document);

    const documents = await repository.listDocuments();
    expect(documents).toContain(document);

    await repository.deleteDocument(mediaId);
    expect(await repository.getDocument(mediaId)).toBeUndefined();

    await repository.clear();
    expect(await repository.listDocuments()).toEqual([]);
  });
});
