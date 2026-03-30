"use client";

import Link from "next/link";
import { observer } from "@legendapp/state/react";

import { appState$ } from "@/lib/state/app-state";
import {
  knownWordsCount$,
  learningWordsCount$,
} from "@/lib/state/dictionary-state";

const ProfilePage = observer(function ProfilePage() {
  const stats = appState$.stats.get();
  const knownCount = knownWordsCount$.get();
  const learningCount = learningWordsCount$.get();

  const statItems = [
    { label: "day streak", value: stats.dayStreak },
    { label: "learning", value: learningCount },
    { label: "known", value: knownCount },
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

        {/* History link */}
        <Link
          href="/history"
          className="flex items-center justify-between border border-black/10 px-4 py-4"
        >
          <div className="flex items-center gap-3">
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-black/60">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <div>
              <p className="text-sm font-semibold">Your Reads</p>
              <p className="text-xs text-black/40">
                {stats.readingsDone} reading{stats.readingsDone !== 1 ? "s" : ""} done
              </p>
            </div>
          </div>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-black/30">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>

        {/* Dictionary link */}
        <Link
          href="/dictionary"
          className="flex items-center justify-between border border-black/10 px-4 py-4"
        >
          <div className="flex items-center gap-3">
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-black/60">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              <line x1="8" y1="7" x2="16" y2="7" />
              <line x1="8" y1="11" x2="13" y2="11" />
            </svg>
            <div>
              <p className="text-sm font-semibold">Dictionary</p>
              <p className="text-xs text-black/40">
                {learningCount} learning &middot; {knownCount} known
              </p>
            </div>
          </div>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-black/30">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      </div>
    </section>
  );
});

export default ProfilePage;
