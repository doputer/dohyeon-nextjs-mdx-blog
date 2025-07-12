import type { PropsWithChildren } from 'react';

import { ChatBubbleOvalLeftIcon } from '@heroicons/react/24/solid';

import { cn } from '@/utils/cn';

interface Props {
  className?: string | undefined;
}

const Blockquote = (props: PropsWithChildren<Props>) => {
  return (
    <blockquote {...props} className={cn('group', props.className)}>
      <ChatBubbleOvalLeftIcon className="size-6 text-mute group-hover:animate-flip" />
      {props.children}
    </blockquote>
  );
};

export default Blockquote;
