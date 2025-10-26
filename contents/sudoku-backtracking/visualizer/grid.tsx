import { cn } from '@/utils/cn';

import type { Step } from '#/sudoku-backtracking/engine/solver';

export type Board = number[][];
export type Mask = boolean[][];

export const makeLockedMask = (board: Board): Mask => board.map((row) => row.map((v) => v > 0));

interface Props {
  board: Board;
  currentStep?: Step;
  lockedMask?: Mask;
  onChange?: (row: number, col: number, n: number) => void;
  readOnly?: boolean;
}

const Grid = ({ board, currentStep, lockedMask, onChange, readOnly = false }: Props) => {
  return (
    <div className="grid aspect-square grid-cols-9 grid-rows-9">
      {board.map((row, i) =>
        row.map((cell, j) => {
          const isTry =
            currentStep?.row === i && currentStep?.col === j && currentStep.status === 'try';
          const isBack =
            currentStep?.row === i && currentStep?.col === j && currentStep.status === 'backtrack';
          const isLocked = lockedMask ? lockedMask[i]?.[j] === true : undefined;

          return (
            <div
              key={`${i}-${j}`}
              className={cn(
                'relative flex items-center justify-center border-transparent text-sm',
                i % 3 === 0 ? 'border-t-4' : 'border-t-2',
                j % 3 === 0 ? 'border-l-4' : 'border-l-2',
                i === 0 && 'border-t-0',
                j === 0 && 'border-l-0',
                i === 8 && 'border-b-0',
                j === 8 && 'border-r-0',
                isLocked === false && 'text-blue dark:text-green'
              )}
            >
              {readOnly ? (
                <span className="relative z-10">{cell || ''}</span>
              ) : (
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]"
                  maxLength={1}
                  value={cell || ''}
                  onChange={(e) => {
                    if (!onChange) return;
                    const v = e.target.value;
                    const n = v === '' ? 0 : Number.parseInt(v, 10);
                    if (Number.isNaN(n) || n < 0 || n > 9) return;
                    onChange(i, j, n);
                  }}
                  className="relative z-10 size-full bg-transparent text-center outline-none"
                />
              )}

              <div
                className={cn(
                  'pointer-events-none absolute inset-0 rounded bg-surface',
                  isTry && 'bg-soft',
                  isBack && 'bg-red/30'
                )}
              />
            </div>
          );
        })
      )}
    </div>
  );
};

export default Grid;
