import type { ComponentProps } from 'react';

const Callout = ({ children, ...props }: ComponentProps<'blockquote'>) => (
  <blockquote {...props}>{children}</blockquote>
);

export default Callout;
