type Board = number[][];

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

export function* solve(board: Board): Generator<Board> {
  const emptyCell = findEmptyCell(board);
  if (!emptyCell) {
    yield board;
    return true;
  }

  const [row, col] = emptyCell;

  for (let value = 1; value <= 9; value++) {
    const newBoard = cloneBoard(board);
    newBoard[row][col] = value;
    yield newBoard;

    if (!isPlacementValid(board, row, col, value)) continue;

    const solved = yield* solve(newBoard);
    if (solved) return true;
  }

  return false;
}

export const sleep = (ms = 50) => new Promise((resolve) => setTimeout(resolve, ms));
