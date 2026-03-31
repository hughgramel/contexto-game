import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { appState$, setLanguage } from "@/lib/state/app-state";
import {
  resetVocabularyState,
  setWordKnown,
} from "@/lib/state/vocabulary-state";

import { HomeLanguageDropdown } from "./home-language-dropdown";

describe("HomeLanguageDropdown", () => {
  beforeEach(() => {
    localStorage.clear();
    resetVocabularyState();
    setLanguage("zh");
    appState$.preferences.hasHydrated.set(true);
  });

  it("renders the current language flag as a trigger button", () => {
    render(<HomeLanguageDropdown />);
    expect(screen.getByLabelText("Select language")).toBeInTheDocument();
  });

  it("opens the dropdown on click and shows all languages", async () => {
    const user = userEvent.setup();
    render(<HomeLanguageDropdown />);

    await user.click(screen.getByLabelText("Select language"));

    expect(screen.getByText("Chinese")).toBeInTheDocument();
    expect(screen.getByText("Spanish")).toBeInTheDocument();
    expect(screen.getByText("Japanese")).toBeInTheDocument();
    expect(screen.getByText("Korean")).toBeInTheDocument();
    expect(screen.getByText("French")).toBeInTheDocument();
  });

  it("hides zero counts", async () => {
    const user = userEvent.setup();
    setWordKnown("a", "A", "zh");

    render(<HomeLanguageDropdown />);
    await user.click(screen.getByLabelText("Select language"));

    const zhButton = screen.getByText("Chinese").closest("button")!;
    expect(within(zhButton).getByText("1")).toBeInTheDocument();

    const esButton = screen.getByText("Spanish").closest("button")!;
    expect(within(esButton).queryByText("0")).not.toBeInTheDocument();
  });

  it("sorts languages by known count descending", async () => {
    const user = userEvent.setup();
    setWordKnown("a", "A", "es");
    setWordKnown("b", "B", "es");
    setWordKnown("c", "C", "zh");

    render(<HomeLanguageDropdown />);
    await user.click(screen.getByLabelText("Select language"));

    const buttons = screen.getAllByRole("button").filter(
      (btn) => btn.textContent?.match(/Chinese|Spanish|Japanese|Korean|French/),
    );

    expect(buttons[0]).toHaveTextContent("Spanish");
    expect(buttons[1]).toHaveTextContent("Chinese");
  });

  it("switches language on selection", async () => {
    const user = userEvent.setup();
    render(<HomeLanguageDropdown />);

    await user.click(screen.getByLabelText("Select language"));
    await user.click(screen.getByText("Spanish"));

    expect(appState$.language.get()).toBe("es");
  });

  it("closes the dropdown after selecting a language", async () => {
    const user = userEvent.setup();
    render(<HomeLanguageDropdown />);

    await user.click(screen.getByLabelText("Select language"));
    expect(screen.getByText("Chinese")).toBeInTheDocument();

    await user.click(screen.getByText("Spanish"));
    expect(screen.queryByText("Chinese")).not.toBeInTheDocument();
  });
});
