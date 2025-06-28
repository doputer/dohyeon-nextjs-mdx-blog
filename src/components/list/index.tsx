import Link from 'next/link';

import type { Post } from '@/lib/MDX/types';

interface ListProps {
  posts: Post[];
}

const List = ({ posts }: ListProps) => {
  return (
    <div className="grid grid-flow-row gap-8 md:gap-12">
      {posts.map(({ frontmatter, slug }) => (
        <Link
          key={frontmatter.title}
          href={`/${slug}`}
          className="group flex w-fit items-center gap-6 md:gap-8"
        >
          <div className="group-hover:animate-flip pointer-events-none select-none text-4xl md:text-5xl">
            {frontmatter.emoji}
          </div>
          <div className="space-y-2">
            <div className="group-hover:text-link text-lg font-medium transition-colors duration-300 ease-out md:text-xl">
              {frontmatter.title}
            </div>
            <div className="text-sm md:text-base">{frontmatter.description}</div>
            <time className="text-subtle block text-xs md:text-sm">{frontmatter.date}</time>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default List;
