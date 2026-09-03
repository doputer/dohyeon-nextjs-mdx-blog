import { useCallback, useEffect, useState } from 'react';

import { getActionByUserId } from '@/lib/supabase/client/action';
import { getItem } from '@/utils/local-storage';

type Action = Map<string, Set<string>>;

const useAction = () => {
  const [map, setMap] = useState<Action>(new Map());
  const [loaded, setLoaded] = useState(false);

  const hasAction = useCallback(
    (slug: string, action: string) => map.get(slug)?.has(action) ?? false,
    [map]
  );

  const setAction = useCallback((slug: string, action: string) => {
    setMap((prevMap) => {
      const prevSet = prevMap.get(slug) ?? new Set<string>();
      if (prevSet.has(action)) return prevMap;

      const nextMap = new Map(prevMap);
      const nextSet = new Set(prevSet);

      nextSet.add(action);
      nextMap.set(slug, nextSet);

      return nextMap;
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

    const load = async () => {
      const id = getItem('UNIQUE_USER_ID', fallback);
      if (!id) return;

      const data = await getActionByUserId(id);
      data.forEach(({ slug, action }) => setAction(slug, action));
    };

    load()
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [setAction]);

  return { loaded, hasAction, setAction };
};

export default useAction;
