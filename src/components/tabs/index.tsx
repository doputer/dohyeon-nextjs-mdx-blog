import Link from 'next/link';

import { cn } from '@/utils/cn';

const TABS = [
  { key: 'posts', href: '/', label: '글' },
  { key: 'lab', href: '/lab', label: '실험실' },
] as const;

interface TabsProps {
  active: (typeof TABS)[number]['key'];
}

const Tabs = ({ active }: TabsProps) => {
  return (
    <nav className="flex items-center gap-4">
      {TABS.map(({ key, href, label }) => (
        <Link
          key={key}
          href={href}
          aria-current={key === active ? 'page' : undefined}
          className={cn(
            'text-sm font-medium transition-colors duration-200 ease-out sm:text-base',
            key === active ? 'text-main' : 'text-muted hover:text-main'
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
};

export default Tabs;
