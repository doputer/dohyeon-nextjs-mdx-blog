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
            'group/section grid grid-cols-[auto_1fr] gap-4 sm:gap-8',
            'group-hover:text-mute group-active:text-mute'
          )}
        >
          <span
            className={cn(
              'relative h-fit py-3 transition-colors duration-300 ease-out sm:text-lg',
              'group-hover/section:text-main group-active/section:text-main',
              'before:absolute before:-inset-x-1 before:inset-y-2 before:-z-10 before:rounded before:bg-surface before:opacity-0 before:transition-opacity before:duration-300 group-hover/section:before:opacity-100 group-active/section:before:opacity-100 sm:before:-inset-x-2 sm:before:inset-y-1'
            )}
          >
            {year}
          </span>
          <ul className="group/ul">
            {posts.map(({ frontmatter, slug }) => (
              <li
                key={slug}
                className={cn(
                  'group/li relative',
                  'group-hover/section:text-main group-active/section:text-main',
                  'group-hover/ul:text-mute group-active/ul:text-mute',
                  'before:absolute before:-inset-x-1 before:inset-y-2 before:-z-10 before:rounded before:bg-surface before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 active:before:opacity-100 sm:before:-inset-x-2 sm:before:inset-y-1'
                )}
              >
                <Link
                  href={slug}
                  className="flex justify-between py-3 group-hover/li:text-main group-active/li:text-main"
                >
                  <h2 className="pr-7 break-keep transition-colors duration-300 ease-out sm:text-lg">
                    {frontmatter.title}
                    <span
                      data-emoji={frontmatter.emoji}
                      className="relative after:absolute after:top-1/2 after:ml-2 after:opacity-0 after:transition-all after:duration-300 after:content-[attr(data-emoji)] group-hover/li:after:-translate-y-1/2 group-hover/li:after:opacity-100 group-active/li:after:-translate-y-1/2 group-active/li:after:opacity-100"
                    />
                  </h2>
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
