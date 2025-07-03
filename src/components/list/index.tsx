import Link from 'next/link';

import Item from '@/components/list/item';
import type { Post } from '@/lib/MDX/types';

interface ListProps {
  posts: Post[];
}

const List = ({ posts }: ListProps) => {
  return (
    <section className="grid grid-flow-row gap-6 sm:gap-8">
      {posts.map(({ frontmatter, slug }) => (
        <article key={frontmatter.title} className="group">
          <Link href={slug}>
            <Item emoji={frontmatter.emoji}>
              <div className="space-y-1.5">
                <span className="block text-xs text-mute sm:text-sm">{frontmatter.category}</span>
                <h2 className="text-xl font-semibold break-keep transition-colors duration-300 ease-out group-hover:text-link group-active:text-link sm:text-2xl">
                  {frontmatter.title}
                </h2>
                <p className="text-sm font-medium break-keep sm:block sm:text-base">
                  {frontmatter.description}
                </p>
                <time className="block text-xs text-mute sm:text-sm">{frontmatter.date}</time>
              </div>
            </Item>
          </Link>
        </article>
      ))}
    </section>
  );
};

export default List;
