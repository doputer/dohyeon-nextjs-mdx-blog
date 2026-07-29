import { useCallback, useEffect, useState } from 'react';

import useAction from '@/hooks/use-action';
import { getLikeBySlug, postLike } from '@/lib/supabase/client/like';
import { getItem } from '@/utils/local-storage';

const type = 'like';

const useLike = (slug: string) => {
  const [like, setLike] = useState<number | null>(null);
  const { hasAction, setAction } = useAction();

  useEffect(() => {
    let canceled = false;

    getLikeBySlug(slug)
      .then((count) => {
        if (!canceled) setLike(count);
      })
      .catch(() => {
        if (!canceled) setLike(0);
      });

    return () => {
      canceled = true;
    };
  }, [slug]);

  const addLike = useCallback(
    async (slug: string) => {
      if (process.env.NODE_ENV === 'development') return;

      const id = getItem('UNIQUE_USER_ID');
      if (!id) return;
      if (hasAction(slug, type)) return;

      setLike((state) => (state ?? 0) + 1);
      setAction(slug, type);

      try {
        await postLike(id, slug);
      } catch {
        setLike((state) => (state ?? 1) - 1);
      }
    },
    [hasAction, setAction]
  );

  return { like, addLike };
};

export default useLike;
