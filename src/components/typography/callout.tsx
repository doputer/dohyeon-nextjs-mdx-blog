import type { PropsWithChildren } from 'react';

import { cn } from '@/utils/cn';
import { BoltIcon } from '@heroicons/react/24/solid';

interface Props {
  className?: string;
}

const Callout = (props: PropsWithChildren<Props>) => {
  return (
    <blockquote {...props} className={cn('group', props.className)}>
      <BoltIcon className="mt-1.5 size-5 shrink-0 text-accent group-hover:animate-flip" />
      <div className="space-y-6 overflow-hidden">{props.children}</div>
    </blockquote>
  );
};

export default Callout;
