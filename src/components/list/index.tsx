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
    <section className="group">
      {list.map(([year, posts]) => (
        <section key={year} className="group/section grid grid-cols-[auto_1fr] gap-4 sm:gap-8">
          <div className="relative h-fit py-3 sm:text-lg">
            <div className="relative z-10 group-hover:text-mute group-hover/section:text-main group-active:text-mute group-active/section:text-main">
              {year}
            </div>
            <div className="pointer-events-none absolute inset-0 -mx-1.5 my-2 rounded bg-surface opacity-0 transition-opacity duration-300 group-hover/section:opacity-100 group-active/section:opacity-100 sm:-mx-2 sm:my-1" />
          </div>
          <ul className="group/ul">
            {posts.map(({ frontmatter, slug }) => (
              <li
                key={slug}
                className="group/li relative group-hover:text-mute group-hover/section:text-main group-hover/ul:text-mute group-active:text-mute group-active/section:text-main group-active/ul:text-mute"
              >
                <Link
                  href={slug}
                  className="relative z-10 flex justify-between gap-2 py-3 group-hover/li:text-main group-active/li:text-main"
                >
                  <h2 data-emoji={frontmatter.emoji} className="break-keep sm:text-lg">
                    {frontmatter.title}
                    <span
                      data-emoji={frontmatter.emoji}
                      className="relative after:absolute after:top-1/2 after:ml-2 after:opacity-0 after:transition-all after:duration-300 after:content-[attr(data-emoji)] group-hover/li:after:-translate-y-1/2 group-hover/li:after:opacity-100"
                    />
                  </h2>
                  <time dateTime={frontmatter.date} className="shrink-0 text-mute sm:text-lg">
                    {format(frontmatter.date, 'MM.dd')}
                  </time>
                </Link>

                <div className="pointer-events-none absolute inset-0 -mx-1.5 my-2 rounded bg-surface opacity-0 transition-opacity duration-300 group-hover/li:opacity-100 group-active/li:opacity-100 sm:-mx-2 sm:my-1" />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </section>
  );
};

export default List;
