export default function DiscoverPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-medium text-slate-500">Explore</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Discover
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-slate-600">
          Placeholder content cards make the tab feel closer to a real product
          while keeping the implementation intentionally light.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Daily clue
          </p>
          <h2 className="mt-3 text-lg font-semibold text-slate-900">
            Featured challenge
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            A slot for the primary puzzle or entry point users should try next.
          </p>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Progress
          </p>
          <h2 className="mt-3 text-lg font-semibold text-slate-900">
            Continue where you left off
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            A future section for unfinished games, recent rounds, or saved
            context.
          </p>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Coming next
          </p>
          <h2 className="mt-3 text-lg font-semibold text-slate-900">
            Recommendations
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            A future area for suggested prompts, topics, or social discovery.
          </p>
        </section>
      </div>
    </section>
  );
}
