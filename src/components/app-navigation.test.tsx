import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppNavigation } from "./app-navigation";

describe("AppNavigation", () => {
  it("renders all tabs and marks the active route", () => {
    render(<AppNavigation pathname="/discover" />);

    const homeLink = screen.getByRole("link", { name: /Today/i });
    const discoverLink = screen.getByRole("link", { name: /Discover/i });
    const libraryLink = screen.getByRole("link", { name: /Library/i });
    const profileLink = screen.getByRole("link", { name: /Profile/i });

    expect(homeLink).toHaveAttribute("href", "/home");
    expect(discoverLink).toHaveAttribute("aria-current", "page");
    expect(libraryLink).toHaveAttribute("href", "/library");
    expect(profileLink).toHaveAttribute("href", "/profile");

    expect(discoverLink.className).toContain("text-black");
    expect(homeLink.className).toContain("text-black/40");
  });
});
