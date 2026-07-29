import type { PropsWithChildren } from 'react';

import { cn } from '@/utils/cn';

interface Props {
  className?: string;
}

const Blockquote = (props: PropsWithChildren<Props>) => {
  return (
    <blockquote {...props} className={cn(props.className)}>
      <div className="space-y-6 overflow-hidden">{props.children}</div>
    </blockquote>
  );
};

export default Blockquote;
