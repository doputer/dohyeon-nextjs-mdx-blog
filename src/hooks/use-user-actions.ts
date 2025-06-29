import { create } from 'zustand';

export type Action = Record<string, string[]>;

type UserActions = {
  actions: Action;
  getActions: (slug: string) => string[];
  setActions: (slug: string, action: string) => void;
};

export const useUserActions = create<UserActions>((set, get) => ({
  actions: {},
  getActions: (slug) => get().actions[slug] ?? [],
  setActions: (slug, action) => {
    set((state) => {
      const existing = state.actions[slug] ?? [];
      if (existing.includes(action)) return state;

      return { actions: { ...state.actions, [slug]: [...existing, action] } };
    });
  },
}));
