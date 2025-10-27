import type { PropsWithChildren } from 'react';

import { BoltIcon } from '@heroicons/react/24/solid';

import { cn } from '@/utils/cn';

interface Props {
  className?: string | undefined;
}

const Callout = (props: PropsWithChildren<Props>) => {
  return (
    <blockquote {...props} className={cn('group bg-orange/20', props.className)}>
      <div className="pt-0.5 pb-1.5">
        <BoltIcon className="size-6 text-mute group-hover:animate-flip" />
      </div>
      <div className="flex flex-col gap-6">{props.children}</div>
    </blockquote>
  );
};

export default Callout;
