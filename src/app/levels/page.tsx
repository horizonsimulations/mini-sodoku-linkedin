import { LevelGrid } from "@/components/LevelGrid";
import { levels } from "@/levels";

export const metadata = {
  title: "Official Levels · Mini Sudoku Archive",
  description:
    "Browse the full archive of LinkedIn-style Mini Sudoku puzzles and jump into any level instantly.",
};

export default function LevelsPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 bg-slate-50 px-4 py-10 sm:px-8 lg:px-12">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Official Levels
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">
          Pick a Mini Sudoku to replay.
        </h1>
        <p className="text-sm text-slate-600">
          The grid below lists every community recreation of LinkedIn’s Mini
          Sudoku. Tap any tile to open the dedicated play page for that level.
        </p>
      </header>

      <LevelGrid levels={levels} />
    </main>
  );
}

