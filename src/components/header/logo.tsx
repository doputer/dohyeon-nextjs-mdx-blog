import Link from 'next/link';

import config from '@/configs/config.json';

const Logo = () => {
  return (
    <Link href="/" className="text-lg font-bold tracking-[-0.01em]">
      {config.name}
    </Link>
  );
};

export default Logo;
