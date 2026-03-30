"use client";

import { observer } from "@legendapp/state/react";

import { appState$ } from "@/lib/state/app-state";

export const OnboardingStatus = observer(function OnboardingStatus() {
  const onboarding = appState$.onboarding.get();
  const hasHydrated = appState$.preferences.hasHydrated.get();

  return (
    <dl>
      <dt>Hydrated</dt>
      <dd>{hasHydrated ? "yes" : "no"}</dd>

      <dt>Completed</dt>
      <dd>{onboarding.hasCompleted ? "yes" : "no"}</dd>

      <dt>Completed at</dt>
      <dd>{onboarding.completedAt ?? "not set"}</dd>

      <dt>Skipped at</dt>
      <dd>{onboarding.skippedAt ?? "not set"}</dd>
    </dl>
  );
});
