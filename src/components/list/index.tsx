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
        <section key={year} className="group/section grid grid-cols-[auto_1fr] gap-2 sm:gap-8">
          <div className="relative h-fit py-2 sm:text-lg">
            <div className="relative z-10">{year}</div>
            <div className="pointer-events-none absolute inset-0 -mx-0.5 my-1.5 rounded bg-surface opacity-0 transition-opacity duration-300 group-hover/section:opacity-100 sm:-mx-2 sm:my-0.5" />
          </div>
          <ul>
            {posts.map(({ frontmatter, slug }) => (
              <li key={slug} className="group relative">
                <Link href={slug} className="relative z-10 flex justify-between gap-2 py-2">
                  <h2 data-emoji={frontmatter.emoji} className="break-keep sm:text-lg">
                    {frontmatter.title}
                    <span
                      data-emoji={frontmatter.emoji}
                      className="relative after:absolute after:top-1/2 after:ml-2 after:opacity-0 after:transition-all after:duration-300 after:content-[attr(data-emoji)] group-hover:after:-translate-y-1/2 group-hover:after:opacity-100"
                    />
                  </h2>
                  <time dateTime={frontmatter.date} className="shrink-0 text-mute sm:text-lg">
                    {format(frontmatter.date, 'MM.dd')}
                  </time>
                </Link>

                <div className="pointer-events-none absolute inset-0 -mx-0.5 my-1.5 rounded bg-surface opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:-mx-2 sm:my-0.5" />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </section>
  );
};

export default List;
