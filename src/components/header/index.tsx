import Link from 'next/link';

import MobileNavigation from '@/components/header/mobile-navigation';
import Navigation from '@/components/header/navigation';
import Github from '@/components/icon/github';
import ThemeSwitch from '@/components/theme-switch';
import config from '@/configs/config.json';

export type Menu = { label: string; path: string };

const menus: Menu[] = [
  { label: config.name, path: '/' },
  { label: 'posts', path: '/pages/1' },
  { label: 'about', path: '/about' },
  { label: 'tags', path: '/tags' },
] satisfies Menu[];

const Header = () => {
  const home = menus[0];

  return (
    <header className="flex items-center justify-between">
      <Link
        key={home.label}
        href={home.path}
        className="max-mobile:inline bg-surface z-10 hidden rounded-3xl px-4 py-1 font-medium capitalize"
      >
        {home.label}
      </Link>
      <Navigation menus={menus} />
      <div className="flex gap-4">
        <ThemeSwitch position="header" />
        <a href={config.social.github} target="_blank" aria-label="GitHub Link">
          <Github className="size-6" />
        </a>
        <MobileNavigation menus={menus} />
      </div>
    </header>
  );
};

export default Header;
