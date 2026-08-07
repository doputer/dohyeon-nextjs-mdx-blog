import Logo from '@/components/header/logo';
import Search from '@/components/search';
import ThemeSwitch from '@/components/theme-switch';

const Header = () => {
  return (
    <header className="flex items-center justify-between">
      <Logo />
      <div className="flex items-center gap-2">
        <Search />
        <ThemeSwitch />
      </div>
    </header>
  );
};

export default Header;
