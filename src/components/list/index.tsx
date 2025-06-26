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
          className="group flex items-center gap-6 md:gap-8"
        >
          <div className="group-hover:animate-flip pointer-events-none text-4xl select-none md:text-5xl">
            {frontmatter.emoji}
          </div>
          <div className="flex-1">
            <div className="group-hover:text-link font-medium transition-colors duration-300 ease-out md:text-xl">
              {frontmatter.title}
            </div>
            <div className="text-subtle my-2 text-sm md:text-base">{frontmatter.description}</div>
            <time className="block text-xs font-light md:text-sm">{frontmatter.date}</time>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default List;
