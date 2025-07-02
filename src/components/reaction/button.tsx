import { forwardRef, type PropsWithChildren } from 'react';

import useEmoji from '@/hooks/use-emoji';

interface Props {
  emoji: string;
  onClick: () => void;
}

const Button = forwardRef<HTMLButtonElement, PropsWithChildren<Props>>((props, ref) => {
  const { View, play, stop } = useEmoji(props.emoji);

  return (
    <button
      ref={ref}
      onClick={props.onClick}
      onMouseEnter={play}
      onMouseLeave={stop}
      className="group flex items-center justify-start gap-2 rounded bg-surface px-2 py-1 transition-colors duration-300 ease-out select-none hover:bg-subtle/20"
    >
      <div className="size-6 transition-transform duration-300 ease-out group-hover:scale-150">
        {View}
      </div>
      {props.children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
