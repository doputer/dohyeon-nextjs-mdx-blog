type Board = number[][];

export function* solve(board: Board): Generator<Board> {
  const empty = findEmpty(board);
  if (!empty) {
    yield board;
    return true;
  }

  const [row, col] = empty;

  for (let n = 1; n <= 9; n++) {
    const newBoard = cloneBoard(board);
    newBoard[row][col] = n;
    yield newBoard;

    if (isValid(board, row, col, n)) {
      const result = yield* solve(newBoard);
      if (result) return true;
    }
  }

  return false;
}

export const cloneBoard = (board: Board) => board.map((row) => [...row]);

const isValid = (board: Board, row: number, col: number, n: number) => {
  if (board[row].includes(n)) return false;
  if (board.some((r) => r[col] === n)) return false;

  const a = Math.floor(row / 3) * 3;
  const b = Math.floor(col / 3) * 3;

  for (let i = a; i < a + 3; i++) {
    for (let j = b; j < b + 3; j++) {
      if (board[i][j] === n) return false;
    }
  }

  return true;
};

const findEmpty = (board: Board) => {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === 0) return [i, j];
    }
  }
  return null;
};

export const sleep = (ms = 50) => new Promise((resolve) => setTimeout(resolve, ms));
