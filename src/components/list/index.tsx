import Link from 'next/link';

import Item from '@/components/list/item';
import type { Post } from '@/lib/MDX/types';

interface ListProps {
  posts: Post[];
}

const List = ({ posts }: ListProps) => {
  return (
    <section className="grid grid-flow-row gap-4 sm:gap-8">
      {posts.map(({ frontmatter, slug }) => (
        <article key={frontmatter.title} className="group pb-4">
          <Link href={slug}>
            <Item emoji={frontmatter.emoji}>
              <div className="space-y-1 sm:space-y-1.5">
                <div className="text-xs text-subtle sm:text-sm">프론트엔드</div>
                <h2 className="text-lg font-semibold break-keep transition-colors duration-300 ease-out group-hover:text-link sm:text-xl">
                  {frontmatter.title}
                </h2>
                <p className="text-sm font-medium break-keep sm:block sm:text-base">
                  {frontmatter.description}
                </p>
                <time className="text-xs text-subtle sm:block sm:text-sm">{frontmatter.date}</time>
              </div>
            </Item>
          </Link>
        </article>
      ))}
    </section>
  );
};

export default List;
