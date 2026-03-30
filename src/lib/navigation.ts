export type AppTab = {
  href: string;
  label: string;
};

export const APP_TABS: AppTab[] = [
  { href: "/home", label: "Home" },
  { href: "/discover", label: "Discover" },
  { href: "/profile", label: "Profile" },
];

export function getTabByHref(href: string): AppTab | undefined {
  return APP_TABS.find((tab) => tab.href === href);
}

export function isTabActive(pathname: string, href: string): boolean {
  return pathname === href;
}
