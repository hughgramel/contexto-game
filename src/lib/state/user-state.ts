import { observable } from "@legendapp/state";
import { persistObservable } from "@legendapp/state/persist";

import type { ReaderPreferences, UserProfile } from "@/lib/reader/models";

import { ensureLocalPersistenceConfigured } from "./persistence";

export const USER_STATE_PERSIST_KEY = "contexto-user-state";

export type UserState = {
  profile: UserProfile;
  preferences: ReaderPreferences;
};

export function createInitialUserState(): UserState {
  return {
    profile: {
      id: "local-user",
      displayName: "Contexto Reader",
      nativeLanguage: "English",
      targetLanguage: "Spanish",
      updatedAt: "2026-03-30T00:00:00.000Z",
    },
    preferences: {
      preferredReaderMode: "auto",
      useSafeAreaInsets: true,
    },
  };
}

ensureLocalPersistenceConfigured();

export const userState$ = observable(createInitialUserState());

persistObservable(userState$, {
  local: USER_STATE_PERSIST_KEY,
});

export function resetUserState(): void {
  userState$.set(createInitialUserState());
}

export function updateUserProfile(
  updates: Partial<Omit<UserProfile, "id">>,
): void {
  const current = userState$.profile.get();
  userState$.profile.set({
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}

export function updateReaderPreferences(
  updates: Partial<ReaderPreferences>,
): void {
  userState$.preferences.set({
    ...userState$.preferences.get(),
    ...updates,
  });
}
