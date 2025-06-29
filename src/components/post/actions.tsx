'use client';

import { type PropsWithChildren, useEffect } from 'react';

import { useUserActions } from '@/hooks/use-user-actions';
import { getActionByUserId } from '@/lib/supabase/action.client';
import { getItem } from '@/utils/local-storage';

const UserActions = ({ children }: PropsWithChildren) => {
  const { setActions } = useUserActions();

  useEffect(() => {
    const id = getItem('UNIQUE_USER_ID', () => crypto.randomUUID());
    if (!id) return;

    const fetch = async () => {
      const data = await getActionByUserId(id);
      data.forEach(({ slug, action }) => setActions(slug, action));
    };

    fetch();
  }, [setActions]);

  return <>{children}</>;
};

export default UserActions;
