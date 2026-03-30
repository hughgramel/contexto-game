import type { Word } from "./types";

/** Strip punctuation and lowercase for dictionary key normalization. */
function normalize(text: string): string {
  return text.replace(/[^\p{L}\p{N}]/gu, "").toLowerCase();
}

/**
 * Tokenize article text into Word objects.
 * Splits on whitespace. Each token becomes a Word with displayText (original),
 * targetWord (normalized), and nativeWord (display form without trailing punctuation).
 */
export function tokenizeText(text: string): Word[] {
  const tokens = text.split(/\s+/).filter(Boolean);
  return tokens.map((token, i) => ({
    index: i,
    displayText: token,
    targetWord: normalize(token),
    nativeWord: token.replace(/[^\p{L}\p{N}\s]/gu, ""),
  }));
}

/** Tokenize all pages of an article into a single flat Word array. */
export function tokenizeArticle(pages: string[]): Word[] {
  const allText = pages.join(" ");
  return tokenizeText(allText);
}
