import { PauseIcon, PlayIcon } from '@heroicons/react/24/solid';

interface Props {
  state: {
    speed: number;
    paused: boolean;
  };
  control: {
    increaseSpeed: () => void;
    togglePause: () => void;
  };
}

const Controller = ({ state, control }: Props) => {
  return (
    <div className="flex h-8 justify-end gap-1">
      <button
        className="rounded px-2 text-lg font-medium select-none hover:bg-surface"
        onClick={control.increaseSpeed}
      >
        X{state.speed}
      </button>
      <button className="rounded px-2 select-none hover:bg-surface" onClick={control.togglePause}>
        {state.paused ? <PlayIcon className="size-5" /> : <PauseIcon className="size-5" />}
      </button>
    </div>
  );
};

export default Controller;
