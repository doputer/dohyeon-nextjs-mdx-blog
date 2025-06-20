import GNB from '@/components/header/gnb';
import Menu from '@/components/header/menu';
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
  return (
    <header className="flex items-center justify-between">
      <GNB menus={menus} />
      <div className="flex gap-4">
        <ThemeSwitch position="header" />
        <a href={config.social.github} target="_blank" aria-label="GitHub Link">
          <Github className="size-6" />
        </a>
        <Menu menus={menus} />
      </div>
    </header>
  );
};

export default Header;
