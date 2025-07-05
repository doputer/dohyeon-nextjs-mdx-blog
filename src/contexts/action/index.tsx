'use client';

import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { getActionByUserId } from '@/lib/supabase/action';
import { getItem } from '@/utils/local-storage';

type ActionMap = Record<string, string[]>;

interface ActionContext {
  hasAction: (slug: string, action: string) => boolean;
  setAction: (slug: string, action: string) => void;
}

export const ActionContext = createContext<ActionContext | null>(null);

const ActionProvider = ({ children }: PropsWithChildren) => {
  const [actions, set] = useState<ActionMap>({});

  const hasAction = useCallback(
    (slug: string, action: string) => (actions[slug] ?? []).includes(action),
    [actions]
  );

  const setAction = useCallback((slug: string, action: string) => {
    set((state) => {
      const current = state[slug] ?? [];
      if (current.includes(action)) return state;

      return { ...state, [slug]: [...current, action] };
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

  const value = useMemo(() => ({ hasAction, setAction }), [hasAction, setAction]);

  return <ActionContext.Provider value={value}>{children}</ActionContext.Provider>;
};

export default ActionProvider;
