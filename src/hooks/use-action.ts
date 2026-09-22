import { useCallback, useEffect, useState } from 'react';

import { getActionBySlug } from '@/lib/supabase/action';
import { getItem } from '@/utils/local-storage';

interface Action {
  slug: string;
  actions: Set<string>;
}

const useAction = (slug: string) => {
  const [state, setState] = useState<Action | null>(null);

  const actions = state?.slug === slug ? state.actions : null;
  const loaded = actions !== null;

  const hasAction = useCallback((action: string) => actions?.has(action) ?? false, [actions]);

  const setAction = useCallback(
    (action: string) => {
      setState((prevState) => {
        if (prevState?.slug !== slug) return prevState;
        if (prevState.actions.has(action)) return prevState;

        const nextActions = new Set(prevState.actions);
        nextActions.add(action);

        return { slug, actions: nextActions };
      });
    },
    [slug]
  );

  useEffect(() => {
    let canceled = false;

    const fallback = () => {
      try {
        return crypto.randomUUID();
      } catch {
        return 'localhost';
      }
    };

    const load = async () => {
      const id = getItem('UNIQUE_USER_ID', fallback);
      const data = id ? await getActionBySlug(id, slug) : [];

      return new Set(data.map(({ action }) => action));
    };

    load()
      .catch(() => new Set<string>())
      .then((actions) => {
        if (!canceled) setState({ slug, actions });
      });

    return () => {
      canceled = true;
    };
  }, [slug]);

  return { loaded, hasAction, setAction };
};

export default useAction;
