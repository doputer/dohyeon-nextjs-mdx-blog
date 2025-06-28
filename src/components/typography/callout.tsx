import type { PropsWithChildren } from 'react';

import { BoltIcon } from '@heroicons/react/24/solid';

import { cn } from '@/utils/cn';

interface Props {
  className?: string | undefined;
}

const Callout = (props: PropsWithChildren<Props>) => {
  const className = cn(props.className, 'bg-orange/15 group');

  return (
    <blockquote {...props} className={className}>
      <BoltIcon className="text-orange/70 group-hover:animate-flip size-6" />
      {props.children}
    </blockquote>
  );
};

export default Callout;
