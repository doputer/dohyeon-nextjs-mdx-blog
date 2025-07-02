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
    <section className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight break-keep sm:text-3xl">{title}</h1>
      <div className="flex flex-wrap items-center gap-2">
        <time className="text-sm">{date}</time>
        <span className="text-sm">/</span>
        {tags.map((tag) => (
          <Link key={tag} href={`/tags/${encode(tag)}`} className="text-sm text-link uppercase">
            #{tag}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Header;
