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
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
      <div className="space-x-2">
        {tags.map((tag) => (
          <Link
            key={tag}
            href={`/tags/${encode(tag)}`}
            className="bg-accent text-secondary rounded-2xl px-3 py-1.5 text-sm uppercase"
          >
            #{tag}
          </Link>
        ))}
      </div>
      <time className="block text-sm">{date}</time>
    </div>
  );
};

export default Header;
