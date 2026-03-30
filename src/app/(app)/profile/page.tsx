"use client";

import { useSelector } from "@legendapp/state/react";

import { SafeAreaShell } from "@/components/safe-area-shell";
import { getOverviewStats } from "@/lib/state/stats-state";
import { userState$ } from "@/lib/state/user-state";
import { getVocabularyEntries } from "@/lib/state/vocabulary-state";

const statusMap = {
  known: "text-emerald-300",
  learning: "text-amber-300",
} as const;

const bgMap = {
  known: "bg-emerald-500/5",
  learning: "bg-amber-500/10",
} as const;

export default function ProfilePage() {
  const overview = useSelector(() => getOverviewStats());
  const profile = useSelector(() => userState$.profile.get());
  const vocabularyEntries = useSelector(() =>
    Object.values(getVocabularyEntries()).sort((left, right) =>
      right.updatedAt.localeCompare(left.updatedAt),
    ),
  );

  const stats = [
    { label: "Words read", value: overview.wordsRead.toString() },
    { label: "Words known", value: overview.wordsKnown.toString() },
    { label: "Words learning", value: overview.wordsLearning.toString() },
    { label: "Pages completed", value: overview.pagesCompleted.toString() },
  ];

  return (
    <SafeAreaShell className="px-4 py-6 md:px-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">Profile</p>
          <h1 className="text-3xl font-semibold text-white">{profile.displayName}</h1>
          <p className="text-sm text-slate-400">
            {profile.nativeLanguage} → {profile.targetLanguage} · local-first
            state persisted in this browser.
          </p>
        </header>

        <section className="grid gap-4 rounded-3xl border border-white/10 bg-slate-900/70 p-5 md:grid-cols-2">
          {stats.map((entry) => (
            <div key={entry.label} className="rounded-2xl bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{entry.label}</p>
              <p className="mt-2 text-3xl font-semibold text-white">{entry.value}</p>
            </div>
          ))}
        </section>

        <section className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/70 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Vocabulary snapshot</h2>
            <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
              {vocabularyEntries.length} tracked
            </span>
          </div>
          {vocabularyEntries.length === 0 ? (
            <p className="text-sm text-slate-400">
              No tracked words yet. Unknown words stay implicit until you click
              them in the reader.
            </p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {vocabularyEntries.map((entry) => (
                <div
                  key={entry.normalized}
                  className={`rounded-2xl border border-white/5 px-4 py-3 ${bgMap[entry.status]}`}
                >
                  <p className="text-sm font-semibold text-white">
                    {entry.surfaceForms[0] ?? entry.normalized}
                  </p>
                  <p className={`text-xs uppercase tracking-[0.3em] ${statusMap[entry.status]}`}>
                    {entry.status}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-2 rounded-3xl border border-white/10 bg-slate-900/70 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Local data</h2>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.35em] text-slate-300">
              Browser local
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Media metadata, vocabulary, reader progress, and stats are persisted
            locally. Media files and parsed documents live in IndexedDB until
            Supabase storage is added later.
          </p>
        </section>
      </div>
    </SafeAreaShell>
  );
}
