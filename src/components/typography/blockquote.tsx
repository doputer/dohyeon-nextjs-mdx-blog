import type { ComponentProps } from 'react';

const Blockquote = ({ children, ...props }: ComponentProps<'blockquote'>) => (
  <blockquote {...props}>
    <div className="space-y-6 overflow-hidden">{children}</div>
  </blockquote>
);

export default Blockquote;
