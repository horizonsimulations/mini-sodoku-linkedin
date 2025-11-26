import type { MiniSudokuLevel } from "./types";

const level3: MiniSudokuLevel = {
  slug: "level3",
  title: "Level 3",
  description: "LinkedIn Mini Sudoku from Aug 14, 2025.",
  githubHandle: "__PR_AUTHOR__",
  publishedDate: "2025-08-14",
  gridSize: 6,
  startGrid: [
    [1, 2, 3, 4, null, null],
    [5, null, null, null, null, null],
    [6, null, null, null, null, null],
    [null, null, null, null, null, 1],
    [null, null, null, null, null, 3],
    [null, null, 4, 2, 6, 5],
  ],
};

export default level3;

