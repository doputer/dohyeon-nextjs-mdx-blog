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
    const index = menus.findIndex(({ path }) => {
      return pathname === path || (path !== '/' && pathname.startsWith(path));
    });

    return index !== -1 ? index : 0;
  }, [pathname]);

  return (
    <nav className="flex gap-4">
      {menus.map(({ label, path }, index) => (
        <Link
          key={label}
          href={path}
          className={cn(
            'text-subtle font-medium capitalize transition-opacity duration-300 ease-out hover:opacity-70 md:text-lg',
            current === index && 'text-inherit hover:opacity-100'
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
