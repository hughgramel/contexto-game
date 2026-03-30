"use client";

import Link from "next/link";
import { observer } from "@legendapp/state/react";

import { appState$ } from "@/lib/state/app-state";
import { MOCK_ARTICLES } from "@/lib/mock-data";

const ProfilePage = observer(function ProfilePage() {
  const stats = appState$.stats.get();
  const progress = appState$.readingProgress.get();

  const statItems = [
    { label: "day streak", value: stats.dayStreak },
    { label: "words read", value: stats.wordsRead },
    { label: "words known", value: stats.wordsKnown },
    { label: "readings done", value: stats.readingsDone },
  ];

  return (
    <section className="flex flex-col">
      <div className="border-b border-black/10 px-4 py-4">
        <h1 className="text-xl font-bold">Profile</h1>
      </div>

      <div className="space-y-6 p-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center border border-black/10 text-lg font-bold">
            H
          </div>
          <div>
            <p className="text-lg font-semibold">Hugh Gramelspacher</p>
            <p className="text-xs text-black/40">Since 3/18/2026</p>
          </div>
        </div>

        <button className="w-full border border-black/10 px-4 py-2.5 text-sm font-medium">
          Settings
        </button>

        <div>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-black/40">Overview</h2>
          <div className="grid grid-cols-2 gap-3">
            {statItems.map((item) => (
              <div key={item.label} className="border border-black/10 p-4">
                <p className="font-mono text-2xl font-bold">{item.value}</p>
                <p className="mt-1 text-xs text-black/40">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-black/40">Your Reads</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {MOCK_ARTICLES.slice(0, 4).map((article) => {
              const ap = progress[article.id];
              const pct = ap
                ? Math.round((ap.currentPage / ap.totalPages) * 100)
                : 0;

              return (
                <Link
                  key={article.id}
                  href={`/read/${article.id}`}
                  className="w-36 shrink-0 border border-black/10"
                >
                  <div className="flex h-20 items-center justify-center bg-black/5">
                    <span className="text-xl text-black/20">{article.title.charAt(0)}</span>
                  </div>
                  <div className="p-2">
                    <p className="line-clamp-2 text-xs font-medium">{article.title}</p>
                    <p className="mt-1 font-mono text-[10px] text-black/40">{pct}% done</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
});

export default ProfilePage;
