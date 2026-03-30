import { describe, expect, it } from "vitest";

import {
  APP_STATE_PERSIST_KEY,
  createInitialAppState,
  isOnboardingComplete,
} from "./app-state";

describe("app state", () => {
  it("starts with onboarding incomplete and local-first preferences", () => {
    const state = createInitialAppState();

    expect(state.onboarding.hasCompleted).toBe(false);
    expect(state.onboarding.completedAt).toBeNull();
    expect(state.preferences.hasHydrated).toBe(false);
  });

  it("uses a stable persistence key for local storage", () => {
    expect(APP_STATE_PERSIST_KEY).toBe("contexto-app-state");
  });

  it("derives onboarding completion from state", () => {
    expect(isOnboardingComplete(createInitialAppState())).toBe(false);
    expect(
      isOnboardingComplete({
        onboarding: {
          hasCompleted: true,
          completedAt: "2026-03-30T00:00:00.000Z",
          skippedAt: null,
        },
        preferences: {
          hasHydrated: true,
        },
      }),
    ).toBe(true);
  });
});
