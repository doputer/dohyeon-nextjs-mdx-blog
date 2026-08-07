'use client';

import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';

import useTheme from '@/hooks/use-theme';

const ThemeSwitch = () => {
  const { toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className="relative size-7 overflow-hidden transition-colors duration-300 ease-out hover:text-orange dark:hover:text-yellow"
      onClick={toggleTheme}
      aria-label="테마 변경"
    >
      <div
        aria-hidden
        className="absolute top-0 right-0 left-0 flex flex-col items-center transition-transform duration-300 ease-out dark:rotate-180"
      >
        <SunIcon />
        <MoonIcon className="rotate-180" />
      </div>
    </button>
  );
};

export default ThemeSwitch;
