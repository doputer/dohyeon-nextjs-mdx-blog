'use client';

import Link from 'next/link';

import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';

import type { Nav } from '@/components/Header';
import useMenu from '@/hooks/useMenu';

interface MenuProps {
  links: Nav[];
}

const Menu = ({ links }: MenuProps) => {
  const [, ...restLinks] = links;
  const [open, toggleMenu] = useMenu();

  return (
    <div className="relative md:hidden">
      <button
        className={clsx('flex items-center', { invisible: open })}
        onClick={toggleMenu}
        aria-label="Open Menu Button"
      >
        <Bars3Icon className="size-6" />
      </button>

      {open && (
        <div className="pointer-events-auto fixed top-0 left-0 z-10 h-full w-full bg-black/40 backdrop-blur-xs" />
      )}

      {open && (
        <button className="absolute top-0 z-20" onClick={toggleMenu} aria-label="Close Menu Button">
          <XMarkIcon className="size-6 text-white" />
        </button>
      )}

      {open && (
        <div className="border-line bg-background absolute top-full right-0 z-20 mt-2 min-w-48 rounded-lg border py-2">
          <ul>
            {restLinks.map(({ name, href }) => (
              <li key={name} onClick={toggleMenu}>
                <Link href={href} className="block size-full px-6 py-2 font-light capitalize">
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Menu;
