import { useCallback, useEffect, useState } from 'react';

import { getActionByUserId } from '@/lib/supabase/client/action';
import { getItem } from '@/utils/local-storage';

type Action = Map<string, Set<string>>;

const useAction = () => {
  const [map, setMap] = useState<Action>(new Map());

  const hasAction = useCallback(
    (slug: string, action: string) => map.get(slug)?.has(action) ?? false,
    [map]
  );

  const setAction = useCallback((slug: string, action: string) => {
    setMap((prev) => {
      const next = new Map(prev);
      const set = prev.get(slug) ?? new Set<string>();

      if (set.has(action)) return prev;

      set.add(action);
      next.set(slug, set);

      return next;
    });
  }, []);

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
      data.forEach(({ slug, action }) => setAction(slug, action));
    });
  }, [setAction]);

  return { hasAction, setAction };
};

export default useAction;
