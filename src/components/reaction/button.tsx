import { forwardRef, type PropsWithChildren, useMemo } from 'react';

import { useLottie } from 'lottie-react';

interface Props {
  emoji: object;
  onClick: () => void;
}

const style = { width: 32, height: 32 };

const Button = forwardRef<HTMLButtonElement, PropsWithChildren<Props>>((props, ref) => {
  const options = useMemo(() => ({ animationData: props.emoji, loop: true }), [props.emoji]);
  const { View } = useLottie(options, style);

  return (
    <button
      ref={ref}
      onClick={props.onClick}
      className="group flex items-center justify-start gap-2 bg-surface px-2 py-1 hover:bg-subtle/20"
    >
      {View}
      <span>{props.children}</span>
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
