"use client";

import Link from "next/link";

type LibraryMediaCardProps = {
  mediaId: string;
  title: string;
  sourceType: "sample" | "upload";
  progressPercent: number;
  continuePageIndex: number | null;
  coverColor?: string;
};

export function LibraryMediaCard({
  mediaId,
  title,
  progressPercent,
  sourceType,
  continuePageIndex,
  coverColor = "from-slate-800 to-slate-900",
}: LibraryMediaCardProps) {
  const buttonLabel =
    progressPercent > 0 && continuePageIndex !== null ? "Continue" : "Open";

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-gradient-to-br p-4 shadow-lg shadow-slate-900/40">
      <div className={`flex h-32 items-center justify-center rounded-2xl bg-gradient-to-br ${coverColor}`}>
        <span className="text-sm uppercase tracking-[0.3em] text-white/80">
          {sourceType === "sample" ? "Sample" : "Upload"}
        </span>
      </div>

      <div className="space-y-1">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-sm text-slate-300">
          {sourceType === "sample"
            ? "Bundled starter text for local-first reading flows."
            : "Imported plain-text media stored locally in this browser."}
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-400">
          <span>Progress</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-emerald-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
          {continuePageIndex === null ? "Start reading" : `Page ${continuePageIndex + 1}`}
        </span>
        <Link
          className="rounded-full bg-emerald-400 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-950 transition hover:bg-emerald-500"
          href={`/reader/${mediaId}`}
        >
          {buttonLabel}
        </Link>
      </div>
    </article>
  );
}
