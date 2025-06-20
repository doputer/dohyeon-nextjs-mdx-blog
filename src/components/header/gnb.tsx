'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import clsx from 'clsx';

import type { Menu } from '@/components/header';

interface GNBProps {
  menus: Menu[];
}

const GNB = ({ menus }: GNBProps) => {
  const [homeLink] = menus;

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
        className={clsx(
          'bg-accent absolute size-full origin-center rounded-3xl duration-300 ease-out',
          'max-mobile:hidden'
        )}
        style={indicatorStyle}
      />
      <Link
        key={homeLink.label}
        href={homeLink.path}
        className={clsx(
          'text-muted bg-accent z-10 hidden rounded-3xl px-4 py-1 text-lg font-medium capitalize',
          'max-mobile:text-primary max-mobile:inline'
        )}
      >
        {homeLink.label}
      </Link>
      {menus.map((menu, index) => (
        <Link
          key={menu.label}
          href={menu.path}
          ref={(el) => {
            refs.current[index] = el;
          }}
          className={clsx(
            'text-muted z-10 px-4 py-1 text-lg font-medium capitalize transition-colors duration-300 ease-out',
            activeIndex === index && 'text-primary',
            'max-mobile:hidden'
          )}
        >
          {menu.label}
        </Link>
      ))}
    </nav>
  );
};

export default GNB;
