import Link from 'next/link';

import type { Post } from '@/lib/MDX/types';
import { encode } from '@/utils/uri';

interface ListProps {
  posts: Post[];
}

const List = ({ posts }: ListProps) => {
  return (
    <div className="divide-line divide-y divide-dashed">
      {posts.map(({ frontmatter, slug }) => (
        <div key={frontmatter.title} className="not-first-of-type:pt-4 not-last-of-type:pb-4">
          <div className="group md:hover:bg-surface flex items-center gap-8 rounded-lg px-0 py-2 md:px-6 md:py-4">
            <div className="group-hover:animate-flip pointer-events-none hidden text-5xl select-none md:block">
              {frontmatter.emoji}
            </div>
            <div className="flex-1">
              <div className="flex items-baseline justify-between gap-2 md:justify-normal">
                <Link href={`/${slug}`} className="text-lg font-medium break-keep md:text-xl">
                  <span className="mr-2 md:hidden">{frontmatter.emoji}</span>
                  {frontmatter.title}
                </Link>
                <time className="text-sm font-light">{frontmatter.date}</time>
              </div>
              <div className="text-secondary mt-1 mb-2 space-x-2 text-sm uppercase">
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
