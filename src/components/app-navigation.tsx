import Link from "next/link";

import { APP_TABS, isTabActive } from "@/lib/navigation";

type AppNavigationProps = {
  pathname: string;
};

export function AppNavigation({ pathname }: AppNavigationProps) {
  return (
    <nav aria-label="Primary navigation">
      <ul className="flex list-none gap-4 p-0 md:flex-col">
        {APP_TABS.map((tab) => {
          const isActive = isTabActive(pathname, tab.href);

          return (
            <li key={tab.href}>
              <Link
                aria-current={isActive ? "page" : undefined}
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
