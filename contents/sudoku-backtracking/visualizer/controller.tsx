import { ArrowPathIcon, PauseIcon, PlayIcon } from '@heroicons/react/24/solid';

interface Props {
  state: {
    speed: number;
    paused: boolean;
  };
  control: {
    increaseSpeed: () => void;
    togglePause: () => void;
    reset?: () => void;
  };
}

const buttonStyle =
  'flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-[13px] font-medium text-muted select-none hover:bg-surface hover:text-main';

const Controller = ({ state, control }: Props) => {
  return (
    <div className="flex items-center justify-between rounded border border-line bg-surface/55 py-1 pr-1.5 pl-3.5">
      <div className="flex items-center gap-3 text-xs text-muted select-none">
        <span className="flex items-center gap-1.5">
          <i className="size-2 rounded-xs bg-main/25" />
          시도
        </span>
        <span className="flex items-center gap-1.5">
          <i className="size-2 rounded-xs bg-main/60" />
          되돌아가기
        </span>
      </div>

      <div className="flex items-center gap-1">
        {control.reset && (
          <button aria-label="처음부터" className={buttonStyle} onClick={control.reset}>
            <ArrowPathIcon className="size-3.5" />
          </button>
        )}
        <button className={`${buttonStyle} tabular-nums`} onClick={control.increaseSpeed}>
          ×{state.speed}
        </button>
        <button
          aria-label={state.paused ? '재생' : '일시정지'}
          className="flex size-7 items-center justify-center rounded-full bg-main text-background select-none hover:opacity-85"
          onClick={control.togglePause}
        >
          {state.paused ? <PlayIcon className="size-3.5" /> : <PauseIcon className="size-3.5" />}
        </button>
      </div>
    </div>
  );
};

export default Controller;
