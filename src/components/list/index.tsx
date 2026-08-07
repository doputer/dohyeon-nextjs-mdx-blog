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

  const list = Object.entries(group).toSorted(([a], [b]) => Number(b) - Number(a));

  return (
    <div className="group">
      {list.map(([year, posts]) => (
        <section
          key={year}
          aria-labelledby={`year-${year}`}
          className="grid grid-cols-[auto_1fr] gap-6 transition-opacity duration-300 ease-out group-hover:opacity-40 hover:opacity-100! sm:gap-8"
        >
          <h2
            id={`year-${year}`}
            className="h-fit py-3 font-medium text-accent tabular-nums select-none sm:text-lg"
          >
            {year}
          </h2>
          <ul>
            {posts.map(({ frontmatter, slug }) => (
              <li key={slug} className="group/li">
                <Link href={`/${slug}`} className="flex justify-between gap-4 py-3">
                  <h3 className="break-keep sm:text-lg">
                    <span className="bg-[linear-gradient(var(--color-accent),var(--color-accent))] bg-size-[0%_1.5px] bg-position-[0_100%] bg-no-repeat transition-[background-size] duration-300 ease-out group-hover/li:bg-size-[100%_1.5px]">
                      {frontmatter.title}
                    </span>
                    <span
                      aria-hidden
                      data-emoji={frontmatter.emoji}
                      className="relative after:absolute after:top-1/2 after:ml-2 after:scale-75 after:opacity-0 after:transition-all after:duration-300 after:ease-[cubic-bezier(0.34,1.56,0.64,1)] after:content-[attr(data-emoji)] group-hover/li:after:-translate-y-1/2 group-hover/li:after:scale-100 group-hover/li:after:opacity-100"
                    />
                  </h3>
                  <time
                    dateTime={frontmatter.date}
                    className="shrink-0 text-muted tabular-nums transition-colors duration-300 ease-out group-hover/li:text-accent sm:text-lg"
                  >
                    {format(frontmatter.date, 'MM.dd')}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
};

export default List;
