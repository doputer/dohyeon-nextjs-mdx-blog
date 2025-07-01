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
              <div className="text-lg font-medium transition-colors duration-300 ease-out group-hover:text-link md:text-xl">
                {frontmatter.title}
              </div>
              <div>{frontmatter.description}</div>
              <time className="block text-sm text-subtle">{frontmatter.date}</time>
            </div>
          </Item>
        </Link>
      ))}
    </div>
  );
};

export default List;
