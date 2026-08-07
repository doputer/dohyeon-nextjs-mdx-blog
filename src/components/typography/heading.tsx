import type { ComponentProps } from 'react';

import Anchor from '@/components/typography/anchor';
import { cn } from '@/utils/cn';

interface Props extends ComponentProps<'h2'> {
  as: 'h2' | 'h3' | 'h4';
}

const Heading = ({ as: Tag, children, className, ...props }: Props) => {
  return (
    <Tag className={cn('group', className)} {...props}>
      {children}
      <Anchor id={props.id} />
    </Tag>
  );
};

export default Heading;
