import type { Frontmatter } from '@/lib/MDX/types';

import Tags from '@/components/tags';
import { format } from 'date-fns';

interface HeaderProps {
  title: Frontmatter['title'];
  date: Frontmatter['date'];
  tags: Frontmatter['tags'];
}

const Header = ({ title, date, tags }: HeaderProps) => {
  return (
    <section className="space-y-2">
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
    </section>
  );
};

export default Header;
