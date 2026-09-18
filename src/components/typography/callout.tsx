import type { ComponentProps } from 'react';

const Callout = ({ children, ...props }: ComponentProps<'aside'>) => (
  <aside {...props}>{children}</aside>
);

export default Callout;
