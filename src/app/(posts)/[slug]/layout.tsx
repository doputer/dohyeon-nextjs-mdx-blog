import type { PropsWithChildren } from 'react';

import UserActions from '@/components/post/user-actions';
import Progress from '@/components/progress';

const Layout = async ({ children }: PropsWithChildren) => {
  return (
    <UserActions>
      <Progress />
      {children}
    </UserActions>
  );
};

export default Layout;
