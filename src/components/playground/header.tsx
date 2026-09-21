import type { Frontmatter } from '@/lib/MDX/types';

interface HeaderProps {
  title: Frontmatter['title'];
  description: Frontmatter['description'];
}

const Header = ({ title, description }: HeaderProps) => {
  return (
    <header className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight break-keep">{title}</h1>
      <p className="text-sm break-keep text-muted">{description}</p>
    </header>
  );
};

export default Header;
