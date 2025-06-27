import { useEffect, useState } from 'react';

import type { Theme } from '@/components/theme-switch/theme-script';

const useTheme = () => {
  const [theme, setTheme] = useState(global.window?.__theme || 'light');

  const toggleTheme = () => {
    global.window?.__setPreferredTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const handleTheme = (newTheme: Theme) => {
      setTheme(newTheme);
    };

    global.window?.__addThemeListener?.(handleTheme);

    return () => {
      global.window?.__removeThemeListener?.(handleTheme);
    };
  }, []);

  return toggleTheme;
};

export default useTheme;
