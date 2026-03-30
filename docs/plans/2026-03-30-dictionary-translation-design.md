# Dictionary and Translation Design

## Date

2026-03-30

## Status

Approved

## Goals

- Provide word-level translations and definitions when users tap words in the reader.
- Support multiple target languages (zh, es, ja, ko, fr) with English as the native language.
- Own the dictionary data in Supabase with a unified schema across all languages.
- Seed from open-source dictionaries, converting each to the shared format.
- Handle CJK tokenization for languages without whitespace word boundaries.
- Use deinflection rules (inspired by Yomitan) to map surface forms to dictionary forms.
- Keep the architecture simple for MVP and easy to extend.
- AI and Google Translate serve separate product purposes (sentence translation, content generation), not as dictionary fallbacks.

## Constraints

- Supabase as the primary dictionary store.
- Single unified table schema across all languages.
- English-only as native/display language for now.
- Browser-side CJK segmentation (no server-side NLP dependency).
- Audio generated on demand via TTS, not pre-stored.

## Chosen Approach

Unified dictionary table in Supabase with deinflection-aware lookup.

### Why

- Single indexed query per lookup, no joins.
- One target format simplifies seeding scripts across dictionaries.
- The `definitions` jsonb array handles polysemy without a second table.
- Easy to evolve to a normalized headword/senses model later if needed.
- Source tagging lets us track data provenance across seeded dictionaries.
- Deinflection rules (Yomitan-inspired) let us store only dictionary forms while matching inflected surface forms at lookup time.

## Architecture

### Dictionary Entry Schema

```sql
create table dictionary_entries (
  id              uuid primary key default gen_random_uuid(),
  language        text not null,         -- zh, es, ja, ko, fr
  normalized      text not null,         -- lookup key (lowercase, language-appropriate normalization)
  pronunciation   text,                  -- pinyin / kana / romanization / IPA (tied to this specific meaning)
  pos             text,                  -- part of speech for this entry
  primary_def     text not null,         -- main English translation for this reading/meaning
  definitions     jsonb default '[]',    -- [{pos, translation}] for additional sub-meanings
  example_target  text,                  -- example sentence in target language
  example_native  text,                  -- example sentence in English
  audio_url       text,                  -- filled on first TTS request
  frequency_rank  int,                   -- word commonality (lower = more common)
  source          text not null,         -- cedict, jmdict, wiktionary, etc.
  created_at      timestamptz default now()
);

-- Multiple rows per word allowed (e.g. 了 has le and liǎo readings)
-- Lookup returns an array of entries grouped in the popup
create unique index idx_dict_lookup
  on dictionary_entries (language, normalized, pronunciation);

-- Fast lookup by word across all readings
create index idx_dict_word
  on dictionary_entries (language, normalized);
```

**Why multiple rows per word:** CJK words frequently have multiple readings with distinct
meanings (了 = le/liǎo, 行 = xíng/háng). Japanese kanji have on'yomi and kun'yomi readings.
This maps directly to how CC-CEDICT and JMdict structure their data — each reading/meaning
combination is a separate source entry, so it becomes a separate row.

### Dictionary Lookup

```
User taps word (surface form, e.g. "読めば")
  1. Apply language-specific deinflection rules to produce candidate dictionary forms
     - e.g. "読めば" → ["読む"] (conditional → dictionary form)
     - e.g. "comiendo" → ["comer"] (gerund → infinitive)
  2. Query Supabase for each candidate:
     SELECT * FROM dictionary_entries WHERE language = $1 AND normalized = ANY($2)
  3. Return the best match (longest original match, most common entry)
  4. Show popup with dictionary data
```

Supabase is the sole dictionary source. AI and Google Translate serve other product needs
(sentence translation, content generation) and are not part of the word lookup chain.

### Word Popup Data

The popup displays (when available):

| Field | Always | Source |
|-------|--------|--------|
| Primary translation | Yes | All sources |
| Part of speech | When available | Seeded dicts, AI |
| Pronunciation | When available | Seeded dicts, AI |
| Additional definitions | When available | Seeded dicts, AI |
| Example sentence (target + English) | When available | Seeded dicts, AI |
| Audio playback | On demand | TTS API, URL cached |
| Frequency rank | When available | Frequency lists |

### Tokenization Strategy

The current text parser uses regex word boundaries (`\b[\p{L}'']+\b`) which only works for whitespace-delimited languages.

