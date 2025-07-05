'use client';

import { type PropsWithChildren, useEffect } from 'react';

import useActions from '@/hooks/use-actions';
import { getActionByUserId } from '@/lib/supabase/action';
import { getItem } from '@/utils/local-storage';

const Actions = ({ children }: PropsWithChildren) => {
  const { setActions } = useActions();

  useEffect(() => {
    const fallback = () => {
      try {
        return crypto.randomUUID();
      } catch {
        return 'localhost';
      }
    };

    const id = getItem('UNIQUE_USER_ID', fallback);
    if (!id) return;

    getActionByUserId(id).then((data) => {
      data.forEach(({ slug, action }) => setActions(slug, action));
    });
  }, [setActions]);

  return <>{children}</>;
};

export default Actions;
