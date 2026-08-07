import { format } from 'date-fns';

import Tags from '@/components/tags';
import type { Frontmatter } from '@/lib/MDX/types';

interface HeaderProps {
  title: Frontmatter['title'];
  date: Frontmatter['date'];
  tags: Frontmatter['tags'];
}

const Header = ({ title, date, tags }: HeaderProps) => {
  return (
    <header className="space-y-2">
      <h1 className="text-3xl font-bold tracking-tight break-keep">{title}</h1>
      <div className="flex items-baseline gap-2 text-sm">
        <time dateTime={date} className="font-medium text-muted tabular-nums">
          {format(date, 'yyyy.MM.dd')}
        </time>
        <span className="text-soft" aria-hidden>
          ·
        </span>
        <Tags tags={tags} />
      </div>
    </header>
  );
};

export default Header;
