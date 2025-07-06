type Board = number[][];

export type Step = {
  board: Board;
  row: number;
  col: number;
  status: 'try' | 'backtrack' | 'done';
};

const findEmptyCell = (board: Board) => {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === 0) return [row, col];
    }
  }
  return null;
};

const isPlacementValid = (board: Board, row: number, col: number, value: number) => {
  if (board[row].includes(value)) return false;
  if (board.some((r) => r[col] === value)) return false;

  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;

  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (board[i][j] === value) return false;
    }
  }

  return true;
};

export const cloneBoard = (board: Board) => board.map((row) => [...row]);

export function* solve(board: Board): Generator<Step> {
  const emptyCell = findEmptyCell(board);
  if (!emptyCell) {
    yield { board, row: -1, col: -1, status: 'done' };

    return true;
  }

  const [row, col] = emptyCell;

  for (let value = 1; value <= 9; value++) {
    if (!isPlacementValid(board, row, col, value)) continue;

    const newBoard = cloneBoard(board);
    newBoard[row][col] = value;

    yield { board: newBoard, row, col, status: 'try' };

    const solved = yield* solve(newBoard);
    if (solved) return true;

    yield { board: newBoard, row, col, status: 'backtrack' };
  }

  return false;
}

export const sleep = (ms = 50) => new Promise((resolve) => setTimeout(resolve, ms));
