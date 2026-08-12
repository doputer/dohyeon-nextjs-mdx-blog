import Tags from '@/components/tags';
import type { Frontmatter } from '@/lib/MDX/types';
import { toYearMonthDay } from '@/utils/date';

interface HeaderProps {
  title: Frontmatter['title'];
  date: Frontmatter['date'];
  tags: Frontmatter['tags'];
}

const Header = ({ title, date, tags }: HeaderProps) => {
  return (
    <header className="space-y-3">
      <h1 className="text-[1.75rem] leading-[1.35] font-bold tracking-[-0.02em] break-keep sm:text-[2rem]">
        {title}
      </h1>
      <div className="flex items-baseline gap-2 text-sm">
        <time dateTime={date} className="text-muted tabular-nums">
          {toYearMonthDay(date)}
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
