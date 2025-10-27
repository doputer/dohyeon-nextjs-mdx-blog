import type { PropsWithChildren } from 'react';

import { ChatBubbleOvalLeftIcon } from '@heroicons/react/24/solid';

import { cn } from '@/utils/cn';

interface Props {
  className?: string | undefined;
}

const Blockquote = (props: PropsWithChildren<Props>) => {
  return (
    <blockquote {...props} className={cn('group bg-surface', props.className)}>
      <div className="pt-0.5 pb-1.5">
        <ChatBubbleOvalLeftIcon className="size-6 text-mute group-hover:animate-flip" />
      </div>
      <div className="flex flex-col gap-6">{props.children}</div>
    </blockquote>
  );
};

export default Blockquote;
