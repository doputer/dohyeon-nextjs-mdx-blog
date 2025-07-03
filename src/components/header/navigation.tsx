'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useMemo } from 'react';

import config from '@/configs/config.json';
import { cn } from '@/utils/cn';

const menus = [
  { label: config.name, path: '/' },
  { label: '소개', path: '/about' },
  { label: '태그', path: '/tags' },
];

const Navigation = () => {
  const pathname = usePathname();
  const current = useMemo(() => {
    if (pathname.startsWith('/about')) return 1;
    else if (pathname.startsWith('/tags')) return 2;
    return 0;
  }, [pathname]);

  return (
    <nav className="flex gap-4">
      {menus.map(({ label, path }, index) => (
        <Link
          key={label}
          href={path}
          className={cn(
            'text-xl font-medium text-mute capitalize transition-colors duration-300 ease-out hover:text-soft',
            current === index && 'text-inherit hover:text-inherit'
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
