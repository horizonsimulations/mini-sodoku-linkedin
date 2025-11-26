import { solveMiniSudoku } from "@/lib/sudoku";
import generatedLevels from "./generated-levels";
import type { MiniSudokuLevel, ResolvedMiniSudokuLevel } from "./types";

const rawLevels: MiniSudokuLevel[] = generatedLevels;

const withSolutions = (level: MiniSudokuLevel): ResolvedMiniSudokuLevel => {
  const solutionGrid = solveMiniSudoku(level.startGrid);
  return { ...level, solutionGrid };
};

export const levels: ResolvedMiniSudokuLevel[] = rawLevels.map(withSolutions);

export const getLevelBySlug = (slug: string) =>
  levels.find((level) => level.slug === slug);

