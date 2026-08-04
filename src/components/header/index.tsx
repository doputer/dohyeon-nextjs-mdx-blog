import Navigation from '@/components/header/navigation';
import Search from '@/components/search';
import ThemeSwitch from '@/components/theme-switch';

const Header = () => {
  return (
    <header className="flex items-center justify-between">
      <Navigation />
      <div className="flex items-center gap-2">
        <Search />
        <ThemeSwitch />
      </div>
    </header>
  );
};

export default Header;
