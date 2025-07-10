import Link from 'next/link';

import { format } from 'date-fns';

import type { Post } from '@/lib/MDX/types';
import { cn } from '@/utils/cn';

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
    <section className="group">
      {list.map(([year, posts]) => (
        <section
          key={year}
          className={cn(
            'group/section grid grid-cols-[auto_1fr] gap-4 hover:text-main sm:gap-8',
            'group-hover:text-soft'
          )}
        >
          <span
            className={cn(
              'relative h-fit py-3 transition-colors duration-300 ease-out select-none sm:text-lg',
              'before:absolute before:-inset-x-1 before:inset-y-2 before:-z-10 before:rounded before:bg-surface before:opacity-0 before:transition-opacity before:duration-300 group-hover/section:before:opacity-100 sm:before:-inset-x-2 sm:before:inset-y-1'
            )}
          >
            {year}
          </span>
          <ul className="group-hover:text-inherit">
            {posts.map(({ frontmatter, slug }) => (
              <li
                key={slug}
                className={cn(
                  'group/li relative',
                  'before:absolute before:-inset-x-1 before:inset-y-2 before:-z-10 before:rounded before:bg-surface before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 sm:before:-inset-x-2 sm:before:inset-y-1'
                )}
              >
                <Link href={`/${slug}`} className="flex justify-between gap-4 py-3">
                  <h2 className="break-keep transition-colors duration-300 ease-out sm:text-lg">
                    {frontmatter.title}
                    <span
                      data-emoji={frontmatter.emoji}
                      className="relative after:absolute after:top-1/2 after:ml-2 after:opacity-0 after:transition-all after:duration-300 after:content-[attr(data-emoji)] group-hover/li:after:-translate-y-1/2 group-hover/li:after:opacity-100"
                    />
                  </h2>
                  <time
                    dateTime={frontmatter.date}
                    className={cn(
                      'shrink-0 text-mute transition-colors duration-300 ease-out sm:text-lg',
                      'group-hover:text-soft',
                      'group-hover/section:text-mute'
                    )}
                  >
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
