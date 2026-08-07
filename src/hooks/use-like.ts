import { useCallback, useEffect, useRef, useState } from 'react';

import useAction from '@/hooks/use-action';
import { getLikeBySlug, postLike } from '@/lib/supabase/client/like';
import { getItem } from '@/utils/local-storage';

const type = 'like';

const useLike = (slug: string) => {
  const [like, setLike] = useState<number | null>(null);
  const { loaded, hasAction, setAction } = useAction();
  const pending = useRef(false);

  const liked = hasAction(slug, type);

  useEffect(() => {
    let canceled = false;
    pending.current = false;

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

  const addLike = useCallback(async () => {
    if (process.env.NODE_ENV === 'development') return;
    if (!loaded || liked || pending.current) return;

    const id = getItem('UNIQUE_USER_ID');
    if (!id) return;

    pending.current = true;
    setLike((state) => (state ?? 0) + 1);

    try {
      await postLike(id, slug);
      setAction(slug, type);
    } catch {
      setLike((state) => (state ?? 1) - 1);
      pending.current = false;
    }
  }, [loaded, liked, slug, setAction]);

  return { like, liked, addLike };
};

export default useLike;
