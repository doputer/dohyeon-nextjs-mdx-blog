import { toYearMonthDay } from '@/utils/date';

interface HeaderProps {
  title: string;
  description: string;
  date: string;
}

const Header = ({ title, description, date }: HeaderProps) => {
  return (
    <header className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight break-keep">{title}</h1>
      <div className="flex items-baseline gap-2">
        <p className="text-lg break-keep text-muted">{description}</p>
        <time dateTime={date} className="shrink-0 text-sm font-medium text-soft tabular-nums">
          {toYearMonthDay(date)}
        </time>
      </div>
    </header>
  );
};

export default Header;
