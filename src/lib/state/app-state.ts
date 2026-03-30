import { when } from "@legendapp/state";
import { persistObservable } from "@legendapp/state/persist";

import { ensureLocalPersistenceConfigured } from "./persistence";

export const APP_STATE_PERSIST_KEY = "contexto-app-state";

export type AppState = {
  onboarding: {
    hasCompleted: boolean;
    completedAt: string | null;
    skippedAt: string | null;
  };
  preferences: {
    hasHydrated: boolean;
  };
};

export function createInitialAppState(): AppState {
  return {
    onboarding: {
      hasCompleted: false,
      completedAt: null,
      skippedAt: null,
    },
    preferences: {
      hasHydrated: false,
    },
  };
}

export function isOnboardingComplete(state: AppState): boolean {
  return state.onboarding.hasCompleted;
}

ensureLocalPersistenceConfigured();

export const appState$ = persistObservable(createInitialAppState(), {
  local: APP_STATE_PERSIST_KEY,
});

// Surface local-storage readiness so the initial scaffold can verify persistence behavior.
void when(() => appState$._state.isLoadedLocal.get(), () => {
  appState$.preferences.hasHydrated.set(true);
});

export function completeOnboarding(timestamp = new Date().toISOString()): void {
  appState$.onboarding.set({
    hasCompleted: true,
    completedAt: timestamp,
    skippedAt: null,
  });
}

export function skipOnboarding(timestamp = new Date().toISOString()): void {
  appState$.onboarding.set({
    hasCompleted: false,
    completedAt: null,
    skippedAt: timestamp,
  });
}

export function resetOnboarding(): void {
  appState$.onboarding.set({
    hasCompleted: false,
    completedAt: null,
    skippedAt: null,
  });
}
