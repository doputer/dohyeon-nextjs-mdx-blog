import Link from 'next/link';

import Item from '@/components/list/item';
import type { Post } from '@/lib/MDX/types';

interface ListProps {
  posts: Post[];
}

const List = ({ posts }: ListProps) => {
  return (
    <section className="grid grid-flow-row gap-8 md:gap-12">
      {posts.map(({ frontmatter, slug }) => (
        <article key={frontmatter.title} className="group">
          <Link href={slug}>
            <Item emoji={frontmatter.emoji}>
              <div className="space-y-2">
                <h2 className="text-lg font-medium transition-colors duration-300 ease-out group-hover:text-link md:text-xl">
                  {frontmatter.title}
                </h2>
                <p className="text-sm md:text-base">{frontmatter.description}</p>
                <time className="block text-sm text-subtle">{frontmatter.date}</time>
              </div>
            </Item>
          </Link>
        </article>
      ))}
    </section>
  );
};

export default List;
