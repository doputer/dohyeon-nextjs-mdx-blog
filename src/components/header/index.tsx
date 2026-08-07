import Actions from '@/components/header/actions';
import Navigation from '@/components/header/navigation';

const Header = () => {
  return (
    <header className="flex min-h-8 items-center">
      <Navigation />
      <Actions />
    </header>
  );
};

export default Header;
