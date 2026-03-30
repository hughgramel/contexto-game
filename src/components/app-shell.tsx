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
    <div className="min-h-screen bg-slate-100 md:grid md:grid-cols-[16rem_1fr]">
      <aside className="hidden border-r border-slate-200 bg-white md:flex md:min-h-screen md:flex-col md:gap-8 md:p-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Contexto
          </p>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Prototype</h1>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Local-first app scaffold with persisted onboarding state.
            </p>
          </div>
        </div>

        <AppNavigation pathname={pathname} variant="sidebar" />
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="border-b border-slate-200 bg-white md:hidden">
          <div className="px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Contexto
            </p>
            <p className="mt-1 text-base font-semibold text-slate-900">
              Prototype
            </p>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 p-4 pb-28 md:p-8">
          {children}
        </main>

        <div className="fixed inset-x-0 bottom-0 p-4 md:hidden">
          <AppNavigation pathname={pathname} variant="bottom" />
        </div>
      </div>
    </div>
  );
}
