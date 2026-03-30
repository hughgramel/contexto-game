import type { ReaderDocument } from "@/lib/content/types";
import type { ComprehensionAnalysis, WordEntry } from "@/lib/reader/models";
import { getVocabularyEntries } from "@/lib/state/vocabulary-state";

export function analyzeWordCounts(
  wordCounts: Record<string, number>,
  entries: Record<string, WordEntry>,
): ComprehensionAnalysis {
  let totalTokens = 0;
  let knownTokens = 0;
  let learningTokens = 0;

  for (const [word, count] of Object.entries(wordCounts)) {
    totalTokens += count;

    const status = entries[word]?.status;
    if (status === "known") {
      knownTokens += count;
    } else if (status === "learning") {
      learningTokens += count;
    }
  }

  return {
    totalTokens,
    knownTokens,
    learningTokens,
    unknownTokens: totalTokens - knownTokens - learningTokens,
    comprehensionPercent:
      totalTokens === 0 ? 0 : Math.round((knownTokens / totalTokens) * 100),
  };
}

export function analyzeDocumentComprehension(
  document: ReaderDocument,
  lang: string,
  entries: Record<string, WordEntry> = getVocabularyEntries(lang),
): ComprehensionAnalysis {
  return analyzeWordCounts(document.frequencyByWord, entries);
}
