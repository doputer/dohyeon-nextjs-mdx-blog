import type { Frontmatter } from '@/lib/MDX/types';
import { toYearMonthDay } from '@/utils/date';

interface HeaderProps {
  title: Frontmatter['title'];
  date: Frontmatter['date'];
}

const Header = ({ title, date }: HeaderProps) => {
  return (
    <header className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight break-keep">{title}</h1>
      <div className="flex items-baseline gap-2 text-sm">
        <time dateTime={date} className="font-medium text-muted tabular-nums">
          {toYearMonthDay(date)}
        </time>
      </div>
    </header>
  );
};

export default Header;
