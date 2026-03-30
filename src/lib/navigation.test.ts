import { describe, expect, it } from "vitest";

import { APP_TABS, getTabByHref } from "./navigation";

describe("navigation", () => {
  it("defines the application tabs in order", () => {
    expect(APP_TABS).toEqual([
      { href: "/home", label: "Today", icon: "home" },
      { href: "/discover", label: "Discover", icon: "discover" },
      { href: "/library", label: "Library", icon: "library" },
      { href: "/profile", label: "Profile", icon: "profile" },
    ]);
  });

  it("resolves tabs by href", () => {
    expect(getTabByHref("/discover")?.label).toBe("Discover");
    expect(getTabByHref("/library")?.label).toBe("Library");
    expect(getTabByHref("/missing")).toBeUndefined();
  });
});
