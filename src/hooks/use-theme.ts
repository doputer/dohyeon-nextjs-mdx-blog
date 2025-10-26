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

    // const observer = new MutationObserver((mutations) => {
    //   for (const m of mutations) {
    //     if (m.type === 'attributes' && m.attributeName === 'data-theme') {
    //       const newTheme = document.documentElement.getAttribute('data-theme') as Theme;
    //       if (newTheme && newTheme !== theme) setTheme(newTheme);
    //     }
    //   }
    // });

    // observer.observe(document.documentElement, { attributes: true });

    return () => {
      global.window?.__removeThemeListener?.(handleTheme);
      // observer.disconnect();
    };
  }, []);

  return { theme, toggleTheme };
};

export default useTheme;
