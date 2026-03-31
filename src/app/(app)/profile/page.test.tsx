import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { resetStatsState } from "@/lib/state/stats-state";
import { resetUserState } from "@/lib/state/user-state";
import { resetVocabularyState, setWordKnown } from "@/lib/state/vocabulary-state";

import ProfilePage from "./page";

describe("ProfilePage", () => {
  beforeEach(() => {
    localStorage.clear();
    resetStatsState();
    resetUserState();
    resetVocabularyState();
  });

  it("renders the stats grid and vocabulary snapshot", () => {
    setWordKnown("aurora", "Aurora");

    render(<ProfilePage />);

    expect(screen.getByText("Words read")).toBeInTheDocument();
    expect(screen.getByText("Vocabulary snapshot")).toBeInTheDocument();
    expect(screen.getByText("Local data")).toBeInTheDocument();
  });
});
