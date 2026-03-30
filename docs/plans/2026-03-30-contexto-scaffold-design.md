# Contexto Scaffold Design

## Date

2026-03-30

## Status

Approved

## Goals

- Build a minimal PWA/web scaffold with no design work yet.
- Keep the app local-first before introducing a database-backed flow.
- Standardize on Legend State for application state decisions.
- Persist onboarding flags locally so onboarding can be expanded later.
- Create a minimal navigation shell with:
  - desktop left sidebar
  - mobile bottom navigation
  - `Home`, `Discover`, and `Profile` routes
- Add project-level instructions to bias toward architecture confirmation, tests-first work, and dev-tool verification.

## Constraints

- Keep implementation minimal.
- Do not add intentional styling/design work.
- Do not rely on Supabase as the source of truth yet.
- Preserve Next.js App Router as the routing model.

## Chosen Approach

Route-first scaffold with a config-driven shell.

### Why

- Next App Router should own navigation and route structure.
- A shared tab config keeps sidebar and mobile nav aligned.
- Legend State remains the state layer for onboarding flags and future global state.
- Local persistence validates product behavior before any database dependency is introduced.

## Architecture

### Routing

- `/` redirects to `/home`
- `/home`
- `/discover`
- `/profile`

### Layout

- Shared application shell wraps the three main routes.
- Shell renders:
  - a left sidebar on wider screens
  - a bottom navigation on smaller screens
- Navigation items are driven from one shared config object.

### State

- Legend State is the default state mechanism for app-level state.
- Initial app state includes:
  - onboarding completion flag
  - onboarding dismissed/skipped metadata placeholder
  - small preferences bucket for future local-first features
- Persistence uses Legend State persist plugins targeting browser local storage.

### Onboarding

- No dedicated onboarding route yet.
- The app stores onboarding flags locally only.
- The main app loads immediately even if onboarding is incomplete.

### Testing

- Add a lightweight test runner suitable for state utilities and shell behavior.
- Write initial tests before implementing the scaffolded state/utilities.
- Use dev tools to verify linting and tests before closing the task.

## Planned Files

- `AGENTS.md`
- `docs/plans/2026-03-30-contexto-scaffold-design.md`
- `src/app/(app)/layout.tsx`
- `src/app/(app)/home/page.tsx`
- `src/app/(app)/discover/page.tsx`
- `src/app/(app)/profile/page.tsx`
- `src/app/page.tsx`
- `src/components/app-shell.tsx`
- `src/components/app-navigation.tsx`
- `src/lib/navigation.ts`
- `src/lib/state/app-state.ts`
- `src/lib/state/persistence.ts`
- test files under `src/`

## Acceptance Criteria

- App boots into a minimal shell with three tabs.
- Desktop shows sidebar navigation.
- Mobile shows bottom navigation.
- Onboarding flags persist locally through Legend State persistence.
- Repository contains explicit project instructions for future work quality.
- Tests and lint pass.

## UI Refinement

### Status

Approved

### Goal

Make the scaffold look like a reasonable neutral app prototype without introducing a full design system.

### Chosen Direction

- Light gray app background with white content panels
- Soft borders and rounded corners
- Clear page headers and grouped content cards
- Restrained primary and secondary button treatments
- Sidebar and bottom nav with visible chrome and active state

### Constraints

- Tailwind utilities only
- No custom animation work
- No branding pass
- No expansion into a reusable primitive/component library yet
