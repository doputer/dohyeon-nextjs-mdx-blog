import Navigation from '@/components/header/navigation';
import ThemeSwitch from '@/components/theme-switch';
import config from '@/configs/config.json';

export type Menu = { label: string; path: string };

const menus: Menu[] = [
  { label: config.name, path: '/' },
  { label: 'about', path: '/about' },
  { label: 'tags', path: '/tags' },
] satisfies Menu[];

const Header = () => {
  return (
    <header className="flex items-center justify-between">
      <Navigation menus={menus} />
      <ThemeSwitch />
    </header>
  );
};

export default Header;
