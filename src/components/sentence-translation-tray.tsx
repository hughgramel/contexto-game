"use client";

type SentenceTranslationTrayProps = {
  sentence: string | null;
  translation?: string | null;
};

export function SentenceTranslationTray({ sentence, translation }: SentenceTranslationTrayProps) {
  if (!sentence) {
    return null;
  }

  return (
    <div className="absolute inset-x-4 bottom-4 z-30 rounded-2xl border border-white/10 bg-slate-900/90 p-4 shadow-xl shadow-black/60 backdrop-blur">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Sentence selection</p>
      <p className="mt-1 text-sm font-semibold text-white">{sentence}</p>
      {translation && <p className="mt-2 text-xs text-slate-400">{translation}</p>}
    </div>
  );
}
