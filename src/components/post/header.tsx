import type { Frontmatter } from '@/lib/MDX/types';

interface HeaderProps {
  title: Frontmatter['title'];
  date: Frontmatter['date'];
}

const Header = ({ title, date }: HeaderProps) => {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
      <time className="block">{date}</time>
    </div>
  );
};

export default Header;
