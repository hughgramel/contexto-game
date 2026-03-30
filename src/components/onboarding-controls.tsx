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
    <div className="flex flex-col gap-2">
      <button disabled={hasCompleted} onClick={() => completeOnboarding()}>
        Mark onboarding complete
      </button>

      <button onClick={() => skipOnboarding()}>Set skipped timestamp</button>

      <button onClick={() => resetOnboarding()}>Reset onboarding</button>
    </div>
  );
});
