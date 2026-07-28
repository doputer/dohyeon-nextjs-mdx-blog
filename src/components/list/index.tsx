import Link from 'next/link';

import type { Post } from '@/lib/MDX/types';

import { cn } from '@/utils/cn';
import { format } from 'date-fns';

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
    <section>
      {list.map(([year, posts]) => (
        <section key={year} className="grid grid-cols-[auto_1fr] gap-6 sm:gap-8">
          <span className="h-fit py-3 font-medium text-accent tabular-nums select-none sm:text-lg">
            {year}
          </span>
          <ul>
            {posts.map(({ frontmatter, slug }) => (
              <li key={slug} className="group/li">
                <Link href={`/${slug}`} className="flex justify-between gap-4 py-3">
                  <h2 className="break-keep sm:text-lg">
                    <span
                      className={cn(
                        'bg-no-repeat transition-[background-size] duration-300 ease-out',
                        '[background-image:linear-gradient(var(--color-accent),var(--color-accent))]',
                        '[background-size:0%_1.5px] [background-position:0_100%]',
                        'group-hover/li:[background-size:100%_1.5px]'
                      )}
                    >
                      {frontmatter.title}
                    </span>
                    <span
                      data-emoji={frontmatter.emoji}
                      className={cn(
                        'relative after:absolute after:top-1/2 after:ml-2 after:content-[attr(data-emoji)]',
                        'after:scale-75 after:opacity-0 after:transition-all after:duration-300',
                        'after:ease-[cubic-bezier(0.34,1.56,0.64,1)]',
                        'group-hover/li:after:-translate-y-1/2 group-hover/li:after:scale-100 group-hover/li:after:opacity-100'
                      )}
                    />
                  </h2>
                  <time
                    dateTime={frontmatter.date}
                    className={cn(
                      'shrink-0 text-mute tabular-nums transition-colors duration-300 ease-out sm:text-lg',
                      'group-hover/li:text-accent'
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
