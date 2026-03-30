"use client";

import { observer } from "@legendapp/state/react";

import { appState$ } from "@/lib/state/app-state";

export const StatsBar = observer(function StatsBar() {
  const stats = appState$.stats.get();

  return (
    <div className="flex items-center gap-4 text-sm">
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
  );
});
