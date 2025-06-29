import type { PropsWithChildren } from 'react';

import Progress from '@/components/progress';

const Layout = async ({ children }: PropsWithChildren) => {
  return (
    <>
      <Progress />
      {children}
    </>
  );
};

export default Layout;
