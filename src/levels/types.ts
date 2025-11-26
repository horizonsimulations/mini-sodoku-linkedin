export type MiniSudokuCellValue = number | null;

export type MiniSudokuGrid = MiniSudokuCellValue[][];

export interface MiniSudokuLevel {
  slug: string;
  title: string;
  description?: string;
  githubHandle: string;
  publishedDate: string; // ISO date string
  gridSize: number;
  startGrid: MiniSudokuGrid;
}

export interface ResolvedMiniSudokuLevel extends MiniSudokuLevel {
  solutionGrid: number[][]; // fully solved grid inferred at runtime
}

