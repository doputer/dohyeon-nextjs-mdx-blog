'use client';

import { type PropsWithChildren, useEffect } from 'react';

import { useActions } from '@/hooks/use-actions';
import { getActionByUserId } from '@/lib/supabase/action.client';
import { getItem } from '@/utils/local-storage';

const Actions = ({ children }: PropsWithChildren) => {
  const { setActions } = useActions();

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

export default Actions;