**Two-layer approach** (informed by Yomitan's architecture):

**Layer 1 — Document tokenization** (at parse time, for comprehension stats and word coloring):

Uses `Intl.Segmenter` for CJK, existing regex for Latin scripts. This runs once when content is imported and produces the `ReaderToken` array.

```typescript
function tokenizeSentence(sentence: string, language: string): string[] {
  if (['zh', 'ja'].includes(language)) {
    const segmenter = new Intl.Segmenter(language, { granularity: 'word' });
    return [...segmenter.segment(sentence)]
      .filter(s => s.isWordLike)
      .map(s => s.segment);
  }
  // Latin-script languages: existing regex approach
  return Array.from(
    sentence.matchAll(/\b[\p{L}'']+\b/gu),
    (match) => match[0],
  );
}
```

**Layer 2 — Deinflection** (at lookup time, for dictionary matching):

When a user taps a token, apply language-specific deinflection rules to map the surface form to candidate dictionary forms before querying Supabase. Inspired by Yomitan's rule-based approach (no ML/morphological analyzer needed).

| Language | Deinflection | Notes |
|----------|-------------|-------|
| ja | Verb/adjective conjugation rules (godan, ichidan, irregular) | Yomitan has 88KB of rules we can reference |
| zh | None needed | Chinese words don't inflect |
| ko | Verb/adjective stem rules + particle stripping | Start simple, expand |
| es | Verb conjugation → infinitive, plural → singular | Regular patterns cover most cases |
| fr | Verb conjugation → infinitive, plural → singular | Similar to Spanish |

**Word normalization by language:**

| Language | Normalization |
|----------|---------------|
| zh | Simplified Chinese form (no case) |
| ja | Lowercase kana, preserve kanji as-is |
| ko | Lowercase if mixed script, strip particles (future) |
| es, fr | Lowercase, strip accents for lookup key (preserve accents in display) |

### Dictionary Seeding

Each source dictionary gets a conversion script that outputs rows matching the unified schema.

| Language | Source Dictionary | Notes |
|----------|-------------------|-------|
| zh | CC-CEDICT | Free, ~120k entries, includes pinyin |
| ja | JMdict/EDICT | Free, ~200k entries, includes kana readings |
| ko | KDICT (National Institute of Korean Language) | Free, Korean-English pairs |
| es | Wiktionary dump or FreeLang | Extract Spanish-English pairs |
| fr | Wiktionary dump or FreeLang | Extract French-English pairs |

Seeding pipeline per language:
1. Download/parse source dictionary file
2. Map fields to unified schema (normalized, pronunciation, pos, primary_def, definitions)
3. Bulk insert into Supabase via CSV or API
4. Tag all rows with `source` = dictionary name

### Yomitan Reference

The deinflection and lookup approach is inspired by the Yomitan browser extension (`~/repos/yomitan`). Key files to reference when building deinflection rules:

- `ext/js/language/ja/japanese-transforms.js` — comprehensive Japanese deinflection rules (88KB)
- `ext/js/language/ja/japanese-text-preprocessors.js` — text normalization (halfwidth→fullwidth, kana conversion, kanji variants)
- `ext/js/language/ko/korean-text-processors.js` — Hangul jamo decomposition
- `ext/js/language/zh/chinese.js` — pinyin normalization
- `ext/js/language/translator.js` — the core lookup algorithm (deinflect → query → match)
- `ext/js/language/language-descriptors.js` — per-language config for 40+ languages

Yomitan's key architectural insight: for CJK, the dictionary *is* the word segmenter. It tries progressively shorter substrings against the dictionary, longest match wins. We don't use this approach for document tokenization (we need upfront parsing for comprehension stats), but we adopt their deinflection-then-lookup pattern for the word popup.

### Audio (TTS)

- No pre-stored audio files.
- When user taps the audio button, call a TTS API (Google Cloud TTS covers all 5 languages).
- Cache the resulting audio URL back to the `audio_url` column.
- Consider generating a short audio blob and storing in Supabase Storage.

### Integration with Existing Reader

The reader already has:
- `ReaderToken` with `surface` and `normalized` fields
- `WordModalState` that opens on word tap
- `WordEntry` for vocabulary tracking

New additions needed:
- `DictionaryEntry` type mirroring the Supabase schema
- `useDictionaryLookup(language, surface)` hook that deinflects and queries Supabase
- Language-specific deinflection modules (starting with zh, then ja)
- Extend `WordActionModal` to display dictionary data
- Update `text-parser.ts` to accept a `language` parameter and branch tokenization
- Update `normalizeWord()` to handle CJK characters

## MVP Scope

### In scope
- Supabase `dictionary_entries` table
- Seeding scripts for at least Chinese (CC-CEDICT) as the first language
- Supabase-only dictionary lookup with deinflection
- Updated text parser with `Intl.Segmenter` for CJK
- Word popup showing translation, pronunciation, POS, definitions
- Basic deinflection rules for the first target language

### Deferred
- Audio/TTS playback
- Frequency rank data
- Full Japanese deinflection rules (large scope — reference Yomitan)
- Korean particle stripping / lemmatization
- Accent-stripping normalization for es/fr
- Offline dictionary caching on client
- User-contributed corrections to dictionary entries

## Test Plan

### Dictionary lookup
- Direct Supabase lookup returns entry for known normalized forms
- Deinflection produces correct candidate dictionary forms per language
- Lookup returns null gracefully when word is not in dictionary

### Text parser
- Latin-script tokenization unchanged for es, fr
- Chinese text segmented correctly via Intl.Segmenter
- Japanese text segmented correctly via Intl.Segmenter
- Korean text tokenized (whitespace-based for MVP)
- normalizeWord handles CJK characters without stripping them

### Seeding
- CC-CEDICT parser produces valid dictionary_entries rows
- Bulk insert handles duplicates gracefully (upsert)
- All required fields populated, optional fields nullable

### Integration
- Tapping a word in the reader triggers dictionary lookup
- Popup displays available fields from the dictionary entry
- Word can be marked known/learning from the popup (existing flow)

## Planned Files

- `docs/plans/2026-03-30-dictionary-translation-design.md` (this file)
- `src/lib/dictionary/types.ts`
- `src/lib/dictionary/lookup.ts`
- `src/lib/dictionary/lookup.test.ts`
- `src/lib/dictionary/deinflect.ts` (language-specific deinflection rules)
- `src/lib/dictionary/deinflect.test.ts`
- `src/hooks/use-dictionary-lookup.ts`
- `scripts/seed/parse-cedict.ts`
- `scripts/seed/insert-dictionary.ts`
- Updates to `src/lib/content/text-parser.ts`
- Updates to `src/lib/content/types.ts`
- Updates to `src/components/` (WordActionModal)
