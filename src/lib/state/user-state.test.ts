import { beforeEach, describe, expect, it } from "vitest";

import {
  resetUserState,
  updateReaderPreferences,
  updateUserProfile,
  userState$,
} from "@/lib/state/user-state";

describe("user state", () => {
  beforeEach(() => {
    localStorage.clear();
    resetUserState();
  });

  it("updates profile and reader preferences", () => {
    updateUserProfile({
      displayName: "Mira",
      targetLanguage: "German",
    });
    updateReaderPreferences({
      preferredReaderMode: "mobile",
    });

    expect(userState$.profile.displayName.get()).toBe("Mira");
    expect(userState$.profile.targetLanguage.get()).toBe("German");
    expect(userState$.preferences.preferredReaderMode.get()).toBe("mobile");
  });
});
