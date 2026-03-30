export type NormalizedWord = string;

export type ReaderToken = {
  id: string;
  surface: string;
  normalized: NormalizedWord;
  sentenceId: string;
  paragraphId: string;
  pageIndex: number;
};

export type ReaderSentence = {
  id: string;
  text: string;
  tokenIds: string[];
  pageIndex: number;
};

export type ReaderParagraph = {
  id: string;
  text: string;
  sentenceIds: string[];
  tokenIds: string[];
  pageIndex: number;
};

export type ReaderPage = {
  id: string;
  index: number;
  paragraphs: ReaderParagraph[];
  sentences: ReaderSentence[];
  tokens: ReaderToken[];
  wordCount: number;
};

export type ReaderDocument = {
  mediaId: string;
  title: string;
  pages: ReaderPage[];
  frequencyByWord: Record<NormalizedWord, number>;
  pageWordCounts: Record<string, Record<NormalizedWord, number>>;
  totalWordTokens: number;
};

export type ParserOptions = {
  chunkSizeTokens?: number;
  title?: string;
};
