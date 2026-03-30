import Link from "next/link";

import { APP_TABS, isTabActive } from "@/lib/navigation";

type AppNavigationProps = {
  pathname: string;
  variant?: "sidebar" | "bottom";
};

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
          ? "rounded-2xl border border-slate-200 bg-white p-2 shadow-lg"
          : ""
      }
    >
      <ul
        className={
          isBottom
            ? "flex list-none gap-2 p-0"
            : "flex list-none flex-col gap-2 p-0"
        }
      >
        {APP_TABS.map((tab) => {
          const isActive = isTabActive(pathname, tab.href);

          return (
            <li key={tab.href} className={isBottom ? "flex-1" : ""}>
              <Link
                aria-current={isActive ? "page" : undefined}
                className={[
                  "flex rounded-xl border px-3 py-2 text-sm font-medium transition",
                  isBottom ? "justify-center" : "items-center justify-start",
                  isActive
                    ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                    : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900",
                ].join(" ")}
                href={tab.href}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
