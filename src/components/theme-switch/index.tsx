'use client';

import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';

import useTheme from '@/hooks/use-theme';

const ThemeSwitch = () => {
  const { toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className="flex size-7 items-center justify-center text-muted transition-colors duration-200 ease-out hover:text-orange dark:hover:text-yellow"
      onClick={toggleTheme}
      aria-label="테마 변경"
    >
      <span aria-hidden className="relative size-5 overflow-hidden">
        <span className="absolute top-0 right-0 left-0 flex flex-col items-center transition-transform duration-300 ease-out dark:rotate-180">
          <SunIcon className="size-5" />
          <MoonIcon className="size-5 rotate-180" />
        </span>
      </span>
    </button>
  );
};

export default ThemeSwitch;
