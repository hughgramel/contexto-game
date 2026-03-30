"use client";

import { useState } from "react";
import Link from "next/link";

import { CATEGORIES, MOCK_ARTICLES, getArticlesByCategory } from "@/lib/mock-data";

export default function DiscoverPage() {
  const [activeCategory, setActiveCategory] = useState("Latest");
  const articles = getArticlesByCategory(activeCategory);

  return (
    <section className="flex flex-col">
      <div className="border-b border-black/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Discover</h1>
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={[
                "shrink-0 border px-3 py-1.5 text-xs font-medium",
                activeCategory === cat
                  ? "border-black bg-black text-white"
                  : "border-black/10 text-black/40",
              ].join(" ")}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-3">
        <p className="text-xs text-black/40">
          {articles.length} {articles.length === 1 ? "article" : "articles"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4">
        {articles.map((article) => (
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
                <span className="text-[10px] text-black/40">{article.category}</span>
                <span className="text-[10px] text-black/30">{article.date}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
