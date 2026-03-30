# Contexto

Minimal local-first Next.js scaffold for the Contexto web app.

## Current Scope

- App Router scaffold with `Home`, `Discover`, and `Profile`
- Shared navigation shell
  - desktop left sidebar
  - mobile bottom navigation
- Legend State for app-level state
- Local persisted onboarding flags
- Vitest setup for state and shell verification

## Development

Run the app:

```bash
npm run dev
```

Run verification:

```bash
npm run test:run
npm run lint
```

## Notes

- Supabase work is intentionally deferred.
- Project-level coding instructions live in `AGENTS.md`.
- The approved scaffold design is documented in `docs/plans/2026-03-30-contexto-scaffold-design.md`.
