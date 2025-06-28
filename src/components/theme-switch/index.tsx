'use client';

import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';

import useTheme from '@/hooks/use-theme';

const ThemeSwitch = () => {
  const toggleTheme = useTheme();

  return (
    <button
      className="dark:hover:text-yellow hover:text-orange relative size-6 overflow-hidden transition-transform duration-300 active:scale-90"
      onClick={toggleTheme}
      aria-label="Theme Button"
    >
      <SunIcon className="absolute top-0 left-0 translate-x-0 translate-y-0 transition-transform duration-300 dark:translate-x-full dark:-translate-y-full" />
      <MoonIcon className="absolute top-full left-0 -translate-x-full translate-y-0 transition-transform duration-300 dark:translate-x-0 dark:-translate-y-full" />
    </button>
  );
};

export default ThemeSwitch;
