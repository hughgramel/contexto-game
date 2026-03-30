import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  createMemoryMediaRepository,
} from "@/lib/media/media-repository";
import { setMediaRepository } from "@/lib/media/media-service";
import { resetLibraryState } from "@/lib/state/library-state";
import { resetReaderState } from "@/lib/state/reader-state";
import { resetStatsState } from "@/lib/state/stats-state";
import { resetUserState } from "@/lib/state/user-state";
import { resetVocabularyState } from "@/lib/state/vocabulary-state";

import HomePage from "./page";

describe("HomePage", () => {
  beforeEach(() => {
    localStorage.clear();
    setMediaRepository(createMemoryMediaRepository());
    resetLibraryState();
    resetReaderState();
    resetStatsState();
    resetUserState();
    resetVocabularyState();
  });

  it("renders the library header, sample media, and uploads local text", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    expect(screen.getByText("Contexto Library")).toBeInTheDocument();
    expect(await screen.findByText(/Aurora City Dreams/)).toBeInTheDocument();
    expect(screen.getByLabelText("Upload media")).toBeInTheDocument();

    const input = screen.getByLabelText("Upload media");
    const file = new File(
      ["A new reader appears with a second paragraph for testing."],
      "River Notes.txt",
      { type: "text/plain" },
    );

    await user.upload(input, file);

    expect(await screen.findByText("River Notes")).toBeInTheDocument();
  });
});
