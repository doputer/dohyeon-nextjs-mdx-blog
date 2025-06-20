import type { PropsWithChildren } from 'react';

import Progress from '@/components/progress';

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Progress />
      {children}
    </>
  );
};

export default Layout;
