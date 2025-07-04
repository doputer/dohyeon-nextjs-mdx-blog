import Link from 'next/link';

import config from '@/configs/config.json';

const Navigation = () => {
  return (
    <nav>
      <Link href="/" className="text-2xl font-semibold">
        {config.name}
      </Link>
    </nav>
  );
};

export default Navigation;
