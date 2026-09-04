import Logo from '@/components/header/logo';
import Search from '@/components/search';
import ThemeSwitch from '@/components/theme-switch';

const Header = () => {
  return (
    <header className="flex items-center justify-between">
      <Logo />
      <nav className="flex items-center gap-2 text-sm">
        <Search />
        <span aria-hidden>|</span>
        <ThemeSwitch />
      </nav>
    </header>
  );
};

export default Header;
