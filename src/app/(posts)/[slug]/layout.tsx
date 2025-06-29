import type { PropsWithChildren } from 'react';

import Actions from '@/components/post/actions';
import Progress from '@/components/progress';

const Layout = async ({ children }: PropsWithChildren) => {
  return (
    <Actions>
      <Progress />
      {children}
    </Actions>
  );
};

export default Layout;
