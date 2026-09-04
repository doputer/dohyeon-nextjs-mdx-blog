'use client';

import useTheme from '@/hooks/use-theme';

const ThemeSwitch = () => {
  const { toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className="relative size-4 overflow-hidden text-muted transition-colors duration-200 ease-out hover:text-main"
      onClick={toggleTheme}
      aria-label="테마 변경"
    >
      <span
        aria-hidden
        className="absolute top-0 right-0 left-0 flex flex-col items-center transition-transform duration-200 ease-out dark:rotate-180"
      >
        <span className="flex size-4 items-center justify-center leading-none">낮</span>
        <span className="flex size-4 rotate-180 items-center justify-center leading-none">밤</span>
      </span>
    </button>
  );
};

export default ThemeSwitch;
