import type { PropsWithChildren } from 'react';

const Layout = ({ children }: PropsWithChildren) => {
  return <section className="flex flex-wrap items-end justify-start gap-8">{children}</section>;
};

export default Layout;
