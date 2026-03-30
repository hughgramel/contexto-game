"use client";

import { use, useCallback } from "react";
import { useRouter } from "next/navigation";
import { observer } from "@legendapp/state/react";

import {
  appState$,
  addWordsRead,
  addWordsKnown,
  setReadingProgress,
  incrementReadingsDone,
} from "@/lib/state/app-state";
import { getArticleById } from "@/lib/mock-data";

type ReaderPageProps = {
  params: Promise<{ id: string }>;
};

const ReaderPage = observer(function ReaderPage({ params }: ReaderPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const article = getArticleById(id);

  const progressData = appState$.readingProgress.get();
  const stats = appState$.stats.get();
  const currentProgress = progressData[id];
  const currentPage = currentProgress?.currentPage ?? 0;
  const totalPages = article?.pages.length ?? 1;
  const pct = Math.round(((currentPage + 1) / totalPages) * 100);

  const goToPage = useCallback(
    (page: number) => {
      if (!article) return;
      setReadingProgress(id, page, totalPages);

      const wordsPerPage = Math.round(article.wordsCount / totalPages);
      addWordsRead(wordsPerPage);
      addWordsKnown(Math.round(wordsPerPage * 0.3));
    },
    [id, article, totalPages],
  );

  const nextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      goToPage(currentPage + 1);
    } else {
      incrementReadingsDone();
      router.push("/home");
    }
  }, [currentPage, totalPages, goToPage, router]);

  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      setReadingProgress(id, currentPage - 1, totalPages);
    }
  }, [currentPage, id, totalPages]);

  if (!article) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Article not found.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b border-black/10 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/home")}
            className="text-black/40"
          >
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div className="flex-1">
            <div className="h-2 bg-black/10">
              <div
                className="h-2 bg-black transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <span className="shrink-0 font-mono text-xs text-black/40">
            {currentPage + 1}/{totalPages}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-black/40">Read</span>
            <span className="font-mono font-bold">{stats.wordsRead}</span>
          </div>
          <div className="h-3 w-px bg-black/10" />
          <div className="flex items-center gap-1.5">
            <span className="text-black/40">Known</span>
            <span className="font-mono font-bold">{stats.wordsKnown}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-4 py-6">
        {currentPage === 0 && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{article.title}</h1>
            <p className="mt-2 text-sm text-black/50">{article.subtitle}</p>
          </div>
        )}

        <p className="flex-1 text-base leading-7 text-black/70">
          {article.pages[currentPage]}
        </p>

        <div className="mt-8 flex gap-3">
          {currentPage > 0 && (
            <button
              onClick={prevPage}
              className="flex-1 border border-black/10 py-3 text-sm font-medium"
            >
              Previous
            </button>
          )}
          <button
            onClick={nextPage}
            className="flex-1 bg-black py-3 text-sm font-semibold text-white"
          >
            {currentPage < totalPages - 1 ? "Next Page" : "Finish"}
          </button>
        </div>
      </div>
    </div>
  );
});

export default ReaderPage;
