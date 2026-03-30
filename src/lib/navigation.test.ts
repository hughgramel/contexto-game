import { describe, expect, it } from "vitest";

import { APP_TABS, getTabByHref } from "./navigation";

describe("navigation", () => {
  it("defines the minimal application tabs in order", () => {
    expect(APP_TABS).toEqual([
      { href: "/home", label: "Home" },
      { href: "/discover", label: "Discover" },
      { href: "/profile", label: "Profile" },
    ]);
  });

  it("resolves tabs by href", () => {
    expect(getTabByHref("/discover")?.label).toBe("Discover");
    expect(getTabByHref("/missing")).toBeUndefined();
  });
});
