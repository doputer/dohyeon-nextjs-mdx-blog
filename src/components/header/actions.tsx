'use client';

import { useEffect, useState } from 'react';

import Search from '@/components/search';
import ThemeSwitch from '@/components/theme-switch';
import { cn } from '@/utils/cn';

const Actions = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40">
      <div className="mx-auto flex w-full max-w-2xl justify-end px-6 py-12">
        <div
          className={cn(
            'pointer-events-auto -my-1 flex items-center gap-2 px-3 py-1',
            'rounded-full transition duration-300 ease-out',
            scrolled && 'bg-background/70 ring-1 ring-line backdrop-blur'
          )}
        >
          <Search />
          <ThemeSwitch />
        </div>
      </div>
    </div>
  );
};

export default Actions;
