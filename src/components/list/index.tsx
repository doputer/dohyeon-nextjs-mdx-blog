import Link from 'next/link';

import { format } from 'date-fns';

import type { Post } from '@/lib/MDX/types';

interface ListProps {
  posts: Post[];
}

const List = ({ posts }: ListProps) => {
  const datas = posts.reduce<Record<string, Post[]>>((acc, post) => {
    const year = format(post.frontmatter.date, 'yyyy');

    if (!acc[year]) acc[year] = [];
    acc[year].push(post);

    return acc;
  }, {});

  const sorted = Object.entries(datas).sort(([a], [b]) => Number(b) - Number(a));

  return (
    <section className="space-y-4">
      {sorted.map(([year, posts]) => (
        <article key={year} className="flex gap-8">
          <div className="text-lg">{year}</div>
          <div className="flex flex-1 flex-col space-y-4">
            {posts.map((post) => (
              <Link key={post.slug} className="flex justify-between" href={post.slug}>
                <div className="flex w-full justify-between gap-2 text-lg">
                  <h2 className="text-lg">{post.frontmatter.title}</h2>
                  <time dateTime={post.frontmatter.date} className="text-lg">
                    {format(post.frontmatter.date, 'MM.dd')}
                  </time>
                </div>
              </Link>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
};

export default List;
