import Link from 'next/link';

import Item from '@/components/list/item';
import type { Post } from '@/lib/MDX/types';

interface ListProps {
  posts: Post[];
}

const List = ({ posts }: ListProps) => {
  return (
    <div className="grid grid-flow-row gap-8 md:gap-12">
      {posts.map(({ frontmatter, slug }) => (
        <Link key={frontmatter.title} href={slug}>
          <Item emoji={frontmatter.emoji}>
            <div className="space-y-2">
              <div className="font-medium transition-colors duration-300 ease-out group-hover:text-link md:text-lg">
                {frontmatter.title}
              </div>
              <div className="text-sm md:text-base">{frontmatter.description}</div>
              <time className="block text-xs text-subtle md:text-sm">{frontmatter.date}</time>
            </div>
          </Item>
        </Link>
      ))}
    </div>
  );
};

export default List;
