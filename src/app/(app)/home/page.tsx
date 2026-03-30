"use client";

import { startTransition, useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useSelector } from "@legendapp/state/react";

import { LibraryMediaCard } from "@/components/library-media-card";
import { SafeAreaShell } from "@/components/safe-area-shell";
import {
  ensureBundledSampleMedia,
  importTextMedia,
} from "@/lib/media/media-service";
import { getLibraryMedia } from "@/lib/state/library-state";

export default function HomePage() {
  const libraryMedia = useSelector(() => getLibraryMedia());
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    void ensureBundledSampleMedia();
  }, []);

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      await importTextMedia(file);
      startTransition(() => {
        setIsUploading(false);
      });
    } catch (error) {
      setIsUploading(false);
      setUploadError(
        error instanceof Error ? error.message : "Upload failed.",
      );
    } finally {
      event.target.value = "";
    }
  }

  return (
    <SafeAreaShell className="px-4 py-6 md:px-6">
      <div className="flex flex-col gap-6">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">Library</p>
          <h1 className="text-3xl font-semibold text-white">Contexto Library</h1>
          <p className="text-sm text-slate-300">
            Open local media, continue where you left off, and import plain-text
            readers that stay in this browser for now.
          </p>
        </header>

        <section className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/80 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <label
              htmlFor="upload-input"
              className="cursor-pointer rounded-full bg-emerald-400 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-950 transition hover:bg-emerald-500"
            >
              {isUploading ? "Uploading..." : "Upload media"}
            </label>
            <input
              id="upload-input"
              type="file"
              accept=".txt,text/plain"
              className="hidden"
              aria-label="Upload media"
              onChange={(event) => {
                void handleUpload(event);
              }}
            />
            <p className="text-xs text-slate-400">
              Supported now: plain-text files parsed into local paged readers.
            </p>
          </div>
          {uploadError ? (
            <p className="text-sm text-rose-300">{uploadError}</p>
          ) : (
            <p className="text-sm text-slate-300/80">
              Bundled sample content is always available, and uploads appear in
              the same library immediately after import.
            </p>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Readable media</h2>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Local first</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {libraryMedia.map((media) => (
              <LibraryMediaCard
                key={media.id}
                continuePageIndex={media.continuePageIndex}
                mediaId={media.id}
                progressPercent={media.progressPercent}
                sourceType={media.sourceType}
                title={media.title}
              />
            ))}
          </div>
          {libraryMedia.length === 0 ? (
            <p className="text-sm text-slate-400">Loading local media…</p>
          ) : null}
        </section>
      </div>
    </SafeAreaShell>
  );
}
