import Link from 'next/link';

import { format } from 'date-fns';

import type { Post } from '@/lib/MDX/types';

interface ListProps {
  posts: Post[];
}

const List = ({ posts }: ListProps) => {
  const group = posts.reduce<Record<string, Post[]>>((acc, post) => {
    const year = format(post.frontmatter.date, 'yyyy');

    if (!acc[year]) acc[year] = [];
    acc[year].push(post);

    return acc;
  }, {});

  const list = Object.entries(group).sort(([a], [b]) => Number(b) - Number(a));

  return (
    <section>
      {list.map(([year, posts]) => (
        <section key={year} className="grid grid-cols-[auto_1fr] gap-2 sm:gap-8">
          <div className="py-2 sm:text-lg">{year}</div>
          <ul>
            {posts.map(({ frontmatter, slug }) => (
              <li key={slug}>
                <Link
                  className="flex justify-between gap-2 py-2 transition-colors duration-300 ease-out hover:*:text-link"
                  href={slug}
                >
                  <h2 className="sm:text-lg">{frontmatter.title}</h2>
                  <time dateTime={frontmatter.date} className="shrink-0 text-mute sm:text-lg">
                    {format(frontmatter.date, 'MM.dd')}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </section>
  );
};

export default List;
