"use client";

import { useState } from "react";
import Link from "next/link";
import { observer } from "@legendapp/state/react";

import { appState$ } from "@/lib/state/app-state";
import { MOCK_ARTICLES } from "@/lib/mock-data";

function ImportModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="mx-4 w-full max-w-md border border-black/10 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Import Content</h2>
          <button onClick={onClose} className="text-black/40">
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <p className="mt-3 text-sm text-black/50">
          Paste a URL or text to import into your library.
        </p>

        <div className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-medium text-black/40">URL</label>
            <input
              type="url"
              placeholder="https://example.com/article"
              className="mt-1 w-full border border-black/10 px-3 py-2 text-sm placeholder:text-black/20 focus:border-black/30 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-black/10" />
            <span className="text-xs text-black/30">or</span>
            <div className="h-px flex-1 bg-black/10" />
          </div>

          <div>
            <label className="text-xs font-medium text-black/40">Paste text</label>
            <textarea
              rows={4}
              placeholder="Paste article text here..."
              className="mt-1 w-full resize-none border border-black/10 px-3 py-2 text-sm placeholder:text-black/20 focus:border-black/30 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-black/40">Title</label>
            <input
              type="text"
              placeholder="Article title"
              className="mt-1 w-full border border-black/10 px-3 py-2 text-sm placeholder:text-black/20 focus:border-black/30 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-black/10 py-2.5 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-black py-2.5 text-sm font-semibold text-white"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
}

const LibraryPage = observer(function LibraryPage() {
  const [showImport, setShowImport] = useState(false);
  const progress = appState$.readingProgress.get();

  return (
    <section className="flex flex-col">
      <div className="border-b border-black/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Library</h1>
          <button
            onClick={() => setShowImport(true)}
            className="bg-black px-3 py-1.5 text-xs font-semibold text-white"
          >
            + Import
          </button>
        </div>
      </div>

      <div className="px-4 pt-3">
        <p className="text-xs text-black/40">
          {MOCK_ARTICLES.length} {MOCK_ARTICLES.length === 1 ? "item" : "items"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4">
        {MOCK_ARTICLES.map((article) => {
          const ap = progress[article.id];
          const pct = ap
            ? Math.round((ap.currentPage / ap.totalPages) * 100)
            : 0;

          return (
            <Link
              key={article.id}
              href={`/read/${article.id}`}
              className="flex flex-col border border-black/10"
            >
              <div className="flex h-28 items-center justify-center bg-black/5">
                <span className="text-2xl text-black/20">{article.title.charAt(0)}</span>
              </div>
              <div className="flex flex-1 flex-col p-3">
                <p className="line-clamp-2 text-sm font-medium leading-tight">
                  {article.title}
                </p>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <span className="text-[10px] text-black/40">{article.wordsCount} words</span>
                  <span className="font-mono text-[10px] text-black/30">{pct}%</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {showImport && <ImportModal onClose={() => setShowImport(false)} />}
    </section>
  );
});

export default LibraryPage;
