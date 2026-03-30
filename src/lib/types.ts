/** A single word/token in article text with translation data. */
export interface Word {
  /** 0-based position in the article text. */
  index: number;
  /** The word as it should appear on screen (may include punctuation). */
  displayText: string;
  /** The word normalized (lowercase, no punctuation) — used as dictionary key. */
  targetWord: string;
  /** The word translated into the user's native language. */
  nativeWord: string;
}
