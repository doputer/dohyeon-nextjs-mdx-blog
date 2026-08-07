import FloatingBar from '@/components/header/floating-bar';
import Logo from '@/components/header/logo';
import Search from '@/components/search';
import ThemeSwitch from '@/components/theme-switch';

const Header = () => {
  return (
    <header className="flex min-h-8 items-center">
      <Logo />
      <FloatingBar>
        <Search />
        <ThemeSwitch />
      </FloatingBar>
    </header>
  );
};

export default Header;
