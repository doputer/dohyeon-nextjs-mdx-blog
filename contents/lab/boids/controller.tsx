import type { CSSProperties } from 'react';

import type { Weights } from '~/boids/engine';

interface Props {
  state: {
    speed: number;
    paused: boolean;
    weights: Weights;
  };
  control: {
    increaseSpeed: () => void;
    togglePause: () => void;
    reset: () => void;
    setWeight: (key: keyof Weights, value: number) => void;
  };
}

const MIN = 0;
const MAX = 2;

const SLIDERS: { key: keyof Weights; label: string }[] = [
  { key: 'separation', label: '분리' },
  { key: 'alignment', label: '정렬' },
  { key: 'cohesion', label: '응집' },
];

const Controller = ({ state, control }: Props) => {
  return (
    <div className="flex flex-col gap-2 rounded border border-line bg-surface p-3">
      <div className="flex flex-col gap-1">
        {SLIDERS.map(({ key, label }) => {
          const value = state.weights[key];
          const fill = `${((value - MIN) / (MAX - MIN)) * 100}%`;

          return (
            <label key={key} className="flex items-center gap-2.5 text-xs text-muted select-none">
              <span className="w-8 shrink-0 font-mono">{label}</span>
              <input
                type="range"
                min={MIN}
                max={MAX}
                step={0.1}
                value={value}
                onChange={(e) => control.setWeight(key, Number(e.target.value))}
                style={{ '--fill': fill } as CSSProperties}
                className="h-4 w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-progress]:h-px [&::-moz-range-progress]:bg-main [&::-moz-range-thumb]:size-2.5 [&::-moz-range-thumb]:rounded-none [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-main [&::-moz-range-track]:h-px [&::-moz-range-track]:bg-line [&::-webkit-slider-runnable-track]:h-px [&::-webkit-slider-runnable-track]:bg-[linear-gradient(to_right,var(--color-main)_var(--fill),var(--color-line)_var(--fill))] [&::-webkit-slider-thumb]:mt-[-4.5px] [&::-webkit-slider-thumb]:size-2.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-none [&::-webkit-slider-thumb]:bg-main"
              />
            </label>
          );
        })}
      </div>

      <div className="flex items-center justify-end">
        <button
          className="flex min-w-7 items-center justify-center rounded px-1.5 py-0.5 text-xs font-medium text-muted select-none hover:bg-surface hover:text-main"
          onClick={control.reset}
        >
          초기화
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
