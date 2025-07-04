import type { PropsWithChildren } from 'react';

import { ChatBubbleOvalLeftIcon } from '@heroicons/react/24/solid';

import { cn } from '@/utils/cn';

interface Props {
  className?: string | undefined;
}

const Blockquote = (props: PropsWithChildren<Props>) => {
  const className = cn(props.className, 'group');

  return (
    <blockquote {...props} className={className}>
      <ChatBubbleOvalLeftIcon className="size-6 text-mute group-hover:animate-flip" />
      {props.children}
    </blockquote>
  );
};

export default Blockquote;
