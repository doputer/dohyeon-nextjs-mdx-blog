import type { Board, Step } from '#/sudoku-backtracking/engine/solver';
import { cn } from '@/utils/cn';

export type { Board };
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
    <div className="grid aspect-square grid-cols-9 grid-rows-9 overflow-hidden rounded border-2 border-line bg-surface">
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
                'flex items-center justify-center border-line text-sm tabular-nums',
                i % 3 === 0 ? 'border-t-2 border-t-line' : 'border-t',
                j % 3 === 0 ? 'border-l-2 border-l-line' : 'border-l',
                i === 0 && 'border-t-0',
                j === 0 && 'border-l-0',
                isLocked === true && 'font-medium',
                isLocked === false && 'text-muted',
                isTry && 'bg-main/20',
                isBack &&
                  'relative after:pointer-events-none after:absolute after:inset-0 after:border after:border-dashed after:border-main/40'
              )}
            >
              {readOnly ? (
                <span>{cell || ''}</span>
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
                  className="size-full bg-transparent text-center outline-none"
                />
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default Grid;
