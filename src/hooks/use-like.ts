import { useCallback, useState } from 'react';

import useAction from '@/hooks/use-action';
import { postLike } from '@/lib/supabase/client/like';
import { getItem } from '@/utils/local-storage';

const type = 'like';

const useLike = (initial: number) => {
  const [like, setLike] = useState(initial);
  const { hasAction, setAction } = useAction();

  const addLike = useCallback(
    async (slug: string) => {
      if (process.env.NODE_ENV === 'development') return;

      const id = getItem('UNIQUE_USER_ID');
      if (!id) return;
      if (hasAction(slug, type)) return;

      setLike((state) => state + 1);
      setAction(slug, type);

      await postLike(id, slug);
    },
    [hasAction, setAction]
  );

  return { like, addLike };
};

export default useLike;
