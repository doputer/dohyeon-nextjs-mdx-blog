import Link from 'next/link';

import Logo from '@/components/header/logo';
import ThemeSwitch from '@/components/theme-switch';

const Header = () => {
  return (
    <header className="flex items-center justify-between">
      <Logo />
      <div className="flex items-center gap-4">
        <Link
          href="/playground"
          className="text-muted transition-colors duration-200 ease-out hover:text-main"
        >
          플레이그라운드
        </Link>
        <ThemeSwitch />
      </div>
    </header>
  );
};

export default Header;
