import { solveMiniSudoku } from "@/lib/sudoku";
import level107 from "./level107";
import type {
  MiniSudokuLevel,
  ResolvedMiniSudokuLevel,
} from "./types";

const rawLevels: MiniSudokuLevel[] = [level107];

const withSolutions = (level: MiniSudokuLevel): ResolvedMiniSudokuLevel => {
  const solutionGrid = solveMiniSudoku(level.startGrid);
  return { ...level, solutionGrid };
};

export const levels: ResolvedMiniSudokuLevel[] = rawLevels.map(withSolutions);

export const getLevelBySlug = (slug: string) =>
  levels.find((level) => level.slug === slug);

