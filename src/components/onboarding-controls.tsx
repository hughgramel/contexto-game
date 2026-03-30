"use client";

import { observer } from "@legendapp/state/react";

import {
  appState$,
  completeOnboarding,
  resetOnboarding,
  skipOnboarding,
} from "@/lib/state/app-state";

export const OnboardingControls = observer(function OnboardingControls() {
  const hasCompleted = appState$.onboarding.hasCompleted.get();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <button
        className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        disabled={hasCompleted}
        onClick={() => completeOnboarding()}
      >
        Mark onboarding complete
      </button>

      <button
        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        onClick={() => skipOnboarding()}
      >
        Set skipped timestamp
      </button>

      <button
        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        onClick={() => resetOnboarding()}
      >
        Reset onboarding
      </button>
    </div>
  );
});
