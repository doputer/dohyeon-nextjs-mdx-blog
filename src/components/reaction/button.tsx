import type { PropsWithChildren, Ref } from 'react';

import useEmoji from '@/hooks/use-emoji';

interface Props {
  ref?: Ref<HTMLButtonElement>;
  emoji: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = ({ ref, ...props }: PropsWithChildren<Props>) => {
  const { View } = useEmoji(props.emoji);

  return (
    <button
      ref={ref}
      onClick={(e) => props.onClick(e)}
      className="group flex items-center justify-between gap-4 rounded border border-line px-2 py-1 transition-colors duration-300 ease-out select-none"
    >
      <div className="size-6 transition-transform duration-300 ease-out group-hover:scale-150">
        {View}
      </div>
      {props.children}
    </button>
  );
};

export default Button;
