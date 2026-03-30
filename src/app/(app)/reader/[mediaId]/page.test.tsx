import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { createMemoryMediaRepository } from "@/lib/media/media-repository";
import { setMediaRepository } from "@/lib/media/media-service";
import { resetLibraryState } from "@/lib/state/library-state";
import { resetReaderState } from "@/lib/state/reader-state";
import { resetStatsState } from "@/lib/state/stats-state";
import { resetUserState } from "@/lib/state/user-state";
import { resetVocabularyState } from "@/lib/state/vocabulary-state";

vi.mock("next/navigation", () => ({
  useParams: () => ({ mediaId: "sample-text" }),
}));

import ReaderPage from "./page";

describe("ReaderPage", () => {
  it("renders navigation, page data, and token modal interactions", async () => {
    localStorage.clear();
    setMediaRepository(createMemoryMediaRepository());
    resetLibraryState();
    resetReaderState();
    resetStatsState();
    resetUserState();
    resetVocabularyState();

    render(<ReaderPage />);

    expect(await screen.findByText("Aurora City Dreams")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /next page/i }),
    ).toBeInTheDocument();

    const token = screen.getByRole("button", { name: "Aurora" });
    fireEvent.click(token);
    expect(screen.getByText("Word interaction")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Mark known"));
    expect(screen.queryByText("Word interaction")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /next page/i }));
    expect(screen.getByText(/Active: Page 2/)).toBeInTheDocument();
  });
});
