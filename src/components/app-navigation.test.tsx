import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppNavigation } from "./app-navigation";

describe("AppNavigation", () => {
  it("renders all tabs and marks the active route", () => {
    render(<AppNavigation pathname="/discover" />);

    const homeLink = screen.getByRole("link", { name: "Home" });
    const discoverLink = screen.getByRole("link", { name: "Discover" });
    const profileLink = screen.getByRole("link", { name: "Profile" });

    expect(homeLink).toHaveAttribute("href", "/home");
    expect(discoverLink).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(profileLink).toHaveAttribute("href", "/profile");

    expect(discoverLink.className).toContain("bg-slate-900");
    expect(homeLink.className).toContain("text-slate-600");
  });
});
