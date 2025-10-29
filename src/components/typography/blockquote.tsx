import type { PropsWithChildren } from 'react';

import { ChatBubbleOvalLeftIcon } from '@heroicons/react/24/solid';

import { cn } from '@/utils/cn';

interface Props {
  className?: string;
}

const Blockquote = (props: PropsWithChildren<Props>) => {
  return (
    <blockquote {...props} className={cn('group bg-surface', props.className)}>
      <ChatBubbleOvalLeftIcon className="mt-0.5 size-6 shrink-0 text-mute group-hover:animate-flip" />
      <div className="space-y-6 overflow-hidden">{props.children}</div>
    </blockquote>
  );
};

export default Blockquote;
