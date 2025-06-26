import type { PropsWithChildren } from 'react';

import { cn } from '@/utils/cn';

interface CalloutProps {
  type?: 'info' | 'warn';
  className?: string | undefined;
}

const calloutClasses = {
  info: 'bg-blue/15',
  warn: 'bg-orange/15',
} as const;

const Callout = (props: PropsWithChildren<CalloutProps>) => {
  const type = props.type ?? 'info';
  const className = cn(props.className, calloutClasses[type]);

  return <div {...props} className={className} />;
};

export default Callout;
