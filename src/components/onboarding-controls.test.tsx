import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { resetOnboarding } from "@/lib/state/app-state";

import { OnboardingControls } from "./onboarding-controls";

describe("OnboardingControls", () => {
  afterEach(() => {
    resetOnboarding();
  });

  it("renders the three prototype actions", () => {
    render(<OnboardingControls />);

    expect(
      screen.getByRole("button", { name: "Mark onboarding complete" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Set skipped timestamp" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Reset onboarding" }),
    ).toBeInTheDocument();
  });
});
