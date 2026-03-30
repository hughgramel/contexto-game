"use client";

import { use, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { observer } from "@legendapp/state/react";

import {
  appState$,
  addWordsRead,
  addWordsKnown,
  setReadingProgress,
  incrementReadingsDone,
} from "@/lib/state/app-state";
import { clearSelection, clearWordTranslation } from "@/lib/state/reader-state";
import { getArticleById } from "@/lib/mock-data";
import { tokenizeText } from "@/lib/tokenize";
import { usePanelState } from "@/hooks/use-panel-state";
import { PageWords } from "@/components/reader/reader-transcript";
import { WordPopup } from "@/components/reader/word-popup";
import { SlotCounter } from "@/components/slot-counter";

type ReaderPageProps = {
  params: Promise<{ id: string }>;
};

const ReaderPage = observer(function ReaderPage({ params }: ReaderPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const article = getArticleById(id);

  const progressData = appState$.readingProgress.get();
  const currentProgress = progressData[id];
  const currentPage = currentProgress?.currentPage ?? 0;
  const totalPages = article?.pages.length ?? 1;
  const pct = totalPages <= 1 ? 100 : Math.round((currentPage / (totalPages - 1)) * 100);

  const stats = appState$.stats.get();

  // Tokenize each page into Word arrays
  const pageWords = useMemo(
    () => (article ? article.pages.map((text) => tokenizeText(text)) : []),
    [article],
  );

  // Flat word array for the panel state (uses first visible page's words for sentence lookup)
  // Each page has independent word arrays, so panel state uses the current page's words
  const currentPageWords = pageWords[currentPage] ?? [];

  const {
    popupMode,
    popupAnchor,
    wordTranslationWord,
    translationText,
    alreadySaved,
    handleSave,
    handleClose,
  } = usePanelState(currentPageWords, id);

  const scrollRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const visitedPages = useRef(new Set<number>([0]));

  // Scroll to saved page on mount
  useEffect(() => {
    const savedPage = currentPage;
    if (savedPage > 0 && pageRefs.current[savedPage]) {
      pageRefs.current[savedPage]?.scrollIntoView();
    }
    for (let i = 0; i <= savedPage; i++) {
      visitedPages.current.add(i);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // IntersectionObserver to detect which page is snapped into view
  useEffect(() => {
    if (!article) return;
    const container = scrollRef.current;
    if (!container) return;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const pageIndex = Number(entry.target.getAttribute("data-page"));
          if (isNaN(pageIndex)) continue;

          setReadingProgress(id, pageIndex, totalPages);

          if (!visitedPages.current.has(pageIndex)) {
            visitedPages.current.add(pageIndex);
            const wordsPerPage = Math.round(article.wordsCount / totalPages);
            addWordsRead(wordsPerPage);
            addWordsKnown(Math.round(wordsPerPage * 0.3));
          }
        }
      },
      { root: container, threshold: 0.4 },
    );

    pageRefs.current.forEach((el) => {
      if (el) obs.observe(el);
    });

    return () => obs.disconnect();
  }, [id, article, totalPages]);

  // Dismiss popup on significant scroll (page snap), ignore micro-scrolls from clicks
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    let lastScrollTop = container.scrollTop;
    const onScroll = () => {
      const delta = Math.abs(container.scrollTop - lastScrollTop);
      if (delta > 60) {
        clearSelection();
        clearWordTranslation();
        lastScrollTop = container.scrollTop;
      }
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  const handleFinish = useCallback(() => {
    incrementReadingsDone();
    clearSelection();
    clearWordTranslation();
    router.push(`/read/${id}/complete`);
  }, [router, id]);

  if (!article) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Article not found.</p>
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] flex-col bg-white">
      {/* Sticky header: progress bar + stats */}
      <div className="shrink-0 border-b border-black/10 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              clearSelection();
              clearWordTranslation();
              router.push("/home");
            }}
            className="text-black/40"
          >
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div className="flex-1">
            <div className="h-2 rounded-full bg-black/10 overflow-hidden">
              <div
                className="h-2 rounded-full bg-black transition-all duration-500 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <span className="shrink-0 font-mono text-xs text-black/40">
            {currentPage + 1}/{totalPages}
          </span>
        </div>

        {/* Stats row with slot-machine counters */}
        <div className="mt-2 flex items-center gap-4">
          <SlotCounter value={stats.wordsRead} label="Read" />
          <div className="h-3 w-px bg-black/10" />
          <SlotCounter value={stats.wordsKnown} label="Known" />
        </div>
      </div>

      {/* TikTok-style scroll-snap container — all pages pre-rendered */}
      <div
        ref={scrollRef}
        className="hide-scrollbar flex-1 min-h-0 overflow-y-scroll snap-y snap-mandatory overscroll-y-contain"
      >
        {article.pages.map((_, i) => (
          <div
            key={i}
            ref={(el) => { pageRefs.current[i] = el; }}
            data-page={i}
            className="min-h-full snap-start snap-always flex flex-col px-5 py-6 box-border"
          >
            {i === 0 && (
              <div className="mb-4 shrink-0">
                <h1 className="text-3xl font-bold leading-tight">{article.title}</h1>
                <p className="mt-1.5 text-base text-black/50">{article.subtitle}</p>
              </div>
            )}

            {/* Word spans instead of plain text */}
            <div
              className="flex-1 text-xl leading-8"
              style={{ touchAction: "none" }}
              onClick={() => {
                // Tapping empty space dismisses popup
                clearSelection();
                clearWordTranslation();
              }}
            >
              <PageWords
                words={pageWords[i]}
                keyPrefix={`${id}-p${i}`}
              />
            </div>

            {/* Bottom hint / finish */}
            <div className="mt-auto pt-6 shrink-0">
              {i < totalPages - 1 ? (
                <div className="flex flex-col items-center gap-1 text-black/20 pb-2">
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="18 15 12 9 6 15" />
                  </svg>
                  <span className="text-[11px]">Scroll to continue</span>
                </div>
              ) : (
                <button
                  onClick={handleFinish}
                  className="w-full bg-black py-3.5 text-sm font-semibold text-white rounded-lg"
                >
                  Finish Reading
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Floating popup near tapped word */}
      {popupMode && popupAnchor && (
        <WordPopup
          mode={popupMode}
          anchor={popupAnchor}
          word={wordTranslationWord}
          translation={translationText}
          alreadySaved={alreadySaved}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
    </div>
  );
});

export default ReaderPage;
