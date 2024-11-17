'use client';

import Link from 'next/link';

import { AlignJustify, X } from 'lucide-react';

import type { Nav } from '@/components/Header';
import useMenu from '@/hooks/useMenu';

interface MenuProps {
  links: Nav[];
}

const Menu = ({ links }: MenuProps) => {
  const [, ...restLinks] = links;
  const [open, toggleMenu] = useMenu();

  return (
    <div className="relative z-10 xs:hidden">
      {open && (
        <>
          <div className="fixed left-0 top-0 h-full w-full bg-black/40 backdrop-blur-sm" />
          <div className="relative">
            <button className="flex items-center" onClick={toggleMenu} aria-label="Close Button">
              <X className="size-6 text-white" />
            </button>
            <ul className="absolute right-0 top-full mt-2 flex min-w-48 flex-col rounded-lg bg-background p-2 text">
              {restLinks.map(({ name, href }) => (
                <li key={name} className="text-lg" onClick={toggleMenu}>
                  <Link
                    href={href}
                    className="block w-full rounded-lg px-4 py-2 capitalize hover:bg-surface"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      {!open && (
        <button className="flex items-center" onClick={toggleMenu} aria-label="Open Button">
          <AlignJustify className="size-6" />
        </button>
      )}
    </div>
  );
};

export default Menu;
