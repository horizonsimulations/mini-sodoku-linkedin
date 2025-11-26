import type { MiniSudokuLevel } from "./types";

const level4: MiniSudokuLevel = {
  slug: "level4",
  title: "Level 4",
  description: "LinkedIn Mini Sudoku from Aug 15, 2025.",
  githubHandle: "__PR_AUTHOR__",
  publishedDate: "2025-08-15",
  gridSize: 6,
  startGrid: [
    [6, null, null, null, null, 1],
    [5, null, null, null, null, 3],
    [null, 4, null, null, 2, null],
    [null, 3, null, null, 5, null],
    [null, null, 2, 4, null, null],
    [null, null, 1, 6, null, null],
  ],
};

export default level4;

