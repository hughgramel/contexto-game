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
    <div className="min-h-screen bg-white text-black md:grid md:grid-cols-[14rem_1fr]">
      <aside className="hidden border-r border-black/10 md:flex md:min-h-screen md:flex-col md:justify-between md:p-4">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-black/40">
            Contexto
          </p>
          <AppNavigation pathname={pathname} variant="sidebar" />
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        <main className="mx-auto flex w-full max-w-lg flex-1 flex-col pb-20 md:max-w-3xl md:pb-8">
          {children}
        </main>

        <div className="fixed inset-x-0 bottom-0 md:hidden">
          <AppNavigation pathname={pathname} variant="bottom" />
        </div>
      </div>
    </div>
  );
}
