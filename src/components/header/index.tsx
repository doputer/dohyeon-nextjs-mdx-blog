import Navigation from '@/components/header/navigation';
import ThemeSwitch from '@/components/theme-switch';

const Header = () => {
  return (
    <header className="flex items-center justify-between">
      <Navigation />
      <ThemeSwitch />
    </header>
  );
};

export default Header;
