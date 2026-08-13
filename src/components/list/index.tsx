import Link from 'next/link';

import type { Post } from '@/lib/MDX/types';
import { toMonthDay, toYear } from '@/utils/date';

interface ListProps {
  posts: Post[];
}

const List = ({ posts }: ListProps) => {
  const group = posts.reduce<Record<string, Post[]>>((acc, post) => {
    const year = toYear(post.frontmatter.date);

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
          className="grid grid-cols-[auto_1fr] gap-6 transition-opacity duration-200 ease-out group-hover:opacity-40 hover:opacity-100! sm:gap-8"
        >
          <h2
            id={`year-${year}`}
            className="h-fit py-3.5 text-sm font-medium text-muted tabular-nums select-none sm:text-base"
          >
            {year}
          </h2>
          <ul>
            {posts.map(({ frontmatter, slug }) => (
              <li key={slug} className="group/li">
                <Link href={`/${slug}`} className="flex items-baseline justify-between gap-4 py-3">
                  <h3 className="break-keep sm:text-lg">
                    <span className="underline-grow group-hover/li:bg-size-[100%_1px]">
                      {frontmatter.title}
                    </span>
                    <span
                      aria-hidden
                      data-emoji={frontmatter.emoji}
                      className="relative after:absolute after:top-1/2 after:ml-2 after:scale-75 after:opacity-0 after:transition-all after:duration-200 after:ease-[cubic-bezier(0.34,1.56,0.64,1)] after:content-[attr(data-emoji)] group-hover/li:after:-translate-y-1/2 group-hover/li:after:scale-100 group-hover/li:after:opacity-100"
                    />
                  </h3>
                  <time
                    dateTime={frontmatter.date}
                    className="shrink-0 text-sm text-muted tabular-nums transition-colors duration-200 ease-out group-hover/li:text-main sm:text-base"
                  >
                    {toMonthDay(frontmatter.date)}
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
