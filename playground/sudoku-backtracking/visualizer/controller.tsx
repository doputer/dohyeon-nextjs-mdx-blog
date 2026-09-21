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

const Controller = ({ state, control }: Props) => {
  return (
    <div className="flex items-center justify-between rounded border border-line bg-surface py-1 pr-1.5 pl-3.5">
      <div className="flex items-center gap-3 text-xs text-muted select-none">
        <span className="flex items-center gap-1.5">
          <i className="inline-block size-2.5 rounded-xs border border-main/20 bg-main/20" />
          시도
        </span>
        <span className="flex items-center gap-1.5">
          <i className="inline-block size-2.5 rounded-xs border border-dashed border-main/40" />
          되돌아가기
        </span>
      </div>

      <div className="flex items-center">
        {control.reset && (
          <button
            className="flex min-w-7 items-center justify-center rounded px-1.5 py-0.5 text-xs font-medium text-muted select-none hover:bg-surface hover:text-main"
            onClick={control.reset}
          >
            초기화
          </button>
        )}
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
