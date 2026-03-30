import { OnboardingStatus } from "@/components/onboarding-status";

export default function HomePage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-medium text-slate-500">Overview</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Home
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-slate-600">
          This prototype keeps the product local-first while validating the app
          shell, navigation, and onboarding state behavior.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Scaffold status
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            The current build is intentionally narrow: route-backed tabs,
            local-only onboarding flags, and just enough chrome to feel like an
            app instead of raw placeholders.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-900">Navigation</p>
              <p className="mt-1 text-sm text-slate-600">
                Sidebar on desktop and bottom nav on mobile.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-900">State</p>
              <p className="mt-1 text-sm text-slate-600">
                Legend State with persisted onboarding metadata.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-900">Testing</p>
              <p className="mt-1 text-sm text-slate-600">
                Shell and state behavior verified through dev tooling.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-900">Backend</p>
              <p className="mt-1 text-sm text-slate-600">
                Deferred until the local interaction model feels correct.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Onboarding state
          </h2>
          <p className="mt-2 mb-4 text-sm leading-6 text-slate-600">
            Current locally persisted onboarding metadata.
          </p>
          <OnboardingStatus />
        </section>
      </div>
    </section>
  );
}
