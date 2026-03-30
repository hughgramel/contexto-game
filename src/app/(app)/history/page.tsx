"use client";

import Link from "next/link";
import { observer } from "@legendapp/state/react";

import { appState$ } from "@/lib/state/app-state";
import { MOCK_ARTICLES } from "@/lib/mock-data";

const HistoryPage = observer(function HistoryPage() {
  const progress = appState$.readingProgress.get();

  const articlesWithProgress = MOCK_ARTICLES.map((article) => {
    const ap = progress[article.id];
    const pct = ap ? Math.round((ap.currentPage / ap.totalPages) * 100) : 0;
    return { ...article, pct };
  }).filter((a) => a.pct > 0);

  const allArticles = MOCK_ARTICLES;

  return (
    <section className="flex flex-col min-h-[calc(100dvh-80px)]">
      <div className="p-4 space-y-6">
        {/* In progress */}
        {articlesWithProgress.length > 0 && (
          <div>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-black/40">
              In Progress
            </h2>
            <div className="space-y-2">
              {articlesWithProgress.map((article) => (
                <Link
                  key={article.id}
                  href={`/read/${article.id}`}
                  className="flex items-center gap-3 border border-black/10 p-3"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-black/5">
                    <span className="text-base text-black/20">{article.title.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{article.title}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="flex-1 h-1 bg-black/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-black/30 rounded-full"
                          style={{ width: `${article.pct}%` }}
                        />
                      </div>
                      <span className="font-mono text-[10px] text-black/40 shrink-0">
                        {article.pct}%
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All readings */}
        <div>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-black/40">
            All Readings
          </h2>
          <div className="space-y-2">
            {allArticles.map((article) => {
              const ap = progress[article.id];
              const pct = ap
                ? Math.round((ap.currentPage / ap.totalPages) * 100)
                : 0;

              return (
                <Link
                  key={article.id}
                  href={`/read/${article.id}`}
                  className="flex items-center gap-3 border border-black/10 p-3"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-black/5">
                    <span className="text-base text-black/20">{article.title.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{article.title}</p>
                    <p className="mt-0.5 text-xs text-black/40">
                      {pct > 0 ? `${pct}% complete` : "Not started"}
                    </p>
                  </div>
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-black/20 shrink-0">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
});

export default HistoryPage;
