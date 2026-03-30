import { describe, expect, it } from "vitest";

import { parseTextToDocument } from "./text-parser";

const SAMPLE_TEXT = `
Hello world. This is the first glance.

Second paragraph opens here. It continues with more detail.
`;

describe("parseTextToDocument", () => {
  it("produces a document with frequency and page counts", () => {
    const doc = parseTextToDocument("sample-media", SAMPLE_TEXT, {
      chunkSizeTokens: 50,
      title: "Sample",
    });

    expect(doc.mediaId).toBe("sample-media");
    expect(doc.title).toBe("Sample");
    expect(doc.pages.length).toBeGreaterThan(0);
    expect(doc.pages[0].wordCount).toBeGreaterThan(0);

    const totalFromMap = Object.values(doc.frequencyByWord).reduce(
      (acc, value) => acc + value,
      0,
    );

    expect(doc.totalWordTokens).toBe(totalFromMap);
    expect(doc.frequencyByWord["hello"]).toBe(1);
    expect(doc.frequencyByWord["world"]).toBe(1);
    expect(doc.frequencyByWord["paragraph"]).toBeGreaterThanOrEqual(1);

    const firstPageCounts = doc.pageWordCounts["0"];
    expect(firstPageCounts).toBeDefined();
    if (firstPageCounts) {
      expect(firstPageCounts["hello"]).toBe(1);
      expect(firstPageCounts["second"]).toBeGreaterThanOrEqual(1);
    }
  });
});
