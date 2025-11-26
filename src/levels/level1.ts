import type { MiniSudokuLevel } from "./types";

const level1: MiniSudokuLevel = {
  slug: "level1",
  title: "Level 1",
  description: "LinkedIn Mini Sudoku from Aug 12, 2025.",
  githubHandle: "__PR_AUTHOR__",
  publishedDate: "2025-08-12",
  gridSize: 6,
  startGrid: [
    [1, 2, 3, 4, 5, null],
    [null, 5, null, 2, 3, null],
    [null, null, 4, null, 6, null],
    [null, null, null, 3, 1, null],
    [5, null, null, null, 2, null],
    [null, null, null, null, null, null],
  ],
};

export default level1;

