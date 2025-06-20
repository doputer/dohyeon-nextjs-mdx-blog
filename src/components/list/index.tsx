import Link from 'next/link';

import type { Post } from '@/lib/MDX/types';

interface ListProps {
  posts: Post[];
}

const List = ({ posts }: ListProps) => {
  return (
    <div className="divide-line divide-y divide-dashed">
      {posts.map(({ frontmatter, slug }) => (
        <Link
          key={frontmatter.title}
          href={`/${slug}`}
          className="group max-mobile:px-3 max-mobile:not-first-of-type:pt-4 max-mobile:not-last-of-type:pb-4 max-mobile:gap-6 flex items-center gap-8 px-6 not-first-of-type:pt-8 not-last-of-type:pb-8"
        >
          <div className="group-hover:animate-flip max-mobile:text-4xl pointer-events-none text-5xl select-none">
            {frontmatter.emoji}
          </div>
          <div className="flex-1">
            <div className="group-hover:text-secondary max-mobile:text-base block text-xl font-medium break-keep transition-colors duration-300 ease-out">
              {frontmatter.title}
            </div>
            <div className="text-muted max-mobile:text-sm max-mobile:mb-2 max-mobile:mt-1 my-2">
              {frontmatter.description}
            </div>
            <time className="max-mobile:text-xs block text-sm font-light">{frontmatter.date}</time>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default List;
