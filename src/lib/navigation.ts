export type AppTab = {
  href: string;
  label: string;
  icon: string;
};

export const APP_TABS: AppTab[] = [
  { href: "/home", label: "Today", icon: "home" },
  { href: "/discover", label: "Discover", icon: "discover" },
  { href: "/library", label: "Library", icon: "library" },
  { href: "/dictionary", label: "Dictionary", icon: "dictionary" },
  { href: "/profile", label: "Profile", icon: "profile" },
];

export function getTabByHref(href: string): AppTab | undefined {
  return APP_TABS.find((tab) => tab.href === href);
}

export function isTabActive(pathname: string, href: string): boolean {
  return pathname === href;
}
