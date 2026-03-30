"use client";

import { startTransition, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSelector } from "@legendapp/state/react";

import { SafeAreaShell } from "@/components/safe-area-shell";
import { SentenceTranslationTray } from "@/components/sentence-translation-tray";
import { WordActionModal } from "@/components/word-action-modal";
import { loadReaderDocument } from "@/lib/media/media-service";
import type { ReaderDocument, ReaderSentence } from "@/lib/content/types";
import {
  closeReader,
  closeWordModal,
  getActivePage,
  getReaderProgress,
  getVisibleWindowForMedia,
  goToNextPage,
  goToPreviousPage,
  markActiveWordKnown,
  openReaderDocument,
  openWordModalForToken,
  readerUiState$,
  setSentenceSelection,
} from "@/lib/state/reader-state";
import { getWordStatus, setWordLearning } from "@/lib/state/vocabulary-state";
import { appState$ } from "@/lib/state/app-state";

function getHighlightClass(status: ReturnType<typeof getWordStatus>): string {
  if (status === "known") {
    return "bg-transparent text-slate-100";
  }

  if (status === "learning") {
    return "bg-amber-500/20 text-amber-300";
  }

  return "bg-rose-500/20 text-rose-200";
}

function sentenceButtonLabel(index: number): string {
  return `Translate sentence ${index + 1}`;
}

export default function ReaderPage() {
  const params = useParams<{ mediaId: string }>();
  const mediaId = params?.mediaId ?? "";
  const lang = appState$.language.get();
  const [document, setDocument] = useState<ReaderDocument | null>(null);
  const [error, setError] = useState<string | null>(null);

  const readerUi = useSelector(() => readerUiState$.get());
  const progress = useSelector(() =>
    mediaId ? getReaderProgress(mediaId) : undefined,
  );

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      const loaded = await loadReaderDocument(mediaId);

      if (!isMounted) {
        return;
      }

      if (!loaded) {
        setError("Media not found.");
        return;
      }

      setError(null);
      startTransition(() => {
        setDocument(loaded);
      });
      openReaderDocument(loaded);
    })();

    return () => {
      isMounted = false;
      closeReader();
    };
  }, [mediaId]);

  const activePage = document ? getActivePage(document) : undefined;
  const visibleWindow = document
    ? getVisibleWindowForMedia(document)
    : { previousPageIndex: null, activePageIndex: 0, nextPageIndex: null };

  function handleSentenceSelection(sentence: ReaderSentence) {
    if (!document || sentence.tokenIds.length === 0) {
      return;
    }

    setSentenceSelection(
      document,
      sentence.tokenIds[0]!,
      sentence.tokenIds[sentence.tokenIds.length - 1]!,
    );
  }

  if (error) {
    return (
      <SafeAreaShell className="px-4 py-6 md:px-6">
        <p className="text-sm text-rose-300">{error}</p>
      </SafeAreaShell>
    );
  }

  if (!document || !activePage) {
    return (
      <SafeAreaShell className="px-4 py-6 md:px-6">
        <p className="text-sm text-slate-300">Loading reader…</p>
      </SafeAreaShell>
    );
  }

  return (
    <SafeAreaShell className="px-4 py-6 md:px-6">
      <div className="mx-auto flex max-w-4xl flex-1 flex-col gap-6">
        <header className="space-y-2">
          <div className="flex items-center justify-between">
            <Link
              href="/home"
              className="text-xs uppercase tracking-[0.4em] text-slate-400 transition hover:text-white"
            >
              ← Library
            </Link>
            <span className="text-xs text-slate-400">Media ID: {mediaId}</span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">Reader</p>
            <h1 className="text-3xl font-semibold text-white">{document.title}</h1>
            <p className="text-sm text-slate-400">
              Page {readerUi.activePageIndex + 1} of {document.pages.length} ·{" "}
              {progress?.progressPercent ?? 0}% complete
            </p>
          </div>
        </header>

        <section className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Page window</p>
          <div className="mt-3 flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.35em] text-slate-500">
            <span>
              Previous:{" "}
              {visibleWindow.previousPageIndex === null
                ? "—"
                : `Page ${visibleWindow.previousPageIndex + 1}`}
            </span>
            <span>Active: Page {visibleWindow.activePageIndex + 1}</span>
            <span>
              Next:{" "}
              {visibleWindow.nextPageIndex === null
                ? "—"
                : `Page ${visibleWindow.nextPageIndex + 1}`}
            </span>
          </div>
        </section>

        <section className="relative flex-1 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-6">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-white transition disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() => {
                goToPreviousPage(document);
              }}
              disabled={readerUi.activePageIndex === 0}
            >
              Previous page
            </button>
            <button
              type="button"
              className="rounded-full border border-emerald-400 bg-emerald-400/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-emerald-300 transition hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() => {
                goToNextPage(document);
              }}
              disabled={readerUi.activePageIndex === document.pages.length - 1}
            >
              Next page
            </button>
            <p className="ml-auto rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.35em] text-slate-400">
              Progress {progress?.progressPercent ?? 0}%
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex flex-wrap gap-3 text-sm text-slate-400">
              {activePage.sentences.map((sentence, index) => (
                <button
                  type="button"
                  key={sentence.id}
                  onClick={() => {
                    handleSentenceSelection(sentence);
                  }}
                  className="rounded-full border border-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-400 transition hover:border-slate-200"
                >
                  {sentenceButtonLabel(index)}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 text-base leading-relaxed text-slate-100">
              {activePage.tokens.map((token) => {
                const status = getWordStatus(lang, token.normalized);

                return (
                  <button
                    type="button"
                    key={token.id}
                    className={`cursor-pointer rounded-full px-2 py-1 text-sm font-semibold ${getHighlightClass(
                      status,
                    )}`}
                    onClick={() => {
                      openWordModalForToken(document, token.id);
                    }}
                  >
                    {token.surface}
                  </button>
                );
              })}
            </div>
          </div>

          <SentenceTranslationTray
            sentence={readerUi.selectedSentence?.text ?? null}
            translation={
              readerUi.selectedSentence
                ? `Selected text ready for future translation: ${readerUi.selectedSentence.text}`
                : null
            }
          />
        </section>
      </div>

      <WordActionModal
        token={readerUi.wordModal?.surface ?? null}
        onClose={closeWordModal}
        onMarkLearning={() => {
          const modal = readerUi.wordModal;
          if (!modal) {
            return;
          }

          setWordLearning(lang, modal.normalized, modal.surface);
          closeWordModal();
        }}
        onMarkKnown={() => {
          markActiveWordKnown(document);
        }}
      />
    </SafeAreaShell>
  );
}
