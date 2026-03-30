# Contexto Reader Backend Design

## Date

2026-03-30

## Status

Approved

## Goals

- Build the local-first backend and state model for a gamified language-learning reader.
- Use Legend State as the application state layer.
- Track known and learning words while keeping unknown words implicit.
- Support local media upload now and a storage-adapter path to Supabase later.
- Provide CRUD for media, vocabulary state, user data, reader progress, and aggregate stats.
- Persist reader resume state locally.
- Support quick comprehension analysis based on known words only.
- Store per-media frequency maps for fast comprehension reanalysis.
- Keep the initial UI minimal but functional on web and mobile/PWA.

## Constraints

- Browser-local only for now.
- Store larger media payloads in IndexedDB rather than local storage.
- Keep the current Next.js App Router structure.
- Keep `Home`, `Discover`, and `Profile` as the top-level tabs.
- Make `Home` the library entry point.
- Use buttons for web page navigation.
- Use a mobile sliding-window reader with previous/active/next pages preloaded.
- Keep styling basic with Tailwind classes and safe-area support.

## Chosen Approach

Domain-split Legend State stores plus a local media repository backed by IndexedDB.

### Why

- It keeps durable learning state separate from transient reader state.
- It makes tests focused and deterministic.
- It allows the storage backend to change later without rewriting reader or vocabulary logic.
- It matches the current local-first product stage.

## Architecture

### Routes

- `/` redirects to `/home`
- `/home`
  - library surface with bundled sample media and local uploads
- `/reader/[mediaId]`
  - dedicated reader route for one media item
- `/discover`
  - placeholder for future discovery/import expansion
- `/profile`
  - stats, preferences, and local debug/reset controls

### State Modules

- `src/lib/state/persistence.ts`
  - shared Legend persistence setup and storage keys
- `src/lib/state/app-state.ts`
  - scaffold-level app hydration state kept from the existing scaffold
- `src/lib/state/user-state.ts`
  - user profile, reading preferences, display mode, and local-only metadata
- `src/lib/state/vocabulary-state.ts`
  - known and learning word entries and derived counts
- `src/lib/state/library-state.ts`
  - media metadata index and continue-reading derivations
- `src/lib/state/reader-state.ts`
  - active media, page position, modal state, sentence selection, page window state, and resume state
- `src/lib/state/stats-state.ts`
  - words read, known-word progress, page snapshots, and media summaries

### Storage Boundaries

- Legend persisted stores:
  - media metadata
  - vocabulary entries
  - reader resume/progress state
  - aggregate stats
  - user preferences
- IndexedDB:
  - raw uploaded media payloads
  - parsed reader documents
  - precomputed analysis payloads such as word frequency maps

### Core Domain Types

- `MediaRecord`
  - `id`, `title`, `kind`, `sourceType`, `createdAt`, `updatedAt`, `lastOpenedAt`, `coverUrl?`
- `ReaderDocument`
  - `mediaId`, `title`, `pages`, `frequencyByWord`, `pageWordCounts`, `totalWordTokens`
- `ReaderPage`
  - `id`, `index`, `paragraphs`, `sentences`, `tokens`, `wordCount`
- `ReaderToken`
  - `id`, `surface`, `normalized`, `sentenceId`, `paragraphId`
- `WordEntry`
  - `normalized`, `surfaceForms`, `status`
- `ReaderProgress`
  - `mediaId`, `pageIndex`, `progressPercent`, `scrollTop`, `knownAtPageStart`, `knownAtPageEnd`, `wordsReadOnPage`

### Vocabulary Rules

- Unknown words are implicit by absence from the vocabulary map.
- Persist only `learning` and `known` entries.
- Clicking an unknown word may promote it to `learning`.
- Marking a word `known` updates vocabulary state, closes the modal, and recomputes progress.

### Reader Rules

- Opening media hydrates parsed content from IndexedDB and resume state from Legend persistence.
- Web uses `Previous page` and `Next page` buttons.
- Mobile uses a vertical sliding window with previous/active/next pages preloaded.
- Page changes persist progress, clear transient UI state, and update stats.
- The reader stores:
  - `activePageIndex`
  - `visibleWindow`
  - `currentPageWordIds`
  - `selectedSentenceRange`
  - `wordModal`
  - `knownAtPageStart`
  - `knownAtPageEnd`

### Comprehension And Reanalysis

- `comprehensionPercent` is based only on known words.
- Learning words do not contribute to comprehension.
- Each media document stores:
  - `frequencyByWord`
  - `pageWordCounts`
- Whole-media comprehension can be recomputed from `frequencyByWord` and vocabulary state.
- Page comprehension and gamification deltas can be recomputed from `pageWordCounts` without reparsing tokens.

### Upload Scope

- Provide a local `Upload media` control on `/home`.
- Support plain text upload first.
- Parse uploaded text into pages, sentences, and tokens.
- Compute and persist:
  - `frequencyByWord`
  - `pageWordCounts`
  - `totalWordTokens`
- Save raw upload and parsed payload locally in IndexedDB.

### Minimal Components

- `LibraryPage`
- `ImportMediaButton`
- `MediaLibraryList`
- `MediaCard`
- `ReaderPage`
- `ReaderTopBar`
- `ReaderProgressBar`
- `ReaderViewport`
- `ReaderPageNavigation`
- `MobileReaderWindow`
- `WordActionModal`
- `SentenceTranslationTray`
- `StatsSummary`
- `VocabularySummary`

### PWA / Mobile Layout

- Use safe-area-aware wrappers for top and bottom insets.
- Keep reader containers fullscreen-safe with `svh`-based sizing.
- Avoid gesture handling that blocks ordinary reading interactions unnecessarily.

## Test Plan

### Store Tests

- vocabulary state transitions and derived counts
- library media CRUD and continue-reading derivation
- reader open/resume/modal/page-change behavior
- stats aggregation and page snapshot logic
- comprehension analysis from known-only status

### Repository Tests

- save/load/delete raw uploads and parsed documents
- preserve frequency maps and page count maps through reload

### UI Integration Tests

- library renders bundled sample media
- upload creates a local media entry
- clicking media opens the reader
- clicking a word opens the modal
- marking a word known closes the modal
- navigating pages persists progress and stats
- leaving and re-entering the reader restores the saved position
- mobile window computes previous/active/next slots correctly

## Planned Files

- `docs/plans/2026-03-30-contexto-reader-backend-design.md`
- `src/lib/content/sample-media.ts`
- `src/lib/content/text-parser.ts`
- `src/lib/analysis/comprehension.ts`
- `src/lib/media/media-repository.ts`
- `src/lib/media/media-repository.test.ts`
- `src/lib/state/user-state.ts`
- `src/lib/state/vocabulary-state.ts`
- `src/lib/state/library-state.ts`
- `src/lib/state/reader-state.ts`
- `src/lib/state/stats-state.ts`
- state and integration test files under `src/`
- library and reader route/components under `src/app/` and `src/components/`

## Acceptance Criteria

- App starts on `/home` and shows a working library.
- The library includes one bundled sample text.
- Local text upload creates readable media stored browser-locally.
- Reader state persists locally and resumes from the saved page.
- Known and learning words are tracked with Legend State.
- Comprehension uses known words only.
- Media-level frequency maps are stored for rapid reanalysis.
- Stats update when pages are completed.
- Tests and lint pass.
