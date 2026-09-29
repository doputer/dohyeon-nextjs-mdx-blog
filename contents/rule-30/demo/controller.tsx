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
    <fieldset aria-label="조작" className="flex flex-col gap-2">
      <label className="flex items-center gap-2.5 text-sm text-muted select-none">
        <span className="w-8 shrink-0 font-mono">규칙</span>
        <input
          type="range"
          min={MIN}
          max={MAX}
          step={1}
          value={state.rule}
          onChange={(e) => control.setRule(Number(e.target.value))}
          style={{ '--fill': fill } as CSSProperties}
          className="h-5 w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-progress]:h-1 [&::-moz-range-progress]:bg-main [&::-moz-range-thumb]:box-border [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-none [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-main [&::-moz-range-thumb]:bg-background [&::-moz-range-track]:h-1 [&::-moz-range-track]:bg-line [&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:bg-[linear-gradient(to_right,var(--color-main)_var(--fill),var(--color-line)_var(--fill))] [&::-webkit-slider-thumb]:mt-[-6px] [&::-webkit-slider-thumb]:box-border [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-none [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-main [&::-webkit-slider-thumb]:bg-background"
        />
        <span className="w-8 shrink-0 text-right font-mono">{state.rule}</span>
      </label>

      <div className="flex items-center gap-1.5">
        <button
          className="border border-line px-2 py-0.5 text-sm text-main select-none"
          onClick={control.restart}
        >
          다시 시작
        </button>
        <button
          className="min-w-9 border border-line px-2 py-0.5 font-mono text-sm text-main select-none"
          onClick={control.increaseSpeed}
        >
          ×{state.speed}
        </button>
        <button
          className="border border-main px-2 py-0.5 text-sm text-main select-none"
          onClick={control.togglePause}
        >
          {state.paused ? '재생' : '정지'}
        </button>
      </div>
    </fieldset>
  );
};

export default Controller;
