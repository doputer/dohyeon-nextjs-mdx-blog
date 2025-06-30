import Link from 'next/link';

import Emoji from '@/components/emoji';
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
          <div className="flex size-full max-h-12 max-w-12 items-center justify-center text-4xl transition-transform duration-300 ease-out group-hover:scale-150 md:max-h-14 md:max-w-14 md:text-5xl">
            <Emoji emoji={frontmatter.emoji} />
          </div>
          <div className="space-y-2">
            <div className="text-lg font-medium transition-colors duration-300 ease-out group-hover:text-link md:text-xl">
              {frontmatter.title}
            </div>
            <div>{frontmatter.description}</div>
            <time className="block text-sm text-subtle">{frontmatter.date}</time>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default List;
