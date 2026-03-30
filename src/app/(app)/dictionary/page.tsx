"use client";

import { useState } from "react";
import Link from "next/link";
import { observer } from "@legendapp/state/react";

import {
  dictionary$,
  savedSentences$,
  knownWordsCount$,
  learningWordsCount$,
  rotateWordStatus,
  removeWord,
  removeSentence,
  type WordStatus,
} from "@/lib/state/dictionary-state";

type DictTab = "words" | "phrases";
type WordFilter = "learning" | "known";

const DictionaryPage = observer(function DictionaryPage() {
  const [tab, setTab] = useState<DictTab>("words");
  const [filter, setFilter] = useState<WordFilter>("learning");
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const dict = dictionary$.get();
  const sentences = savedSentences$.get();
  const knownCount = knownWordsCount$.get();
  const learningCount = learningWordsCount$.get();

  const allWords = Object.entries(dict) as [string, WordStatus][];
  const filteredWords = allWords
    .filter(([, status]) => status === filter)
    .filter(([word]) =>
      search ? word.toLowerCase().includes(search.toLowerCase()) : true
    );

  const allPhrases = Object.entries(sentences);
  const filteredPhrases = allPhrases.filter(([, text]) =>
    search ? text.toLowerCase().includes(search.toLowerCase()) : true
  );

  const isEmpty = tab === "words" ? filteredWords.length === 0 : filteredPhrases.length === 0;

  return (
    <section className="flex flex-col min-h-[calc(100dvh-80px)]">
      {/* Header with back button */}
      <div className="flex items-center gap-3 border-b border-black/10 px-4 py-3">
        <Link href="/profile" className="text-black/40 hover:text-black transition-colors">
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <h1 className="text-lg font-bold">Dictionary</h1>
      </div>

      {/* Top tabs: Words | Phrases */}
      <div className="flex border-b border-black/10">
        <button
          onClick={() => setTab("words")}
          className={`flex-1 py-3 text-sm font-semibold text-center transition-colors ${
            tab === "words"
              ? "border-b-2 border-black text-black"
              : "text-black/30"
          }`}
        >
          <span className="inline-flex items-center gap-1.5">
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 7 4 4 20 4 20 7" />
              <line x1="9" y1="20" x2="15" y2="20" />
              <line x1="12" y1="4" x2="12" y2="20" />
            </svg>
            Words
          </span>
        </button>
        <button
          onClick={() => setTab("phrases")}
          className={`flex-1 py-3 text-sm font-semibold text-center transition-colors ${
            tab === "phrases"
              ? "border-b-2 border-black text-black"
              : "text-black/30"
          }`}
        >
          <span className="inline-flex items-center gap-1.5">
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            Phrases
          </span>
        </button>
      </div>

      {/* Filter row */}
      {tab === "words" ? (
        <div className="flex items-center gap-2 px-4 pt-4 pb-2">
          <div className="flex flex-1 gap-2">
            <button
              onClick={() => setFilter("learning")}
              className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors ${
                filter === "learning"
                  ? "bg-black text-white"
                  : "bg-black/5 text-black/40"
              }`}
            >
              Learning ({learningCount})
            </button>
            <button
              onClick={() => setFilter("known")}
              className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors ${
                filter === "known"
                  ? "bg-black text-white"
                  : "bg-black/5 text-black/40"
              }`}
            >
              Known ({knownCount})
            </button>
          </div>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="flex h-9 w-9 items-center justify-center border border-black/10 text-black/40"
          >
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 px-4 pt-4 pb-2">
          <p className="flex-1 text-xs text-black/40 font-medium">
            {allPhrases.length} saved phrase{allPhrases.length !== 1 ? "s" : ""}
          </p>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="flex h-9 w-9 items-center justify-center border border-black/10 text-black/40"
          >
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>
      )}

      {/* Search bar (collapsible) */}
      {showSearch && (
        <div className="px-4 pb-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={tab === "words" ? "Search words..." : "Search phrases..."}
            className="w-full border border-black/10 px-3 py-2 text-sm outline-none placeholder:text-black/30"
            autoFocus
          />
        </div>
      )}

      {/* Spacer between filters and content */}
      <div className="h-3" />

      {/* Content */}
      {isEmpty ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
          <p className="text-4xl">
            {tab === "words" ? (
              <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="text-black/20 mx-auto">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            ) : (
              <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="text-black/20 mx-auto">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            )}
          </p>
          <h2 className="text-lg font-bold">
            {tab === "words"
              ? "Tap words while reading"
              : "Save phrases while reading"}
          </h2>
          <p className="text-sm text-black/40">
            {tab === "words"
              ? "Tap any word in a lesson to add it here for review"
              : "Long-press a sentence while reading to save it here"}
          </p>
          <Link
            href="/library"
            className="mt-2 border border-black px-6 py-2.5 text-sm font-semibold"
          >
            Go to Library
          </Link>
        </div>
      ) : tab === "words" ? (
        <div className="border-t border-black/5">
          {filteredWords.map(([word, status]) => (
            <div
              key={word}
              className="flex items-center justify-between border-b border-black/5 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${
                    status === "known" ? "bg-emerald-500" : "bg-[#FBBA00]"
                  }`}
                />
                <span className="text-sm font-medium">{word}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => rotateWordStatus(word)}
                  className={`px-2 py-1 text-[10px] font-semibold uppercase tracking-wide rounded ${
                    status === "known"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-[#FFEBA1] text-[#92700C]"
                  }`}
                >
                  {status}
                </button>
                <button
                  onClick={() => removeWord(word)}
                  className="text-black/20 hover:text-black/50 transition-colors"
                >
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-t border-black/5">
          {filteredPhrases.map(([key, text]) => {
            const [articleId, startIdx, endIdx] = key.split(":");
            return (
              <div
                key={key}
                className="flex items-center justify-between border-b border-black/5 px-4 py-3"
              >
                <p className="text-sm font-medium flex-1 mr-3">{text}</p>
                <button
                  onClick={() =>
                    removeSentence(articleId, Number(startIdx), Number(endIdx))
                  }
                  className="text-black/20 hover:text-black/50 transition-colors shrink-0"
                >
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
});

export default DictionaryPage;
