import Link from 'next/link';

import type { Post } from '@/lib/MDX/types';
import { encode } from '@/utils/uri';

interface ListProps {
  posts: Post[];
}

const List = ({ posts }: ListProps) => {
  return (
    <div className="divide-y divide-dashed divide-line">
      {posts.map(({ frontmatter, slug }) => (
        <div
          key={frontmatter.title}
          className="[&:not(:first-of-type)]:pt-4 [&:not(:last-of-type)]:pb-4"
        >
          <div className="group flex items-center gap-8 rounded-lg px-0 py-2 md:px-6 md:py-4 md:hover:bg-surface">
            <div className="pointer-events-none hidden select-none text-5xl group-hover:animate-flip md:block">
              {frontmatter.emoji}
            </div>
            <div className="flex-1">
              <div className="flex items-baseline justify-between gap-2 md:justify-normal">
                <Link href={`/${slug}`} className="break-keep text-lg font-medium md:text-xl">
                  <span className="mr-2 md:hidden">{frontmatter.emoji}</span>
                  {frontmatter.title}
                </Link>
                <time className="text-sm font-light">{frontmatter.date}</time>
              </div>
              <div className="mb-2 mt-1 space-x-2 text-sm uppercase text-secondary">
                {frontmatter.tags.map((tag) => (
                  <Link key={tag} href={`/tags/${encode(tag)}`}>
                    {tag}
                  </Link>
                ))}
              </div>
              <div className="text-muted">{frontmatter.description}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default List;
