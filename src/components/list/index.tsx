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
          <div className="pointer-events-none text-4xl select-none group-hover:animate-flip md:text-5xl">
            {frontmatter.emoji}
          </div>
          <div className="space-y-2">
            <div className="text-lg font-medium transition-colors duration-300 ease-out group-hover:text-link md:text-xl">
              {frontmatter.title}
            </div>
            <div className="text-sm md:text-base">{frontmatter.description}</div>
            <time className="block text-xs text-subtle md:text-sm">{frontmatter.date}</time>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default List;
