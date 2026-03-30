"use client";

import { observer } from "@legendapp/state/react";

import { appState$ } from "@/lib/state/app-state";

export const OnboardingStatus = observer(function OnboardingStatus() {
  const onboarding = appState$.onboarding.get();
  const hasHydrated = appState$.preferences.hasHydrated.get();

  return (
    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-[10rem_1fr]">
      <dt className="text-sm font-medium text-slate-500">Hydrated</dt>
      <dd className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
        {hasHydrated ? "yes" : "no"}
      </dd>

      <dt className="text-sm font-medium text-slate-500">Completed</dt>
      <dd className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
        {onboarding.hasCompleted ? "yes" : "no"}
      </dd>

      <dt className="text-sm font-medium text-slate-500">Completed at</dt>
      <dd className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
        {onboarding.completedAt ?? "not set"}
      </dd>

      <dt className="text-sm font-medium text-slate-500">Skipped at</dt>
      <dd className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
        {onboarding.skippedAt ?? "not set"}
      </dd>
    </dl>
  );
});
