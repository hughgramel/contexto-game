import Link from "next/link";

import { APP_TABS, isTabActive } from "@/lib/navigation";

type AppNavigationProps = {
  pathname: string;
  variant?: "sidebar" | "bottom";
};

function TabIcon({ icon, active }: { icon: string; active: boolean }) {
  const color = active ? "#000" : "#999";
  const size = 20;

  switch (icon) {
    case "home":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    case "discover":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );
    case "library":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      );
    case "profile":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    default:
      return null;
  }
}

export function AppNavigation({
  pathname,
  variant = "sidebar",
}: AppNavigationProps) {
  const isBottom = variant === "bottom";

  return (
    <nav
      aria-label="Primary navigation"
      className={
        isBottom
          ? "border-t border-black/10 bg-white px-2 pt-2 pb-6"
          : ""
      }
    >
      <ul
        className={
          isBottom
            ? "flex list-none gap-0 p-0"
            : "flex list-none flex-col gap-1 p-0"
        }
      >
        {APP_TABS.map((tab) => {
          const isActive = isTabActive(pathname, tab.href);

          return (
            <li key={tab.href} className={isBottom ? "flex-1" : ""}>
              <Link
                aria-current={isActive ? "page" : undefined}
                className={[
                  "flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium",
                  isBottom ? "justify-center" : "flex-row gap-3 text-sm",
                  isActive
                    ? "text-black"
                    : "text-black/40",
                ].join(" ")}
                href={tab.href}
              >
                <TabIcon icon={tab.icon} active={isActive} />
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
