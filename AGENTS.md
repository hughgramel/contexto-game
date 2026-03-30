# Project Instructions

## Working Rules

- Confirm or document the intended architecture before writing implementation code for non-trivial changes.
- Prefer dev tools for verification. Run tests, linting, and targeted checks instead of relying on inspection alone.
- Write or update tests before implementation whenever the task is large enough to justify coverage.
- Favor small, composable modules with explicit types and predictable data flow.
- Use Legend State for app-level state decisions unless there is a strong architectural reason not to.
- Use Legend State persistables for local-first state that must survive reloads.
- Add comments only when they clarify non-obvious intent, constraints, or edge cases.
- Keep UI scaffolding minimal unless design work is explicitly requested.
- Prefer route-driven app structure in Next.js and avoid custom client-side routing abstractions unless required.

## Current Scaffold Decisions

- Local-first onboarding flags come before any database-backed onboarding flow.
- Supabase CLI can be initialized locally, but remote project linking is deferred until credentials/project ref are available.
- Main app tabs are `Home`, `Discover`, and `Profile`.
- App shell should support desktop sidebar navigation and mobile bottom navigation from one shared config.
