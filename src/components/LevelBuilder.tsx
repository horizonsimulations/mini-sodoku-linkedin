"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { GRID_SIZE } from "@/lib/sudoku";
import { githubLevelsNewUrl } from "@/config/site";

type GridString = string[][];

const digits = ["1", "2", "3", "4", "5", "6"];

const createEmptyGrid = (): GridString =>
  Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => ""),
  );

const stringifyGrid = (rows: (number | null)[][], indent = 2) => {
  const pad = " ".repeat(indent);
  return `[\n${rows
    .map(
      (row) =>
        `${pad}[${row
          .map((value) => (value === null ? "null" : value))
          .join(", ")}],`,
    )
    .join("\n")}\n]`;
};

const slugifyTitle = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

const generateSlug = (value: string) => {
  const digits = value.match(/\d+/)?.[0];
  if (digits) {
    return `level${digits}`;
  }
  return slugifyTitle(value || "community-level");
};

const buildLevelCode = (
  meta: Record<string, string>,
  grid: GridString,
) => {
  const startGrid = grid.map((row) =>
    row.map((value) => (value ? Number(value) : null)),
  );

  return `import type { MiniSudokuLevel } from "./types";

const level: MiniSudokuLevel = {
  slug: "${meta.slug}",
  title: "${meta.title}",
  description: ${JSON.stringify(meta.description ?? "")},
  githubHandle: "__PR_AUTHOR__",
  publishedDate: "${meta.publishedDate}",
  gridSize: ${GRID_SIZE},
  startGrid: ${stringifyGrid(startGrid)}
};

export default level;
`;
};

export function LevelBuilder() {
  const [grid, setGrid] = useState<GridString>(() => createEmptyGrid());
  const [meta, setMeta] = useState({
    slug: "level107",
    title: "Level 107",
    publishedDate: new Date().toISOString().slice(0, 10),
    description: "Describe the inspiration or difficulty (optional).",
  });

  const handleGridChange = (row: number, col: number, value: string) => {
    if (!digits.includes(value) && value !== "") {
      return;
    }

    setGrid((prev) => {
      const clone = prev.map((line) => [...line]);
      clone[row][col] = value;
      return clone;
    });
  };

  const resetBuilder = () => {
    setGrid(createEmptyGrid());
  };

  const codeOutput = useMemo(
    () => buildLevelCode(meta, grid),
    [meta, grid],
  );

  const editorUrl = `${githubLevelsNewUrl}?filename=${encodeURIComponent(
    `${meta.slug || "community-level"}.ts`,
  )}`;

  return (
    <section className="space-y-6">
      <header className="space-y-2 rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-500">
          Level Builder
        </p>
        <h1 className="text-2xl font-semibold text-slate-900">
          Generate a new community Mini Sudoku
        </h1>
        <p className="text-sm text-slate-600">
          Enter only the numbers LinkedIn shows in the puzzle (the grey givens)
          and leave everything else blank. The solver inside
          the app automatically computes the final solution and hints for
          players, so you don&apos;t need to include them manually. Once
          you&apos;re happy with the output, create a .ts file inside{" "}
          <code className="font-mono text-xs">src/levels</code> and paste the
          generated code before opening a pull request.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Level title
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                value={meta.title}
                onChange={(event) => {
                  const nextTitle = event.target.value;
                  setMeta((prev) => ({
                    ...prev,
                    title: nextTitle,
                    slug: generateSlug(nextTitle),
                  }));
                }}
              />
            </label>
            <div className="text-sm font-medium text-slate-700">
              Slug / file name (auto-generated, format: level###)
              <div className="mt-1 w-full rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-600">
                {meta.slug || "community-level"}.ts
              </div>
              <p className="text-xs font-normal text-slate-500">
                Update the title to regenerate the slug. GitHub will populate
                your username automatically during the PR.
              </p>
            </div>
            <label className="text-sm font-medium text-slate-700">
              Publish date
              <input
                type="date"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                value={meta.publishedDate}
                onChange={(event) =>
                  setMeta((prev) => ({
                    ...prev,
                    publishedDate: event.target.value,
                  }))
                }
              />
            </label>
          </div>

          <label className="text-sm font-medium text-slate-700">
            Description
            <textarea
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              rows={2}
              value={meta.description}
              onChange={(event) =>
                setMeta((prev) => ({ ...prev, description: event.target.value }))
              }
            />
          </label>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-800">
                Enter LinkedIn&apos;s givens (leave other cells blank)
              </p>
              <button
                type="button"
                onClick={resetBuilder}
                className="text-sm font-medium text-rose-600 underline-offset-4 hover:underline"
              >
                Reset builder
              </button>
            </div>
            <div
              className="grid gap-1 rounded-2xl border border-slate-200 bg-slate-100 p-2"
              style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
            >
              {grid.map((row, rowIdx) =>
                row.map((value, colIdx) => {
                  return (
                    <input
                      key={`${rowIdx}-${colIdx}`}
                      inputMode="numeric"
                      pattern="[1-6]*"
                      maxLength={1}
                      value={value}
                      onChange={(event) =>
                        handleGridChange(rowIdx, colIdx, event.target.value)
                      }
                      className={clsx(
                        "aspect-square rounded-xl border bg-white text-center text-xl font-semibold text-slate-900 outline-none transition focus:ring-2 focus:ring-indigo-400",
                        value && "bg-indigo-50 text-indigo-700 border-indigo-200",
                      )}
                      placeholder="·"
                    />
                  );
                }),
              )}
            </div>
          </div>

        </div>

        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-900/95 p-6 text-white">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-slate-400">
              Preview
            </p>
            <p className="text-lg font-semibold">Generated level file</p>
          </div>
          <textarea
            readOnly
            value={codeOutput}
            className="min-h-[480px] flex-1 rounded-2xl bg-slate-900/60 p-4 font-mono text-xs text-emerald-100"
          />
          <a
            href={editorUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400"
          >
            Open GitHub web editor
          </a>
          <p className="text-xs text-slate-400">
            File naming convention:{" "}
            <code className="text-emerald-200">
              src/levels/{meta.slug || "your-level"}.ts
            </code>
            . Paste the generated code, commit the file, and GitHub will tag your
            username during the pull request.
          </p>
        </div>
      </div>
    </section>
  );
}

