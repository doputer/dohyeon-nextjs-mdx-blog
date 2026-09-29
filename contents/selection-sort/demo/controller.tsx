interface Props {
  state: {
    speed: number;
    paused: boolean;
  };
  control: {
    increaseSpeed: () => void;
    togglePause: () => void;
    restart: () => void;
  };
}

const Controller = ({ state, control }: Props) => {
  return (
    <>
      <div className="-mt-1 flex flex-wrap items-center justify-end gap-x-3 gap-y-1 px-0.5 text-xs text-muted select-none">
        <span className="flex items-center gap-1.5">
          <i className="inline-block size-2.5 bg-accent-alt" />
          최솟값 후보
        </span>
        <span className="flex items-center gap-1.5">
          <i className="inline-block size-2.5 bg-accent" />
          비교 중
        </span>
        <span className="flex items-center gap-1.5">
          <i className="inline-block size-2.5 bg-main" />
          정렬 완료
        </span>
      </div>
      <fieldset aria-label="조작">
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
    </>
  );
};

export default Controller;
