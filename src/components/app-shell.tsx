"use client";

import type { ReactNode } from "react";

import { usePathname } from "next/navigation";

import { AppNavigation } from "@/components/app-navigation";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname() ?? "/home";

  return (
    <div className="min-h-screen md:grid md:grid-cols-[12rem_1fr]">
      <aside className="hidden p-4 md:block">
        <AppNavigation pathname={pathname} />
      </aside>

      <div className="flex min-h-screen flex-col">
        <main className="flex-1 p-4 pb-20 md:pb-4">{children}</main>

        <div className="fixed inset-x-0 bottom-0 p-4 md:hidden">
          <AppNavigation pathname={pathname} />
        </div>
      </div>
    </div>
  );
}
