import { create } from 'zustand';

type UseActions = {
  actions: Record<string, string[]>;
  hasActions: (slug: string, action: string) => boolean;
  setActions: (slug: string, action: string) => void;
};

const useActions = create<UseActions>((set, get) => ({
  actions: {},
  hasActions: (slug, action) => (get().actions[slug] ?? []).includes(action),
  setActions: (slug, action) => {
    set((state) => {
      const existing = state.actions[slug] ?? [];
      if (existing.includes(action)) return state;

      return { actions: { ...state.actions, [slug]: [...existing, action] } };
    });
  },
}));

export default useActions;
