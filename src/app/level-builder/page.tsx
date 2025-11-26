import { LevelBuilder } from "@/components/LevelBuilder";

export const metadata = {
  title: "Level Builder · Mini Sudoku Archive",
  description:
    "Design new 6×6 LinkedIn-style Mini Sudoku puzzles and export TypeScript level files for PRs.",
};

export default function LevelBuilderPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 bg-slate-50 px-4 py-10 sm:px-8 lg:px-12">
      <LevelBuilder />
    </main>
  );
}

