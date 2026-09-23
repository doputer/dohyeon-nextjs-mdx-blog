import type { Board, Step } from '#/sudoku-backtracking/engine/solver';
import { cn } from '@/utils/cn';

export type { Board };
export type Mask = boolean[][];

export const makeLockedMask = (board: Board): Mask => board.map((row) => row.map((v) => v > 0));

interface Props {
  board: Board;
  currentStep?: Step;
  lockedMask?: Mask;
}

const Grid = ({ board, currentStep, lockedMask }: Props) => {
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
              {cell || ''}
            </div>
          );
        })
      )}
    </div>
  );
};

export default Grid;
