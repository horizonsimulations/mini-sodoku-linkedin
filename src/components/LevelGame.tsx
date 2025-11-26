"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";

import type { ResolvedMiniSudokuLevel } from "@/levels/types";
import { levels as defaultLevels } from "@/levels";
import {
  GRID_SIZE,
  PlayableGrid,
  cloneGrid,
  collectMismatches,
  createPlayableGrid,
  formatHintMessage,
  isSolved,
} from "@/lib/sudoku";
import {
  hasCookieConsent,
  markLevelComplete,
  readCompletionProgress,
} from "@/lib/cookie-utils";

interface LevelGameProps {
  initialSlug?: string;
  allLevels?: ResolvedMiniSudokuLevel[];
}

const digits = ["1", "2", "3", "4", "5", "6"];

export function LevelGame({
  initialSlug,
  allLevels = defaultLevels,
}: LevelGameProps) {
  const fallbackSlug = allLevels[0]?.slug ?? "";
  const sanitizedInitialSlug =
    initialSlug && allLevels.some((level) => level.slug === initialSlug)
      ? initialSlug
      : fallbackSlug;

  const activeLevel = useMemo(
    () => allLevels.find((level) => level.slug === sanitizedInitialSlug),
    [sanitizedInitialSlug, allLevels],
  );

  const [grid, setGrid] = useState<PlayableGrid>(() =>
    activeLevel ? createPlayableGrid(activeLevel) : [],
  );
  const [highlightedCell, setHighlightedCell] = useState<[number, number] | null>(
    null,
  );
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [hasConsent, setHasConsent] = useState(() => hasCookieConsent());
  const [completedLevels, setCompletedLevels] = useState<
    Record<string, "solved">
  >(() => readCompletionProgress());
  const [flashingRows, setFlashingRows] = useState<number[]>([]);
  const [flashingCols, setFlashingCols] = useState<number[]>([]);
  const [flashingBoxes, setFlashingBoxes] = useState<number[]>([]);

  const completedRowsRef = useRef<Set<number>>(new Set());
  const completedColsRef = useRef<Set<number>>(new Set());
  const completedBoxesRef = useRef<Set<number>>(new Set());

  const givenMask = useMemo(
    () =>
      activeLevel
        ? activeLevel.startGrid.map((row) =>
            row.map((value) => value !== null && value !== undefined),
          )
        : [],
    [activeLevel],
  );

  const deriveSubgrid = (size: number) => {
    if (size === 6) {
      return { subgridRows: 2, subgridCols: 3 };
    }
    const root = Math.sqrt(size);
    return { subgridRows: root, subgridCols: root };
  };

  const { subgridRows, subgridCols } = deriveSubgrid(
    activeLevel?.gridSize ?? GRID_SIZE,
  );

  const totalBoxes = useMemo(
    () => subgridRows * subgridCols,
    [subgridRows, subgridCols],
  );

  const getBoxIndex = useCallback(
    (row: number, col: number) =>
      Math.floor(row / subgridRows) * subgridCols + Math.floor(col / subgridCols),
    [subgridRows, subgridCols],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }
    const handler = () => {
      setHasConsent(true);
      setCompletedLevels(readCompletionProgress());
    };

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

  const solved = activeLevel ? isSolved(grid, activeLevel) : false;
  const contributorHandle =
    activeLevel?.githubHandle && activeLevel.githubHandle !== "__PR_AUTHOR__"
      ? activeLevel.githubHandle
      : null;

  const persistCompletion = () => {
    if (!activeLevel || !hasConsent) return;
    setCompletedLevels((prev) => {
      if (prev[activeLevel.slug] === "solved") {
        return prev;
      }
      markLevelComplete(activeLevel.slug);
      return { ...prev, [activeLevel.slug]: "solved" };
    });
  };

  const triggerFlash = useCallback((type: "row" | "col" | "box", index: number) => {
    const setter =
      type === "row"
        ? setFlashingRows
        : type === "col"
          ? setFlashingCols
          : setFlashingBoxes;

    setter((prev) => (prev.includes(index) ? prev : [...prev, index]));
    if (typeof window !== "undefined") {
      window.setTimeout(() => {
        setter((prev) => prev.filter((value) => value !== index));
      }, 1000);
    }
  }, []);

  const boardEvaluation = useMemo(() => {
    if (!activeLevel) return null;

    const mask = givenMask as boolean[][];
    const gridSize = activeLevel.gridSize;
    const newInvalid = new Set<string>();
    const newConflicts = new Set<string>();
    const rowStatus = Array(gridSize).fill(true);
    const colStatus = Array(gridSize).fill(true);
    const boxStatus = Array(totalBoxes).fill(true);

    for (let row = 0; row < gridSize; row += 1) {
      for (let col = 0; col < gridSize; col += 1) {
        const value = grid[row][col];
        const solutionValue = activeLevel.solutionGrid[row][col];
        const boxIndex = getBoxIndex(row, col);

        if (!value) {
          rowStatus[row] = false;
          colStatus[col] = false;
          boxStatus[boxIndex] = false;
          continue;
        }

        if (Number(value) !== solutionValue) {
          rowStatus[row] = false;
          colStatus[col] = false;
          boxStatus[boxIndex] = false;
        }

        if (mask[row][col]) {
          continue; // given cells can't conflict with themselves
        }

        const numericValue = Number(value);
        let hasConflict = false;

        for (let i = 0; i < gridSize; i += 1) {
          if (mask[row][i] && activeLevel.startGrid[row][i] === numericValue) {
            newConflicts.add(`${row}-${i}`);
            hasConflict = true;
          }
          if (mask[i][col] && activeLevel.startGrid[i][col] === numericValue) {
            newConflicts.add(`${i}-${col}`);
            hasConflict = true;
          }
        }

        const boxRowStart = Math.floor(row / subgridRows) * subgridRows;
        const boxColStart = Math.floor(col / subgridCols) * subgridCols;
        for (let r = 0; r < subgridRows; r += 1) {
          for (let c = 0; c < subgridCols; c += 1) {
            const rr = boxRowStart + r;
            const cc = boxColStart + c;
            if (
              mask[rr][cc] &&
              activeLevel.startGrid[rr][cc] === numericValue
            ) {
              newConflicts.add(`${rr}-${cc}`);
              hasConflict = true;
            }
          }
        }

        if (hasConflict) {
          newInvalid.add(`${row}-${col}`);
        }
      }
    }

    return {
      invalidCells: newInvalid,
      conflictGivenCells: newConflicts,
      rowStatus,
      colStatus,
      boxStatus,
    };
  }, [
    activeLevel,
    grid,
    givenMask,
    getBoxIndex,
    totalBoxes,
    subgridRows,
    subgridCols,
  ]);

  const emptySetRef = useMemo(() => new Set<string>(), []);
  const invalidCells = boardEvaluation?.invalidCells ?? emptySetRef;
  const conflictGivenCells =
    boardEvaluation?.conflictGivenCells ?? emptySetRef;

  useEffect(() => {
    if (!activeLevel || !boardEvaluation) return;

    boardEvaluation.rowStatus.forEach((complete, idx) => {
      const completed = completedRowsRef.current;
      if (complete && !completed.has(idx)) {
        completed.add(idx);
        triggerFlash("row", idx);
      } else if (!complete && completed.has(idx)) {
        completed.delete(idx);
      }
    });

    boardEvaluation.colStatus.forEach((complete, idx) => {
      const completed = completedColsRef.current;
      if (complete && !completed.has(idx)) {
        completed.add(idx);
        triggerFlash("col", idx);
      } else if (!complete && completed.has(idx)) {
        completed.delete(idx);
      }
    });

    boardEvaluation.boxStatus.forEach((complete, idx) => {
      const completed = completedBoxesRef.current;
      if (complete && !completed.has(idx)) {
        completed.add(idx);
        triggerFlash("box", idx);
      } else if (!complete && completed.has(idx)) {
        completed.delete(idx);
      }
    });
  }, [
    activeLevel,
    boardEvaluation,
    triggerFlash,
    subgridRows,
    subgridCols,
  ]);

  if (!activeLevel) {
    return (
      <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-lg font-semibold text-zinc-900">
          No levels have been published yet.
        </p>
        <p className="text-sm text-zinc-600">
          Add your first level via the{" "}
          <Link className="text-indigo-600 underline" href="/level-builder">
            Level Builder
          </Link>{" "}
          and re-run the dev server.
        </p>
      </div>
    );
  }

  const resolvedGivenMask = givenMask as boolean[][];

  const handleInput = (row: number, col: number, nextValue: string) => {
    if (resolvedGivenMask[row][col]) {
      return;
    }

    const filtered =
      nextValue.length === 0
        ? ""
        : digits.includes(nextValue.at(-1) ?? "")
          ? nextValue.at(-1) ?? ""
          : grid[row][col];

    setGrid((prev) => {
      const draft = cloneGrid(prev);
      draft[row][col] = filtered;
      if (isSolved(draft, activeLevel)) {
        persistCompletion();
      }
      return draft;
    });
  };

  const handleHint = () => {
    if (!activeLevel) {
      return;
    }

    const mismatches = collectMismatches(grid, activeLevel);
    const preparedHint =
      mismatches.length > 0
        ? mismatches[Math.floor(Math.random() * mismatches.length)]
        : null;

    if (!preparedHint) {
      setHintMessage("All cells are already correct — great job!");
      setHighlightedCell(null);
      return;
    }

    const value = activeLevel.solutionGrid[preparedHint.row][preparedHint.col];
    setHighlightedCell([preparedHint.row, preparedHint.col]);
    setHintMessage(
      formatHintMessage(
        preparedHint.row,
        preparedHint.col,
        value,
        "Random hint based on the solved board.",
      ),
    );
  };

  const handleReset = () => {
    if (!activeLevel) return;
    setGrid(createPlayableGrid(activeLevel));
    setHighlightedCell(null);
    setHintMessage(null);
  };

  const solvedLabel =
    completedLevels[activeLevel.slug] === "solved"
      ? "Marked as completed on this device"
      : "In progress";

  return (
    <section className="w-full space-y-6">
      <header className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Current level
            </p>
            <h1 className="text-2xl font-semibold text-zinc-900">
              {activeLevel.title}
            </h1>
            <p className="text-sm text-zinc-500">{solvedLabel}</p>
          </div>
          <Link
            href="/level-builder"
            className="rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100"
          >
            Open Level Builder
          </Link>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-zinc-600">
          <span>
            Published {new Date(activeLevel.publishedDate).toLocaleDateString()}
          </span>
          {contributorHandle ? (
            <a
              href={`https://github.com/${contributorHandle}`}
              target="_blank"
              rel="noreferrer"
              className="text-indigo-600 underline"
            >
              Contributed by @{contributorHandle}
            </a>
          ) : (
            <span>Contributor attribution pending PR merge.</span>
          )}
          {activeLevel.description ? (
            <span>{activeLevel.description}</span>
          ) : null}
        </div>

      </header>

      <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-900/5 p-6">
          <div
            className="grid gap-px rounded-2xl bg-slate-700 p-px"
            style={{ gridTemplateColumns: `repeat(${activeLevel.gridSize}, minmax(0, 1fr))` }}
          >
            {grid.map((row, rowIdx) =>
              row.map((value, colIdx) => {
                const isGiven = resolvedGivenMask[rowIdx][colIdx];
                const cellKey = `${rowIdx}-${colIdx}`;
                const isInvalid = invalidCells.has(cellKey);
                const isConflictGiven = conflictGivenCells.has(cellKey);
                const isHighlighted =
                  highlightedCell?.[0] === rowIdx &&
                  highlightedCell?.[1] === colIdx;
                const boxIndex = getBoxIndex(rowIdx, colIdx);
                const shouldFlash =
                  flashingRows.includes(rowIdx) ||
                  flashingCols.includes(colIdx) ||
                  flashingBoxes.includes(boxIndex);

                return (
                  <div
                    key={`${rowIdx}-${colIdx}`}
                    className={clsx(
                      "relative aspect-square bg-slate-900/95 p-px transition-transform",
                      rowIdx % 2 === 0 &&
                        rowIdx !== 0 &&
                        "border-t-4 border-slate-700",
                      colIdx % 3 === 0 &&
                        colIdx !== 0 &&
                        "border-l-4 border-slate-700",
                      isHighlighted && "ring-2 ring-yellow-300 ring-offset-2",
                      isConflictGiven &&
                        "outline outline-2 outline-offset-[3px] outline-rose-500",
                      shouldFlash && "flash-success",
                    )}
                  >
                    <input
                      inputMode="numeric"
                      pattern="[1-6]*"
                      maxLength={1}
                      value={value}
                      disabled={isGiven}
                      onChange={(event) =>
                        handleInput(rowIdx, colIdx, event.target.value)
                      }
                      className={clsx(
                        "h-full w-full rounded-xl text-center text-2xl font-semibold tracking-wider text-white outline-none transition",
                        isGiven
                          ? clsx(
                              "bg-slate-800 text-slate-200",
                              isConflictGiven && "bg-rose-900/40",
                            )
                          : clsx(
                              "bg-slate-900 text-white focus:bg-slate-800 focus:ring-2 focus:ring-indigo-400",
                              isInvalid &&
                                "bg-rose-600 text-white cell-error focus:ring-rose-400",
                            ),
                      )}
                      aria-label={`Row ${rowIdx + 1} column ${colIdx + 1}`}
                    />
                  </div>
                );
              }),
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleHint}
              className="flex-1 rounded-full bg-amber-500 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-amber-400"
            >
              Hint
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            >
              Reset
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-800">
              {solved ? "Puzzle complete — nice work! 🎉" : "Need a nudge?"}
            </p>
            <p className="text-sm text-slate-600">
              {hintMessage ??
                "Hints reveal a cell + reasoning. Enter the highlighted value yourself to keep practicing."}
            </p>
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-zinc-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-zinc-900">How it works</h2>
          <ol className="space-y-3 text-sm text-zinc-600">
            <li>• Grey cells are the original givens from LinkedIn.</li>
            <li>• Type numbers 1-6 into the open cells to solve.</li>
            <li>• Use as many hints as you need—no cooldowns!</li>
            <li>
              • Want to publish tomorrow&apos;s puzzle? Build it via the Level
              Builder and open a PR with the generated level file.
            </li>
          </ol>
          <div className="rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-700">
            <p className="font-semibold">Community shout-outs</p>
            <p>
              Every level links directly to the GitHub user that submitted it so
              we can properly credit their work.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

