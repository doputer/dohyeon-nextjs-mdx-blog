import type { Frontmatter } from '@/lib/MDX/types';

interface HeaderProps {
  title: Frontmatter['title'];
  date: Frontmatter['date'];
}

const Header = ({ title, date }: HeaderProps) => {
  return (
    <section className="space-y-2">
      <h1 className="text-2xl font-bold tracking-tight break-keep sm:text-3xl">{title}</h1>
      <time className="text-sm">{date}</time>
    </section>
  );
};

export default Header;
