import { forwardRef, type PropsWithChildren } from 'react';

import { useLottie } from 'lottie-react';

interface Props {
  emoji: object;
  onClick: () => void;
}

const style = { width: 32, height: 32 };

const Button = forwardRef<HTMLButtonElement, PropsWithChildren<Props>>((props, ref) => {
  const options = { animationData: props.emoji, loop: true };
  const { View } = useLottie(options, style);

  return (
    <button
      ref={ref}
      onClick={props.onClick}
      className="group flex items-center justify-start gap-2 bg-surface px-2 py-1 select-none hover:bg-subtle/20"
    >
      {View}
      {props.children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
