import type { PropsWithChildren } from 'react';

import { BoltIcon } from '@heroicons/react/24/solid';

import { cn } from '@/utils/cn';

interface Props {
  className?: string | undefined;
}

const Callout = (props: PropsWithChildren<Props>) => {
  const className = cn(props.className, 'group');

  return (
    <blockquote {...props} className={className}>
      <BoltIcon className="size-6 text-mute group-hover:animate-flip" />
      {props.children}
    </blockquote>
  );
};

export default Callout;
