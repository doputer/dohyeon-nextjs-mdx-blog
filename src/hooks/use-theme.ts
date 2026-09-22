import { useSyncExternalStore } from 'react';

import type { Theme } from '@/components/theme-switch/theme-script';

const subscribe = (onStoreChange: () => void) => {
  window.__addThemeListener?.(onStoreChange);

  return () => {
    window.__removeThemeListener?.(onStoreChange);
  };
};

const getSnapshot = (): Theme => window.__theme ?? 'light';
const getServerSnapshot = (): Theme => 'light';

const useTheme = () => {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = () => {
    window.__setPreferredTheme?.(theme === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme };
};

export default useTheme;
