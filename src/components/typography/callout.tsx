import type { ComponentProps } from 'react';

import { BoltIcon } from '@heroicons/react/24/solid';

import { cn } from '@/utils/cn';

const Callout = ({ className, children, ...props }: ComponentProps<'blockquote'>) => (
  <blockquote {...props} className={cn('group', className)}>
    <BoltIcon className="mt-1.5 size-5 shrink-0 text-accent group-hover:animate-flip" />
    <div className="space-y-6 overflow-hidden">{children}</div>
  </blockquote>
);

export default Callout;
