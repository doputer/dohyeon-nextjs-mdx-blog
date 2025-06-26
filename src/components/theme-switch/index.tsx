'use client';

import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';

import useTheme from '@/hooks/useTheme';

const ThemeSwitch = () => {
  const toggleTheme = useTheme();

  return (
    <button className="cursor-pointer" onClick={toggleTheme} aria-label="Theme Button">
      <SunIcon className="hidden size-6 dark:block" />
      <MoonIcon className="size-6 dark:hidden" />
    </button>
  );
};

export default ThemeSwitch;
