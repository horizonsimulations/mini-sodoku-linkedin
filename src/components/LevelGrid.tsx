"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";

import type { ResolvedMiniSudokuLevel } from "@/levels/types";
import { levels as defaultLevels } from "@/levels";
import { readCompletionProgress } from "@/lib/cookie-utils";

interface LevelGridProps {
  levels?: ResolvedMiniSudokuLevel[];
  selectedSlug?: string;
}

export function LevelGrid({
  levels = defaultLevels,
  selectedSlug,
}: LevelGridProps) {
  const [progress, setProgress] = useState<Record<string, "solved">>(() =>
    readCompletionProgress(),
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }
    const handler = () => setProgress(readCompletionProgress());
    window.addEventListener(
      "msl-cookie-consent-granted",
      handler as EventListener,
    );
    return () =>
      window.removeEventListener(
        "msl-cookie-consent-granted",
        handler as EventListener,
      );
  }, []);

  if (!levels.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
        No official levels yet — check back after the first submission.
      </div>
    );
  }

  const tileLabel = (level: ResolvedMiniSudokuLevel, index: number) =>
    level.title.match(/\d+/)?.[0] ?? String(index + 1);

  return (
    <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
            Official Archive
          </p>
          <h2 className="text-xl font-semibold text-slate-900">
            Pick any LinkedIn Mini Sudoku and we’ll load it below.
          </h2>
          <p className="text-xs text-slate-500">
            New levels appear at the end of the grid. Keep your streak alive by
            replaying any day you missed.
          </p>
        </div>
        <span className="text-xs text-slate-500">
          {levels.length} levels · tap a tile to play
        </span>
      </div>
      <div className="grid grid-cols-5 gap-1 sm:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12">
        {levels.map((level, index) => {
          const solved = progress[level.slug] === "solved";
          const isActive = level.slug === selectedSlug;
          const label = tileLabel(level, index);
          return (
            <Link
              key={level.slug}
              href={`/levels/${level.slug}`}
              title={level.title}
              className={clsx(
                "relative flex aspect-square items-center justify-center rounded-lg border text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500",
                isActive
                  ? "border-indigo-500 bg-indigo-100 text-indigo-800"
                  : solved
                    ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
              )}
            >
              {label}
              {solved ? (
                <span className="absolute bottom-1 right-1 text-[10px] text-emerald-600">
                  ✓
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

