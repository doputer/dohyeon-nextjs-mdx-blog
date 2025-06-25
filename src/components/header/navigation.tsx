'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { Menu } from '@/components/header';
import { cn } from '@/utils/cn';

interface GNBProps {
  menus: Menu[];
}

const Navigation = ({ menus }: GNBProps) => {
  const pathname = usePathname();
  const refs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({
    transform: 'translate3d(0px, 0, 0)',
    width: '0px',
  });

  const getActiveIndex = useCallback(() => {
    const index = menus.findIndex(({ path }) => {
      return pathname === path || (path !== '/' && pathname.startsWith(path));
    });

    return index !== -1 ? index : 0;
  }, [menus, pathname]);

  const activeIndex = useMemo(() => getActiveIndex(), [getActiveIndex]);

  const updateIndicator = useCallback(() => {
    const targetEl = refs.current[activeIndex];
    const parentEl = targetEl?.parentElement;

    if (!targetEl || !parentEl) return;

    const targetRect = targetEl.getBoundingClientRect();
    const parentRect = parentEl.getBoundingClientRect();

    const translateX = targetRect.left - parentRect.left;
    const width = targetRect.width;

    setIndicatorStyle({
      transform: `translate3d(${translateX}px, 0, 0)`,
      width: `${width}px`,
    });
  }, [activeIndex]);

  useEffect(() => {
    updateIndicator();
  }, [pathname, updateIndicator]);

  return (
    <nav className="relative grid auto-cols-auto grid-flow-col">
      <div
        className="bg-surface absolute size-full origin-center rounded-3xl transition-transform duration-300 ease-out"
        style={indicatorStyle}
      />

      {menus.map(({ label, path }, index) => (
        <Link
          key={label}
          href={path}
          ref={(el) => {
            refs.current[index] = el;
          }}
          className={cn(
            'text-subtle z-10 px-4 py-1 font-medium capitalize transition-colors duration-300 ease-out',
            activeIndex === index && 'text-inherit'
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
