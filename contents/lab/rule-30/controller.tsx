import type { CSSProperties } from 'react';

interface Props {
  state: {
    speed: number;
    paused: boolean;
    rule: number;
  };
  control: {
    increaseSpeed: () => void;
    togglePause: () => void;
    restart: () => void;
    setRule: (value: number) => void;
  };
}

const MIN = 0;
const MAX = 255;

const Controller = ({ state, control }: Props) => {
  const fill = `${((state.rule - MIN) / (MAX - MIN)) * 100}%`;

  return (
    <div className="flex flex-col gap-2 rounded border border-line bg-surface p-3">
      <label className="flex items-center gap-2.5 text-xs text-muted select-none">
        <span className="w-8 shrink-0 font-mono">규칙</span>
        <input
          type="range"
          min={MIN}
          max={MAX}
          step={1}
          value={state.rule}
          onChange={(e) => control.setRule(Number(e.target.value))}
          style={{ '--fill': fill } as CSSProperties}
          className="h-4 w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-progress]:h-px [&::-moz-range-progress]:bg-main [&::-moz-range-thumb]:size-2.5 [&::-moz-range-thumb]:rounded-none [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-main [&::-moz-range-track]:h-px [&::-moz-range-track]:bg-line [&::-webkit-slider-runnable-track]:h-px [&::-webkit-slider-runnable-track]:bg-[linear-gradient(to_right,var(--color-main)_var(--fill),var(--color-line)_var(--fill))] [&::-webkit-slider-thumb]:mt-[-4.5px] [&::-webkit-slider-thumb]:size-2.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-none [&::-webkit-slider-thumb]:bg-main"
        />
        <span className="w-8 shrink-0 text-right font-mono">{state.rule}</span>
      </label>

      <div className="flex items-center justify-end">
        <button
          className="flex min-w-7 items-center justify-center rounded px-1.5 py-0.5 text-xs font-medium text-muted select-none hover:bg-surface hover:text-main"
          onClick={control.restart}
        >
          다시 시작
        </button>
        <button
          className="flex min-w-7 items-center justify-center rounded px-1.5 py-0.5 text-xs font-medium text-muted select-none hover:bg-surface hover:text-main"
          onClick={control.increaseSpeed}
        >
          ×{state.speed}
        </button>
        <button
          className="ml-2.5 flex items-center justify-center rounded bg-main px-1.5 py-0.5 text-xs font-medium text-background select-none hover:opacity-85"
          onClick={control.togglePause}
        >
          {state.paused ? '재생' : '정지'}
        </button>
      </div>
    </div>
  );
};

export default Controller;
