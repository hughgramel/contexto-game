"use client";

import Link from "next/link";
import { observer } from "@legendapp/state/react";

import { LanguageSwitcher } from "@/components/language-switcher";
import { StatsBar } from "@/components/stats-bar";
import { appState$ } from "@/lib/state/app-state";
import { MOCK_ARTICLES } from "@/lib/mock-data";

const HomePage = observer(function HomePage() {
  const progress = appState$.readingProgress.get();
  const currentArticle = MOCK_ARTICLES[0];
  const articleProgress = progress[currentArticle.id];
  const pct = articleProgress
    ? Math.round((articleProgress.currentPage / articleProgress.totalPages) * 100)
    : 0;

  return (
    <section className="flex flex-col">
      <div className="flex items-center justify-between border-b border-black/10 px-4 py-3">
        <LanguageSwitcher />
        <StatsBar />
      </div>

      <div className="space-y-6 p-4">
        <div>
          <p className="text-xs text-black/40">This week: Mar 30 – Apr 5</p>
          <h1 className="mt-1 text-xl font-bold">Today</h1>
        </div>

        <Link
          href={`/read/${currentArticle.id}`}
          className="block border border-black/10 p-4"
        >
          <div className="mb-3 flex items-center gap-2">
            <span className="border border-black/10 px-2 py-0.5 text-xs text-black/50">
              {currentArticle.category}
            </span>
            <span className="text-xs text-black/30">{currentArticle.date}</span>
          </div>
          <h2 className="text-lg font-bold">{currentArticle.title}</h2>
          <p className="mt-1 text-sm text-black/50">{currentArticle.subtitle}</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="bg-black px-4 py-2 text-sm font-semibold text-white">
              {pct > 0 ? "Resume" : "Start Reading"}
            </span>
            <span className="font-mono text-sm text-black/40">{pct}%</span>
          </div>
        </Link>

        <div>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-black/40">
            Continue Reading
          </h2>
          <div className="space-y-2">
            {MOCK_ARTICLES.slice(1, 4).map((article) => {
              const ap = progress[article.id];
              const apPct = ap ? Math.round((ap.currentPage / ap.totalPages) * 100) : 0;

              return (
                <Link
                  key={article.id}
                  href={`/read/${article.id}`}
                  className="flex items-center justify-between border border-black/10 px-4 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{article.title}</p>
                    <p className="mt-0.5 text-xs text-black/40">
                      {article.category} · {article.wordsCount} words
                    </p>
                  </div>
                  <span className="ml-3 shrink-0 font-mono text-xs text-black/40">
                    {apPct}%
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
});

export default HomePage;
