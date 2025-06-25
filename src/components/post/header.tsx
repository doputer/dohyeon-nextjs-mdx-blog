import Link from 'next/link';

import type { Frontmatter } from '@/lib/MDX/types';
import { encode } from '@/utils/uri';

interface HeaderProps {
  title: Frontmatter['title'];
  date: Frontmatter['date'];
  tags: Frontmatter['tags'];
}

const Header = ({ title, date, tags }: HeaderProps) => {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-medium tracking-tight md:text-3xl">{title}</h1>
      <div className="flex flex-wrap items-center gap-2">
        <time className="text-sm">{date}</time>
        <span className="text-sm">/</span>
        {tags.map((tag) => (
          <Link key={tag} href={`/tags/${encode(tag)}`} className="text-link text-sm uppercase">
            #{tag}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Header;
