import type {
  NormalizedWord,
  ParserOptions,
  ReaderDocument,
  ReaderPage,
  ReaderParagraph,
  ReaderSentence,
  ReaderToken,
} from "./types";

const DEFAULT_CHUNK_SIZE = 120;

export function parseTextToDocument(
  mediaId: string,
  rawText: string,
  options: ParserOptions = {},
): ReaderDocument {
  const chunkSize = options.chunkSizeTokens ?? DEFAULT_CHUNK_SIZE;
  const title = options.title ?? "Untitled";
  const trimmed = rawText.trim();
  const paragraphs = trimmed
    ? trimmed
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean)
    : [];

  const pages: ReaderPage[] = [];
  const frequencyByWord: Record<NormalizedWord, number> = {};
  const pageWordCounts: Record<string, Record<NormalizedWord, number>> = {};
  let totalWordTokens = 0;
  let pageIndex = 0;

  let currentPageParagraphs: ReaderParagraph[] = [];
  let currentPageSentences: ReaderSentence[] = [];
  let currentPageTokens: ReaderToken[] = [];
  let currentPageWordCount = 0;
  let currentPageWordMap: Record<NormalizedWord, number> = {};

  function flushPage() {
    if (!currentPageTokens.length) {
      return;
    }

    pages.push({
      id: `page-${pageIndex}`,
      index: pageIndex,
      paragraphs: currentPageParagraphs,
      sentences: currentPageSentences,
      tokens: currentPageTokens,
      wordCount: currentPageWordCount,
    });

    pageWordCounts[pageIndex.toString()] = currentPageWordMap;

    pageIndex += 1;
    currentPageParagraphs = [];
    currentPageSentences = [];
    currentPageTokens = [];
    currentPageWordCount = 0;
    currentPageWordMap = {};
  }

  function ensurePageCapacity(additionalTokens = 0) {
    if (
      currentPageWordCount > 0 &&
      currentPageWordCount + additionalTokens > chunkSize
    ) {
      flushPage();
    }
  }

  paragraphs.forEach((paragraphText, paragraphIndex) => {
    const paragraphId = `paragraph-${pageIndex}-${paragraphIndex}`;

    ensurePageCapacity(0);

    const sentenceFragments = splitIntoSentences(paragraphText);
    const paragraphSentenceIds: string[] = [];
    const paragraphTokenIds: string[] = [];
    const paragraphSentences: ReaderSentence[] = [];

    sentenceFragments.forEach((sentenceText, sentenceIndex) => {
      const sentenceId = `${paragraphId}-sentence-${sentenceIndex}`;
      const tokens = tokenizeSentence(sentenceText);
      const tokenIds: string[] = [];

      tokens.forEach((surface, tokenIndex) => {
        const normalized = normalizeWord(surface);
        if (!normalized) {
          return;
        }

        const tokenId = `${sentenceId}-token-${tokenIndex}`;
        const token: ReaderToken = {
          id: tokenId,
          surface,
          normalized,
          sentenceId,
          paragraphId,
          pageIndex,
        };

        currentPageTokens.push(token);
        paragraphTokenIds.push(tokenId);
        tokenIds.push(tokenId);
        currentPageWordCount += 1;
        totalWordTokens += 1;

        frequencyByWord[normalized] = (frequencyByWord[normalized] ?? 0) + 1;
        currentPageWordMap[normalized] =
          (currentPageWordMap[normalized] ?? 0) + 1;
      });

      if (!tokenIds.length) {
        return;
      }

      paragraphSentenceIds.push(sentenceId);
      paragraphTokenIds.push(...tokenIds);

      const sentence: ReaderSentence = {
        id: sentenceId,
        text: sentenceText,
        tokenIds,
        pageIndex,
      };

      paragraphSentences.push(sentence);
      currentPageSentences.push(sentence);
    });

    if (!paragraphSentenceIds.length) {
      return;
    }

    const paragraph: ReaderParagraph = {
      id: paragraphId,
      text: paragraphText,
      sentenceIds: paragraphSentenceIds,
      tokenIds: paragraphTokenIds,
      pageIndex,
    };

    currentPageParagraphs.push(paragraph);

    ensurePageCapacity(0);
  });

  flushPage();

  return {
    mediaId,
    title,
    pages,
    frequencyByWord,
    pageWordCounts,
    totalWordTokens,
  };
}

function splitIntoSentences(paragraph: string): string[] {
  const matches =
    paragraph.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g) ?? [];
  return matches.map((sentence) => sentence.trim()).filter(Boolean);
}

function tokenizeSentence(sentence: string): string[] {
  return Array.from(
    sentence.matchAll(/\b[\p{L}'’]+\b/gu),
    (match) => match[0],
  );
}

function normalizeWord(surface: string): NormalizedWord | "" {
  return surface.toLowerCase().replace(/[^a-zà-ÿ']/gi, "");
}
