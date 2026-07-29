import type { Frontmatter } from '@/lib/MDX/types';

import { format } from 'date-fns';

interface HeaderProps {
  title: Frontmatter['title'];
  date: Frontmatter['date'];
}

const Header = ({ title, date }: HeaderProps) => {
  return (
    <section className="space-y-2">
      <h1 className="text-3xl font-bold tracking-tight break-keep">{title}</h1>
      <time dateTime={date} className="text-sm font-medium text-accent tabular-nums">
        {format(date, 'yyyy.MM.dd')}
      </time>
    </section>
  );
};

export default Header;
