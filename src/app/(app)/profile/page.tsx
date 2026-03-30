import { OnboardingControls } from "@/components/onboarding-controls";
import { OnboardingStatus } from "@/components/onboarding-status";

export default function ProfilePage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-medium text-slate-500">Account</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Profile
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-slate-600">
          This screen is the current place to validate local onboarding state
          transitions before any backend or auth work is introduced.
        </p>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Onboarding controls
        </h2>
        <p className="mt-2 mb-4 text-sm leading-6 text-slate-600">
          Use these actions to update the local persisted flag and verify reload
          behavior.
        </p>
        <OnboardingControls />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Stored onboarding data
        </h2>
        <p className="mt-2 mb-4 text-sm leading-6 text-slate-600">
          Current values from the local persisted store.
        </p>
        <OnboardingStatus />
      </section>
    </section>
  );
}
