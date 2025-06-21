'use client';

import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';

import useTheme from '@/hooks/useTheme';
import { cn } from '@/utils/cn';

interface ThemeSwitchProps {
  position: 'header' | 'toc' | 'floating';
}

const variants = {
  header: 'size-6',
  toc: 'size-5 text-subtle hover:text-link',
  floating: 'size-5 text-subtle',
};

const ThemeSwitch = ({ position }: ThemeSwitchProps) => {
  const toggleTheme = useTheme();

  return (
    <button onClick={toggleTheme} aria-label="Theme Button">
      <SunIcon className={cn('hidden dark:block', variants[position])} />
      <MoonIcon className={cn('dark:hidden', variants[position])} />
    </button>
  );
};

export default ThemeSwitch;
