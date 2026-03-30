"use client";

type WordActionModalProps = {
  token: string | null;
  onClose: () => void;
  onMarkLearning: () => void;
  onMarkKnown: () => void;
};

export function WordActionModal({
  token,
  onClose,
  onMarkLearning,
  onMarkKnown,
}: WordActionModalProps) {
  if (!token) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Word interaction"
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-6 text-left shadow-2xl shadow-black/60"
      >
        <p className="text-sm uppercase text-slate-400">Word interaction</p>
        <h2 className="mt-2 text-2xl font-semibold">{token}</h2>
        <p className="mt-2 text-sm text-slate-400">
          Tap mark learning if you want to track this word, then toggle known later.
        </p>

        <div className="mt-4 flex flex-col gap-2">
          <button
            className="rounded-2xl border border-amber-400/60 bg-amber-500/10 py-2 text-sm font-semibold text-amber-400 transition hover:border-amber-400 hover:bg-amber-400/20"
            type="button"
            onClick={() => {
              onMarkLearning();
              onClose();
            }}
          >
            Set learning
          </button>
          <button
            className="rounded-2xl border border-emerald-400/60 bg-emerald-500/10 py-2 text-sm font-semibold text-emerald-300 transition hover:border-emerald-300 hover:bg-emerald-300/20"
            type="button"
            onClick={() => {
              onMarkKnown();
              onClose();
            }}
          >
            Mark known
          </button>
        </div>

        <button
          className="mt-4 w-full text-xs uppercase tracking-[0.3em] text-slate-400"
          type="button"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
