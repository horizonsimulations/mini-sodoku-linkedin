import type {
  MiniSudokuGrid,
  MiniSudokuLevel,
  ResolvedMiniSudokuLevel,
} from "@/levels/types";

export type PlayableGrid = string[][];

export const GRID_SIZE = 6;

export const createPlayableGrid = (level: MiniSudokuLevel): PlayableGrid =>
  level.startGrid.map((row) =>
    row.map((cell) => (cell === null || cell === undefined ? "" : String(cell)))
  );

export const cloneGrid = (grid: PlayableGrid) =>
  grid.map((row) => [...row]);

export const isSolved = (grid: PlayableGrid, level: ResolvedMiniSudokuLevel) =>
  grid.every((row, rowIdx) =>
    row.every(
      (value, colIdx) =>
        value !== "" &&
        Number(value) === level.solutionGrid[rowIdx][colIdx]
    )
  );

export const findFirstMismatch = (
  grid: PlayableGrid,
  level: ResolvedMiniSudokuLevel
): { row: number; col: number; reason?: string } | null => {
  for (let row = 0; row < level.gridSize; row += 1) {
    for (let col = 0; col < level.gridSize; col += 1) {
      if (grid[row][col] !== String(level.solutionGrid[row][col])) {
        return { row, col };
      }
    }
  }
  return null;
};

export const collectMismatches = (
  grid: PlayableGrid,
  level: ResolvedMiniSudokuLevel
): Array<{ row: number; col: number }> => {
  const mismatches: Array<{ row: number; col: number }> = [];
  for (let row = 0; row < level.gridSize; row += 1) {
    for (let col = 0; col < level.gridSize; col += 1) {
      if (grid[row][col] !== String(level.solutionGrid[row][col])) {
        mismatches.push({ row, col });
      }
    }
  }
  return mismatches;
};

export const formatCellLabel = (row: number, col: number) =>
  `r${row + 1}c${col + 1}`;

export const formatHintMessage = (
  row: number,
  col: number,
  value: number,
  reason?: string
) =>
  `Row ${row + 1}, Column ${col + 1} = ${value}${
    reason ? ` · ${reason}` : ""
  }`;

const isValidPlacement = (
  grid: number[][],
  row: number,
  col: number,
  value: number,
  gridSize: number
) => {
  for (let i = 0; i < gridSize; i += 1) {
    if (grid[row][i] === value || grid[i][col] === value) {
      return false;
    }
  }

  const subgridRows = gridSize === 6 ? 2 : Math.sqrt(gridSize);
  const subgridCols = gridSize === 6 ? 3 : Math.sqrt(gridSize);
  const boxRowStart = Math.floor(row / subgridRows) * subgridRows;
  const boxColStart = Math.floor(col / subgridCols) * subgridCols;

  for (let r = 0; r < subgridRows; r += 1) {
    for (let c = 0; c < subgridCols; c += 1) {
      if (grid[boxRowStart + r][boxColStart + c] === value) {
        return false;
      }
    }
  }

  return true;
};

const cloneNumericGrid = (grid: MiniSudokuGrid): number[][] =>
  grid.map((row) => row.map((cell) => (cell ?? 0)));

const solveBacktracking = (
  grid: number[][],
  gridSize: number,
  values: number[]
): boolean => {
  for (let row = 0; row < gridSize; row += 1) {
    for (let col = 0; col < gridSize; col += 1) {
      if (grid[row][col] === 0) {
        for (const value of values) {
          if (isValidPlacement(grid, row, col, value, gridSize)) {
            grid[row][col] = value;
            if (solveBacktracking(grid, gridSize, values)) {
              return true;
            }
            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
};

export const solveMiniSudoku = (startGrid: MiniSudokuGrid): number[][] => {
  const gridSize = startGrid.length;
  const candidateValues = Array.from({ length: gridSize }, (_, idx) => idx + 1);
  const workingGrid = cloneNumericGrid(startGrid);
  const solved = solveBacktracking(workingGrid, gridSize, candidateValues);

  if (!solved) {
    throw new Error("Unable to derive a valid solution for the provided grid.");
  }

  return workingGrid;
};

