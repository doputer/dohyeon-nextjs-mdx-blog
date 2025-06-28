import { forwardRef } from 'react';

import { useLottie } from 'lottie-react';

interface Props {
  type: string;
  emoji: object;
  count: number;
  onClick: () => void;
}

const Button = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const options = { animationData: props.emoji, loop: true };
  const style = { width: 32, height: 32 };
  const { View } = useLottie(options, style);

  return (
    <button
      ref={ref}
      onClick={props.onClick}
      className="group flex items-center justify-start gap-2 bg-surface px-2 py-1 hover:bg-subtle/20"
    >
      {View}
      <span>{props.count}</span>
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
