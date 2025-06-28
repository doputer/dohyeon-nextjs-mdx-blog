import type { PropsWithChildren } from 'react';

import { ChatBubbleOvalLeftIcon } from '@heroicons/react/24/solid';

import { cn } from '@/utils/cn';

interface Props {
  className?: string | undefined;
}

const Blockquote = (props: PropsWithChildren<Props>) => {
  const className = cn(props.className, 'bg-surface group');

  return (
    <blockquote {...props} className={className}>
      <ChatBubbleOvalLeftIcon className="text-subtle group-hover:animate-flip size-6" />
      {props.children}
    </blockquote>
  );
};

export default Blockquote;
