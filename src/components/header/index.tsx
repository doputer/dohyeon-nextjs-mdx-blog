import Logo from '@/components/header/logo';
import ThemeSwitch from '@/components/theme-switch';

const Header = () => {
  return (
    <header className="flex items-center justify-between">
      <Logo />
      <ThemeSwitch />
    </header>
  );
};

export default Header;
