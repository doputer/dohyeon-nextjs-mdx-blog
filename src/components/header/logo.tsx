import Link from 'next/link';

import config from '@/configs/config.json';

const Logo = () => {
  return (
    <Link href="/" className="text-xl font-bold">
      {config.name}
    </Link>
  );
};

export default Logo;
