import type { MiniSudokuLevel } from "./types";

const level2: MiniSudokuLevel = {
  slug: "level2",
  title: "Level 2",
  description: "LinkedIn Mini Sudoku from Aug 13, 2025.",
  githubHandle: "__PR_AUTHOR__",
  publishedDate: "2025-08-13",
  gridSize: 6,
  startGrid: [
    [1, null, null, null, null, 5],
    [null, 2, null, null, 3, null],
    [null, null, 3, 5, null, null],
    [null, null, 1, 4, null, null],
    [null, 4, null, null, 5, null],
    [3, null, null, null, null, 6],
  ],
};

export default level2;

